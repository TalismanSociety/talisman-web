import { Button, ButtonProps } from '@talismn/ui'

type Props = {
  block?: boolean
  cancel?: ButtonProps
  next: ButtonProps
}

export const CancleOrNext: React.FC<Props> = ({ block, cancel, next }) => (
  <div
    css={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      width: '100%',
      button: { height: 56, width: block ? '100%' : undefined },
    }}
  >
    {cancel && <Button {...cancel} variant={cancel.variant ?? 'outlined'} children={cancel.children ?? 'Cancel'} />}
    <Button {...next} children={next.children ?? 'Next'} />
  </div>
)
