import { useTheme } from '@emotion/react'
import { Zap } from '@talismn/web-icons'
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
import { Maybe } from '@util/monads'
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
          : Maybe.of(props.error).mapOr(props.fiatAmount, x => <TextInput.ErrorLabel>{x}</TextInput.ErrorLabel>)
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
      width="10rem"
      css={{ fontSize: '3rem' }}
    />
  )
}

export type DappStakingFormProps = {
  accountSelector: ReactNode
  amountInput: ReactNode
  dappSelectionInProgress?: boolean
  selectedDappName?: ReactNode
  selectedDappLogo?: string
  onRequestDappChange: () => unknown
  estimatedRewards: ReactNode
  currentStakedBalance?: ReactNode
  stakeButton: ReactNode
}

const DappStakingForm = Object.assign(
  (props: DappStakingFormProps) => {
    return (
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
        <div css={{ cursor: 'pointer' }} onClick={props.onRequestDappChange}>
          <label css={{ pointerEvents: 'none' }}>
            <Text.BodySmall as="div" css={{ marginBottom: '0.8rem' }}>
              Select DApp
            </Text.BodySmall>
            <Select
              loading={props.dappSelectionInProgress}
              placeholder="Select a DApp"
              renderSelected={() =>
                props.selectedDappName === undefined ? undefined : (
                  <ListItem
                    headlineContent={props.selectedDappName}
                    leadingContent={
                      <img
                        src={props.selectedDappLogo}
                        css={{ borderRadius: '0.8rem', width: '1.6rem', aspectRatio: '1 / 1' }}
                      />
                    }
                    css={{ padding: '0.8rem', paddingLeft: 0 }}
                  />
                )
              }
              css={{ width: '100%' }}
            />
          </label>
        </div>
        <DescriptionList css={{ marginTop: '1.6rem', marginBottom: '1.6rem' }}>
          <DescriptionList.Description>
            <DescriptionList.Term>Estimated earning</DescriptionList.Term>
            <DescriptionList.Details css={{ wordBreak: 'break-all' }}>{props.estimatedRewards}</DescriptionList.Details>
          </DescriptionList.Description>
          {props.currentStakedBalance !== undefined && (
            <DescriptionList.Description>
              <DescriptionList.Term>Staked balance</DescriptionList.Term>
              <DescriptionList.Details>{props.currentStakedBalance}</DescriptionList.Details>
            </DescriptionList.Description>
          )}
        </DescriptionList>
        {props.stakeButton}
      </Surface>
    )
  },
  {
    AmountInput,
    StakeButton: (props: Omit<ButtonProps, 'children'>) => (
      <Button {...props} css={{ marginTop: '1.6rem', width: 'auto' }}>
        Stake
      </Button>
    ),
  }
)

export type DappStakingSideSheetProps = Omit<SideSheetProps, 'title'> & {
  chainName: ReactNode
  rewards: ReactNode
  nextEraEta: ReactNode
  minimumStake: ReactNode
  unbondingPeriod: ReactNode
}

export const DappStakingSideSheet = ({
  children: form,
  minimumStake,
  unbondingPeriod,
  ...props
}: DappStakingSideSheetProps) => {
  return (
    <SideSheet
      {...props}
      title={
        <>
          <Zap /> Stake
        </>
      }
      subtitle="Astar DApp staking"
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
          <InfoCard
            overlineContent="Rewards"
            headlineContent={<Suspense fallback={<CircularProgressIndicator size="1em" />}>{props.rewards}</Suspense>}
          />
          <InfoCard
            overlineContent="Current era ends"
            headlineContent={
              <Suspense fallback={<CircularProgressIndicator size="1em" />}>{props.nextEraEta}</Suspense>
            }
          />
        </section>
        {form}
        <Text.Body as="p" css={{ marginTop: '6.4rem' }}>
          The <Text.Body alpha="high">minimum amount</Text.Body> to stake for users is{' '}
          <Suspense fallback={<CircularProgressIndicator size="1em" />}>
            <Text.Body alpha="high">{minimumStake}</Text.Body>
          </Suspense>
          .
          <br />
          <br />
          You need to claim to receive your rewards.
          <br />
          <br />
          There is a <Text.Body alpha="high">unbonding period</Text.Body> for around{' '}
          <Suspense fallback={<CircularProgressIndicator size="1em" />}>
            <Text.Body alpha="high">{unbondingPeriod}</Text.Body>
          </Suspense>{' '}
          on <Suspense fallback={<CircularProgressIndicator size="1em" />}>{props.chainName}</Suspense>.
          <br />
          <br />
          Please note that this is based on a perfect block production of <Text.Body alpha="high">12s</Text.Body>. In
          case of any delay, your unbonding period can be a little longer.
          <br />
          <br />
          <Text.Noop.A href="https://astar.network/blog/dapp-staking-v3-explained-48693" target="_blank">
            Learn more
          </Text.Noop.A>
        </Text.Body>
      </div>
    </SideSheet>
  )
}

export default DappStakingForm
