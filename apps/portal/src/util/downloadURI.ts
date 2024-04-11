export function downloadURI(uri: string) {
  const link = document.createElement('a')
  link.href = uri
  document.body.appendChild(link)
  link.click()
  link.remove()
}
