;(() => {
  if (window.__smoke) return 'ready'
  const smoke = (window.__smoke = { requests: [], submissions: [], scope: null })

  const signing = message =>
    message.message === 'pub(extrinsic.sign)' ||
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
  const findRow = texts => {
    const matches = [...document.body.querySelectorAll('*')].filter(
      element => visible(element) && texts.every(text => element.textContent.includes(text))
    )
    const named = texts.map(text => `"${text}"`).join(', ')
    const menus = element => [...element.querySelectorAll('[aria-haspopup=menu]')].filter(visible).length
    let row = matches.find(element => !matches.some(other => other !== element && element.contains(other)))
    while (row && menus(row) === 0) row = row.parentElement
    if (!row) return `no position row with ${named}`
    return menus(row) === 1 ? row : `${menus(row)} positions hold ${named}: not one row yet`
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
  const scopeRoot = () => (smoke.scope ? smoke.scope() : document.body)
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
  const button = name => {
    const root = scopeRoot()
    if (typeof root === 'string') return root
    const target = clickables(root).find(element => name.split('|').some(alternative => named(element, alternative)))
    return target ?? `no enabled ${name} button${smoke.scope ? ' in the scope' : ''}`
  }

  const steps = {
    wait: text => document.body.innerText.includes(text) || `no visible text "${text}"`,
    row: (...texts) => {
      const row = findRow(texts)
      if (typeof row === 'string') return row
      smoke.scope = () => findRow(texts)
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
      const root = scopeRoot()
      if (typeof root === 'string') return root
      const input = [...root.querySelectorAll(`input[placeholder="${placeholder}"]`)].find(visible)
      if (!input) return `no input with placeholder "${placeholder}"`
      input.focus()
      input.select()
      return { type: value }
    },
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
