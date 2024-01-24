import { useTheme } from '@emotion/react'
import { Zap } from '@talismn/icons'
import {
  Button,
  DescriptionList,
  ListItem,
  Select,
  SideSheet,
  Surface,
  Text,
  TextInput,
  type SideSheetProps,
  type ButtonProps,
  SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR,
} from '@talismn/ui'
import type { ReactNode } from 'react'

export type DappStakingFormProps = {
  accountSelector: ReactNode
  assetSelector: ReactNode
  selectedDappName?: ReactNode
  selectedDappLogo?: string
  onRequestDappChange: () => unknown
  stakeButton: ReactNode
}

const DappStakingForm = Object.assign(
  (props: DappStakingFormProps) => {
    const theme = useTheme()
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
        <TextInput
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          leadingLabel="Available to stake"
          trailingIcon={props.assetSelector}
          trailingSupportingText={
            <Button variant="surface" css={{ fontSize: theme.typography.bodySmall.fontSize, padding: '0.3rem 0.8rem' }}>
              Max
            </Button>
          }
          width="10rem"
          css={{ fontSize: '3rem' }}
        />
        <div css={{ cursor: 'pointer' }} onClick={props.onRequestDappChange}>
          <label css={{ pointerEvents: 'none' }}>
            <Text.BodySmall as="div" css={{ marginBottom: '0.8rem' }}>
              Select DApp
            </Text.BodySmall>
            <Select
              placeholder="Select a DApp"
              css={{ width: '100%' }}
              renderSelected={() =>
                props.selectedDappName === undefined ? undefined : (
                  <ListItem
                    headlineText={props.selectedDappName}
                    leadingContent={<img src={props.selectedDappLogo} css={{ width: '1.6rem' }} />}
                    css={{ padding: '0.8rem', paddingLeft: 0 }}
                  />
                )
              }
            />
          </label>
        </div>
        <DescriptionList>
          <DescriptionList.Description>
            <DescriptionList.Term>Estimated earning</DescriptionList.Term>
            <DescriptionList.Details>0.021 ASTR / Year ($23.04)</DescriptionList.Details>
          </DescriptionList.Description>
          <DescriptionList.Description>
            <DescriptionList.Term>Staked balance</DescriptionList.Term>
            <DescriptionList.Details>0 ASTAR</DescriptionList.Details>
          </DescriptionList.Description>
        </DescriptionList>
        <Button css={{ marginTop: '1.6rem', width: 'auto' }}>Stake</Button>
      </Surface>
    )
  },
  {
    StakeButton: (props: Omit<ButtonProps, 'children'>) => (
      <Button {...props} css={{ marginTop: '1.6rem', width: 'auto' }}>
        Stake
      </Button>
    ),
  }
)

export type DappStakingFormSideSheetProps = Omit<SideSheetProps, 'title'> & { children: ReactNode }

export const DappStakingFormSideSheet = ({ children: form, ...props }: DappStakingFormSideSheetProps) => {
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
      <div css={{ [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { minWidth: '42rem' } }}>{form}</div>
      <Text.Body as="p" css={{ marginTop: '6.4rem' }}>
        The minimum amount to stake for users is 500 ASTR.
        <br />
        <br />
        You need to claim to receive your rewards, we recommend claiming for your staking rewards once a week.
        <br />
        <br />
        There is a unbonding period for around 10 days on Astar.
        <br />
        <br />
        Please note that this is based on a perfect block production of 12s. In case of any delay, your unbonding period
        can be a little longer.
      </Text.Body>
    </SideSheet>
  )
}

export default DappStakingForm
