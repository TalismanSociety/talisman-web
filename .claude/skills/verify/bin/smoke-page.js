;(() => {
  if (window.__smoke) return 'ready'
  const smoke = (window.__smoke = { requests: [], submissions: [], scope: null })

  const signing = message =>
    message.message === 'pub(extrinsic.sign)' ||
    message.message === 'pub(extrinsic.create)' ||
    (message.message === 'pub(eth.request)' && message.request?.method === 'eth_sendTransaction')
  const post = window.postMessage.bind(window)
  window.postMessage = (message, ...rest) => {
    if (message?.origin === 'talisman-page' && signing(message))
      smoke.requests.push({
        id: message.id,
        kind: message.message,
        request: JSON.parse(JSON.stringify(message.request)),
      })
    return post(message, ...rest)
  }
  window.addEventListener('message', ({ data }) => {
    if (data?.origin !== 'talisman-content') return
    const request = smoke.requests.find(entry => entry.id === data.id)
    if (!request || 'response' in request || 'error' in request) return
    if (data.error) request.error = String(data.error)
    else request.response = JSON.parse(JSON.stringify(data.response ?? null))
  })
  const send = WebSocket.prototype.send
  WebSocket.prototype.send = function (data) {
    try {
      const message = JSON.parse(data)
      if (/submit|broadcast/i.test(message.method ?? '')) {
        const submission = { url: this.url, method: message.method, extrinsic: message.params?.[0] }
        smoke.submissions.push(submission)
        this.addEventListener('message', event => {
          try {
            const reply = JSON.parse(event.data)
            if (reply.id !== message.id) return
            submission.answered = true
            if (reply.error) submission.error = [reply.error.message, reply.error.data].filter(Boolean).join(': ')
          } catch {}
        })
      }
    } catch {}
    return send.call(this, data)
  }

  const visible = element => {
    const style = getComputedStyle(element)
    if (style.display === 'contents') return [...element.children].some(visible)
    return element.getClientRects().length > 0 && style.visibility !== 'hidden'
  }
  const label = element => element.textContent.replace(/\s+/g, ' ').trim()
  const clickables = root =>
    [...root.querySelectorAll('button, [role=menuitem], [role=option], [role=tab], a')].filter(
      element => visible(element) && !element.disabled && element.getAttribute('aria-disabled') !== 'true'
    )
  const pendingPosition = '#staking > section > div:last-child > div:not(:has(button, a, img, svg))'
  const positionsLoading = () => [...document.querySelectorAll(pendingPosition)].some(visible)
  const holdsText = alternative => {
    if (!alternative.startsWith('=')) return element => element.textContent.includes(alternative)
    const holders = []
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    while (walker.nextNode())
      if (walker.currentNode.data.trim() === alternative.slice(1)) holders.push(walker.currentNode.parentElement)
    return element => holders.some(holder => element.contains(holder))
  }
  const holdsAny = text => {
    const alternatives = text.split('|').map(holdsText)
    return element => alternatives.some(holds => holds(element))
  }
  const menus = element => [...element.querySelectorAll('[aria-haspopup=menu]')].filter(visible).length
  const findRows = texts => {
    const wanted = texts.filter(text => !text.startsWith('!')).map(holdsAny)
    const unwanted = texts.filter(text => text.startsWith('!')).map(text => holdsAny(text.slice(1)))
    const matches = [...document.body.querySelectorAll('*')].filter(
      element => visible(element) && wanted.every(holds => holds(element))
    )
    const rows = new Set()
    for (const match of matches) {
      if (matches.some(other => other !== match && match.contains(other))) continue
      let row = match
      while (row && menus(row) === 0) row = row.parentElement
      if (row && menus(row) === 1 && !unwanted.some(holds => holds(row))) rows.add(row)
    }
    return rows.size ? [...rows] : `no position row with ${texts.map(text => `"${text}"`).join(', ')}`
  }
  const rowScope = (texts, from = 0) => {
    let rows
    let committed
    const scope = () => {
      rows = findRows(texts)
      if (typeof rows === 'string') return rows
      if (committed !== undefined)
        return rows[committed] ?? `position row ${committed + 1} with ${texts.join(', ')} is gone`
      return rows.slice(from)
    }
    scope.commit = root => {
      if (committed === undefined) committed = rows.indexOf(root)
    }
    scope.next = () =>
      committed === undefined || typeof rows === 'string' || committed + 1 >= rows.length
        ? undefined
        : rowScope(texts, committed + 1)
    return scope
  }
  const findDialog = () =>
    [...document.querySelectorAll('dialog:modal')].filter(dialog => visible(dialog) && label(dialog)).at(-1) ??
    'no open dialog'
  const center = element => {
    const box = [element, ...element.querySelectorAll('*')].find(node => node.getClientRects().length > 0)
    const inView = ({ top, bottom }) => top >= 0 && bottom <= innerHeight
    if (!inView(box.getBoundingClientRect())) box.scrollIntoView({ behavior: 'instant', block: 'center' })
    const { x, y, width, height } = box.getBoundingClientRect()
    return { x: x + width / 2, y: y + height / 2 }
  }
  const scopeRoots = () => {
    const roots = smoke.scope ? smoke.scope() : document.body
    return typeof roots === 'string' ? roots : [roots].flat()
  }
  const inScope = find => {
    const roots = scopeRoots()
    if (typeof roots === 'string') return roots
    for (const root of roots) {
      const found = find(root)
      if (found) {
        smoke.scope?.commit?.(root)
        return found
      }
    }
  }
  const named = (element, name) =>
    name === '#icon'
      ? !label(element) && !element.closest('[aria-haspopup]')
      : name === '#menu'
      ? !!element.closest('[aria-haspopup=menu]')
      : name.startsWith('=')
      ? label(element) === name.slice(1)
      : name.startsWith('~')
      ? label(element).replace(/\s/g, '').includes(name.slice(1).replace(/\s/g, ''))
      : label(element) === name || label(element).startsWith(`${name} `)
  const button = name =>
    inScope(root => clickables(root).find(element => name.split('|').some(alternative => named(element, alternative)))) ??
    `no enabled ${name} button${smoke.scope ? ' in the scope' : ''}`

  const steps = {
    wait: text => document.body.innerText.includes(text) || `no visible text "${text}"`,
    row: (...texts) => {
      if (positionsLoading()) return 'positions still loading'
      const rows = findRows(texts)
      if (typeof rows === 'string') return rows
      smoke.scope = smoke.rows = rowScope(texts)
      return true
    },
    page: () => {
      smoke.scope = null
      return true
    },
    dialog: () => {
      const dialog = findDialog()
      if (typeof dialog === 'string') return dialog
      smoke.scope = findDialog
      return true
    },
    see: name => {
      const target = button(name)
      return typeof target === 'string' ? target : true
    },
    press: name => {
      const target = button(name)
      return typeof target === 'string' ? target : { click: center(target) }
    },
    fill: (placeholder, value) => {
      const input =
        inScope(root => [...root.querySelectorAll(`input[placeholder="${placeholder}"]`)].find(visible)) ??
        `no input with placeholder "${placeholder}"`
      if (typeof input === 'string') return input
      input.focus()
      input.select()
      return { type: value }
    },
  }
  window.__smokeNextRow = () => {
    const next = smoke.rows?.next()
    if (!next) return false
    smoke.scope = smoke.rows = next
    return true
  }
  window.__smokeStep = step => {
    const [name, ...args] = step
    try {
      return steps[name] ? steps[name](...args) : `unknown step ${name}`
    } catch (error) {
      return String(error)
    }
  }
  return 'ready'
})()
