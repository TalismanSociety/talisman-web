import type { PropsWithChildren, ReactNode } from 'react'
import { Button } from '@talismn/ui/atoms/Button'
import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import { Surface } from '@talismn/ui/atoms/Surface'
import { Text } from '@talismn/ui/atoms/Text'
import { Tooltip } from '@talismn/ui/atoms/Tooltip'
import { TextInput } from '@talismn/ui/molecules/TextInput'

import { cn } from '@/lib/utils'

import { ReverseRouteButton } from './ReverseRouteButton'

export type FormProps = {
  empty?: boolean
  accountSelect: ReactNode
  amount?: string
  onChangeAmount: (value: string) => unknown
  onRequestMaxAmount: () => unknown
  fiat?: ReactNode
  max?: ReactNode
  amountError?: string
  tokenSelect?: ReactNode
  destTokenSelect?: ReactNode
  reversible?: boolean
  onRequestReverse: () => unknown
  destAccountSelect?: ReactNode
  info?: ReactNode
  onRequestTransport: () => unknown
  canTransport?: boolean
  transportInProgress?: boolean
  loading?: boolean
}

export const Form = ({
  empty,
  accountSelect,
  amount,
  onChangeAmount,
  onRequestMaxAmount,
  fiat,
  max,
  amountError,
  tokenSelect,
  destTokenSelect,
  reversible,
  onRequestReverse,
  destAccountSelect,
  info,
  onRequestTransport,
  canTransport,
  transportInProgress,
  loading,
}: FormProps) => {
  return (
    <Container info={info}>
      <Section header="Select account">
        <label>
          <Text.BodySmall as="div" css={{ marginBottom: '0.8rem' }}>
            Origin account
          </Text.BodySmall>
          {accountSelect}
        </label>
      </Section>
      <Section
        header={
          <div className="flex items-start justify-between">
            <div>Select asset</div>
            <a
              className="text-foreground/70 hover:text-foreground text-sm"
              href="https://forms.gle/7Xv86Xkf4zmV5V9u7"
              target="_blank"
              rel="noreferrer noopener"
            >
              Can't find your asset?
            </a>
          </div>
        }
      >
        <div className="flex flex-col items-center gap-[0.8rem] lg:flex-row">
          <label className="w-full">
            <Text.BodySmall as="div" css={{ marginBottom: '0.8rem' }}>
              From
            </Text.BodySmall>
            {tokenSelect}
          </label>
          <div className="self-center">
            <div className="hidden lg:block">
              <Text.BodySmall as="div" css={{ marginBottom: '0.8rem' }}>
                &nbsp;
              </Text.BodySmall>
            </div>
            <ReverseRouteButton disabled={reversible === false} onClick={onRequestReverse} />
          </div>
          <label className="w-full">
            <Text.BodySmall as="div" css={{ marginBottom: '0.8rem' }}>
              To
            </Text.BodySmall>
            {destTokenSelect}
          </label>
        </div>
      </Section>
      <Section header="Enter amount">
        <TextInput
          autoComplete="off"
          containerClassName={cn(
            '[&>div:nth-of-type(2)]:!px-[1.25rem] [&>div:nth-of-type(2)]:!py-[1.2rem]',
            '[&>div:nth-of-type(2)]:border [&>div:nth-of-type(2)]:border-red-400/0',
            amountError && '[&>div:nth-of-type(2)]:border-red-400'
          )}
          className="text-ellipsis !text-[18px] !font-semibold"
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          leadingLabel={`You're sending`}
          trailingLabel={
            !empty && (
              <div className="flex flex-row items-center gap-1">
                Max transferable: {max ?? <CircularProgressIndicator size="1em" />}
              </div>
            )
          }
          textBelowInput={
            <div className="flex items-center">
              <p className="text-[10px] leading-none text-gray-400">{fiat}</p>
              {amountError && (
                <div className="flex items-center gap-1 overflow-hidden text-orange-400">
                  <Tooltip placement="bottom" content={<p className="text-[12px]">{amountError}</p>}>
                    <p className="ml-[8px] truncate border-l border-l-gray-600 pl-[8px] text-[10px] leading-none">
                      {amountError}
                    </p>
                  </Tooltip>
                </div>
              )}
            </div>
          }
          value={amount ?? ''}
          onChangeText={onChangeAmount}
          trailingIcon={
            <button
              className={cn(
                'text-foreground/60 rounded-[0.6rem] border border-current px-4 py-1',
                'hover:text-foreground/80 active:text-foreground/70',
                'disabled:text-foreground/40 disabled:cursor-not-allowed'
              )}
              onClick={onRequestMaxAmount}
              disabled={!max}
            >
              Max
            </button>
          }
        />
      </Section>
      <Section header="Select destination">
        <label>
          <Text.BodySmall as="div" css={{ marginBottom: '0.8rem' }}>
            Destination account
          </Text.BodySmall>
          {destAccountSelect}
        </label>
      </Section>
      <Button
        css={{ width: '100%', borderRadius: '8px' }}
        disabled={!canTransport}
        loading={transportInProgress || loading}
        onClick={onRequestTransport}
      >
        Transfer
      </Button>
    </Container>
  )
}

type ContainerProps = PropsWithChildren<{ info: ReactNode }>

function Container({ info, children }: ContainerProps) {
  return (
    <div className="flex w-[min(46rem,100%)] flex-col gap-6 lg:w-[revert] lg:flex-row lg:gap-0">
      <section className="flex flex-col gap-3 lg:w-[46rem]">{children}</section>
      {info}
    </div>
  )
}

function Section({ header, children }: PropsWithChildren<{ header: ReactNode }>) {
  return (
    <Surface css={{ borderRadius: 8, padding: 16 }}>
      <header css={{ marginBottom: 8 }}>
        <Text.H4>{header}</Text.H4>
      </header>
      {children}
    </Surface>
  )
}
