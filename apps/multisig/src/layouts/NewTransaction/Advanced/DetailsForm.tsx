import { SubmittableExtrinsic } from '@polkadot/api/types'
import { CallDataPasteForm } from '../../../components/CallDataPasteForm'
import { Button, TextInput } from '@talismn/ui'
import { NewTransactionHeader } from '../NewTransactionHeader'
import { List } from '@talismn/icons'

export const DetailsForm = (props: {
  extrinsic: SubmittableExtrinsic<'promise'> | undefined
  name: string
  setName: (n: string) => void
  setExtrinsic: (s: SubmittableExtrinsic<'promise'> | undefined) => void
  onNext: () => void
}) => {
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        maxWidth: 623,
      }}
    >
      <NewTransactionHeader icon={<List />}>Advanced</NewTransactionHeader>
      <TextInput
        leadingLabel="Transaction Description"
        css={{ fontSize: '16px !important' }}
        placeholder='e.g. "Contract call to update allow list"'
        value={props.name}
        onChange={e => props.setName(e.target.value)}
      />

      <div>
        <p>Calldata</p>
        <p
          css={({ color }) => ({ color: color.lightGrey, opacity: 0.8, fontSize: 12, marginTop: 8, marginBottom: 16 })}
        >
          Create your extrinsic and paste the calldata below to execute your transaction.
        </p>

        <CallDataPasteForm extrinsic={props.extrinsic} setExtrinsic={props.setExtrinsic} />
      </div>
      <div css={{ button: { height: 56, padding: '0 32px' } }}>
        <Button disabled={props.extrinsic === undefined || !props.name} onClick={props.onNext} children="Review" />
      </div>
    </div>
  )
}
