import { Surface, Tabs, Text, type TabProps } from '@talismn/ui'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'
import DexFormSkeleton from './DexForm.skeleton'
import SwapForm from './SwapForm'
import TransportForm from './TransportForm'

type FeeDisplay = { name: string; amount: string }

export type DexFormProps = {
  className?: string
  form: ReactNode
  swapLink: ReactNode
  transportLink: ReactNode
  fees: [FeeDisplay | undefined, FeeDisplay | undefined]
  submitButton: ReactNode
}

const DexForm = Object.assign(
  (props: DexFormProps) => {
    return (
      <LayoutGroup>
        <div css={{ display: 'flex', flexDirection: 'column', gap: '2.6rem' }}>
          <Surface
            className={props.className}
            elevation={x => x + 1}
            as={motion.div}
            layout
            css={{ borderRadius: '1.6rem', padding: 1 }}
          >
            <Surface as={motion.div} layout elevation={x => x - 2} css={{ borderRadius: '1.6rem', padding: '2.4rem' }}>
              <Tabs noBottomBorder css={{ marginBottom: '1.6rem' }}>
                {props.swapLink}
                {props.transportLink}
              </Tabs>
              {props.form}
            </Surface>
            <AnimatePresence>
              {props.fees.filter(x => x !== undefined).length > 0 && (
                <div css={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2.4rem' }}>
                  {props.fees[0] && (
                    <Text.BodySmall>
                      {props.fees[0].name}: {props.fees[0].amount}
                    </Text.BodySmall>
                  )}
                  {props.fees[1] && (
                    <Text.BodySmall>
                      {props.fees[1].name}: {props.fees[1].amount}
                    </Text.BodySmall>
                  )}
                </div>
              )}
            </AnimatePresence>
          </Surface>
          {props.submitButton}
        </div>
      </LayoutGroup>
    )
  },
  {
    Swap: SwapForm,
    SwapTab: <T extends ElementType>(props: TabProps<T>) => <Tabs.Item {...props}>Swap</Tabs.Item>,
    Transport: TransportForm,
    TransportTab: <T extends ElementType>(props: TabProps<T>) => <Tabs.Item {...props}>Transport</Tabs.Item>,
    Skeleton: DexFormSkeleton,
  }
)

export default DexForm
