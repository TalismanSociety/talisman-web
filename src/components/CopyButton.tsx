import { ReactComponent as Copy } from '@icons/copy.svg'
import styled from 'styled-components'

export const CopyButton = styled(({ className, text = '', onCopied, onFailed }) => {
  function tryLegacyCopy() {
    if (navigator.clipboard) {
      return
    }

    try {
      // use old commandExec() way
      const successful = document.execCommand('copy')
      if (successful && onCopied) {
        onCopied(text)
      }
      if (!successful && onFailed) {
        onFailed(text)
      }
    } catch (err) {
      if (onFailed) {
        onFailed(text)
      }
    }
  }

  function onCopyClicked(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation()

    tryLegacyCopy()

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(function () {
          if (onCopied) {
            onCopied(text)
          }
        })
        .catch(function () {
          if (onFailed) {
            onFailed(text)
          }
        })
    }
  }

  return (
    <button className={className} onClick={onCopyClicked}>
      <Copy />
    </button>
  )
})`
  padding: 0;
  border: 0;
  background: inherit;
  cursor: pointer;
  display: flex;

  svg {
    width: 1.8rem;
    height: auto;
  }
`
