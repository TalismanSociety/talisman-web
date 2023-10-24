import { SubmittableExtrinsic } from '@polkadot/api/types'
import { CallDataPasteForm } from '../../../components/CallDataPasteForm'
import { Button } from '@talismn/ui'

export const DetailsForm = (props: {
  extrinsic: SubmittableExtrinsic<'promise'> | undefined
  setExtrinsic: (s: SubmittableExtrinsic<'promise'> | undefined) => void
  onBack: () => void
  onNext: () => void
}) => {
  return (
    <div
      css={{
        display: 'grid',
        justifyItems: 'center',
        textAlign: 'center',
        maxWidth: 623,
      }}
    >
      <h1 css={{ marginBottom: '32px' }}>Transaction details</h1>
      <div css={{ marginBottom: '24px' }}>
        Create your extrinsic using Polkadot.js or any other app, and simply paste the calldata below to execute your
        transaction.
      </div>
      <CallDataPasteForm extrinsic={props.extrinsic} setExtrinsic={props.setExtrinsic} />
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginTop: 48,
          width: '100%',
          button: { height: 56 },
        }}
      >
        <Button onClick={props.onBack} children={<h3>Back</h3>} variant="outlined" />
        <Button disabled={props.extrinsic === undefined} onClick={props.onNext} children={<h3>Next</h3>} />
      </div>
    </div>
  )
}
