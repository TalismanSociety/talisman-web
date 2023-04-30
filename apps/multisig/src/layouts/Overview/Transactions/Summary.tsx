import { Transaction } from '.'

export const FullScreenDialogTitle = ({ t }: { t?: Transaction }) => {
  return (
    <div>
      <h1>Transaction Summary</h1>
      return <div>{t?.createdTimestamp.toISOString() || 'none'}</div>
    </div>
  )
}

export const FullScreenDialogContents = ({ t }: { t?: Transaction }) => {
  return <div>{t?.createdTimestamp.toISOString() || 'none'}</div>
}
