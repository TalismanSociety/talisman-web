import { Maybe } from '../../../../util/monads'
import { useTheme } from '@emotion/react'
import {
  Button,
  CircularProgressIndicator,
  DescriptionList,
  InfoCard,
  ListItem,
  SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR,
  Select,
  SideSheet,
  Surface,
  Text,
  TextInput,
  type ButtonProps,
  type SideSheetProps,
} from '@talismn/ui'
import { Zap } from '@talismn/web-icons'
import { Suspense, type ReactNode } from 'react'

type AmountInputProps =
  | {
      disabled?: false
      amount: string
      onChangeAmount: (amount: string) => unknown
      onRequestMaxAmount: () => unknown
      assetSelector: ReactNode
      fiatAmount: ReactNode
      availableToStake: ReactNode
      error?: string
      isLoading: boolean
    }
  | {
      disabled: true
      assetSelector: ReactNode
    }

const AmountInput = (props: AmountInputProps) => {
  const theme = useTheme()
  return (
    <TextInput
      disabled={props.disabled}
      type="number"
      inputMode="decimal"
      placeholder="0.00"
      value={props.disabled ? undefined : props.amount}
      onChangeText={props.disabled ? undefined : props.onChangeAmount}
      leadingLabel="Available to stake"
      trailingLabel={props.disabled ? '...' : props.availableToStake}
      trailingIcon={props.assetSelector}
      leadingSupportingText={
        props.disabled
          ? ''
          : Maybe.of(props.isLoading ? undefined : props.error).mapOr(props.fiatAmount, x => (
              <TextInput.ErrorLabel>{x}</TextInput.ErrorLabel>
            ))
      }
      trailingSupportingText={
        <Button
          disabled={props.disabled}
          variant="surface"
          css={{ fontSize: theme.typography.bodySmall.fontSize, padding: '0.3rem 0.8rem' }}
          onClick={props.disabled ? undefined : props.onRequestMaxAmount}
        >
          Max
        </Button>
      }
      css={{ fontSize: '3rem' }}
    />
  )
}

export type SubtensorStakingFormProps = {
  accountSelector: ReactNode
  amountInput: ReactNode
  selectionInProgress?: boolean
  selectedName?: ReactNode
  onRequestChange: () => unknown
  estimatedRewards: ReactNode
  currentStakedBalance?: ReactNode
  stakeButton: ReactNode
}

export const SubtensorStakingForm = (props: SubtensorStakingFormProps) => (
  <Surface
    css={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.6rem',
      borderRadius: '1.6rem',
      padding: '1.6rem',
      width: 'auto',
    }}
  >
    {props.accountSelector}
    {props.amountInput}
    <div css={{ cursor: 'pointer' }} onClick={props.onRequestChange}>
      <label css={{ pointerEvents: 'none' }}>
        <Text.BodySmall as="div" css={{ marginBottom: '0.8rem' }}>
          Select Delegate
        </Text.BodySmall>
        <Select
          loading={props.selectionInProgress}
          placeholder="Select a delegate"
          renderSelected={() =>
            props.selectedName === undefined ? undefined : (
              <ListItem headlineContent={props.selectedName} css={{ padding: '0.8rem', paddingLeft: 0 }} />
            )
          }
          css={{ width: '100%' }}
        />
      </label>
    </div>
    <DescriptionList css={{ marginTop: '1.6rem', marginBottom: '1.6rem' }}>
      {props.currentStakedBalance !== undefined && (
        <DescriptionList.Description>
          <DescriptionList.Term>Already staked</DescriptionList.Term>
          <DescriptionList.Details>
            <Text css={{ color: '#38D448' }}>{props.currentStakedBalance}</Text>
          </DescriptionList.Details>
        </DescriptionList.Description>
      )}
      <DescriptionList.Description>
        <DescriptionList.Term>Estimated earning</DescriptionList.Term>
        <DescriptionList.Details css={{ wordBreak: 'break-all' }}>{props.estimatedRewards}</DescriptionList.Details>
      </DescriptionList.Description>
    </DescriptionList>
    {props.stakeButton}
  </Surface>
)
SubtensorStakingForm.AmountInput = AmountInput
SubtensorStakingForm.StakeButton = (props: Omit<ButtonProps, 'children'>) => (
  <Button {...props} css={{ marginTop: '1.6rem', width: 'auto' }}>
    Stake
  </Button>
)

export type SubtensorStakingSideSheetProps = Omit<SideSheetProps, 'title'> & {
  chainName: ReactNode
  info: Array<{ title: ReactNode; content: ReactNode }>
  minimumStake: ReactNode
}
export const SubtensorStakingSideSheet = ({
  children,
  info,
  minimumStake,
  ...props
}: SubtensorStakingSideSheetProps) => (
  <SideSheet
    {...props}
    title={
      <>
        <Zap /> Stake
      </>
    }
    subtitle="Bittensor delegated staking"
  >
    <div css={{ [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { minWidth: '42rem' } }}>
      <section
        css={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.6rem',
          marginBottom: '1.6rem',
          '> *': { flex: 1 },
        }}
      >
        {info.map(({ title, content }, index) => (
          <InfoCard
            key={index}
            overlineContent={title}
            headlineContent={<Suspense fallback={<CircularProgressIndicator size="1em" />}>{content}</Suspense>}
          />
        ))}
      </section>
      {children}
      <Text.Body as="p" css={{ marginTop: '6.4rem' }}>
        The <Text.Body alpha="high">minimum amount</Text.Body> required to stake is{' '}
        <Suspense fallback={<CircularProgressIndicator size="1em" />}>
          <Text.Body alpha="high">{minimumStake}</Text.Body>
        </Suspense>
        .
      </Text.Body>
      <Text.Body as="p" css={{ marginTop: '1rem' }}>
        After a successful <Text.Body alpha="high">stake OR unstake</Text.Body> operation, you must wait for{' '}
        <Text.Body alpha="high">360&nbsp;blocks</Text.Body> (approx. 1 hour 12 minutes) before you can submit another
        operation for the same account.
      </Text.Body>
    </div>
  </SideSheet>
)
