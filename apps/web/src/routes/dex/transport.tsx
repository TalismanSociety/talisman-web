import SectionHeader from '@components/molecules/SectionHeader'
import DexForm from '@components/recipes/DexForm/DexForm'
import { Details, OrderedDetailsList, Text } from '@talismn/ui'
import React, { Suspense } from 'react'
import { FaqLayout } from './layout'
import illustrationAvif from './transport-illustration.avif'
import illustrationPng from './transport-illustration.png'
import illustrationWebp from './transport-illustration.webp'

const TransportForm = React.lazy(async () => await import('@components/widgets/dex/TransportForm'))

const Transport = () => {
  return (
    <FaqLayout
      content={
        <Suspense fallback={<DexForm.Skeleton />}>
          <TransportForm />
        </Suspense>
      }
      faq={
        <>
          <SectionHeader headlineText="About Cross-Chain Transport" />
          <picture>
            <source srcSet={illustrationAvif} />
            <source srcSet={illustrationWebp} />
            <img
              src={illustrationPng}
              css={{ marginBottom: '1.6rem', borderRadius: '1.6rem', width: '100%', aspectRatio: '1578 / 717' }}
            />
          </picture>
          <OrderedDetailsList>
            <Details>
              <Details.Summary>How does transport work?</Details.Summary>
              <Details.Content>
                Talisman’s transport feature leverages XCMP on Polkadot to send assets between networks. The Talisman
                portal crafts the relevant transaction before requesting a signature before sending the transaction to
                the “from” network, which executes the transfer of tokens to your specified “destination” chain. Learn
                more about Polkadot’s XCMP{' '}
                <Text.Noop.A href="https://polkadot.network/features/cross-chain-communication/" target="_blank">
                  here
                </Text.Noop.A>
                .
              </Details.Content>
            </Details>
            <Details>
              <Details.Summary>How do I perform a teleport?</Details.Summary>
              <Details.Content>
                A “teleport” is an XCM instruction that moves assets between two networks. It is implemented by networks
                that trust one-another, e.g. Statemint & Polkadot. Performing a teleport in the Talisman Portal is like
                performing any other cross-chain transport in the “Transport” feature: by specifying the asset, amount,
                “from” network, and “to” network you are interested in.
              </Details.Content>
            </Details>
            <Details>
              <Details.Summary>What are the risks?</Details.Summary>
              <Details.Content>
                Sending assets between networks is generally a safe procedure on the Talisman portal, since Talisman
                interacts directly with the networks to execute your transaction, and our team have tested all routes we
                offer. However depending on the assets and networks involved, you may find:
                <br />
                <br />
                <ul>
                  <li>
                    Your transferred assets on a chain where your account does not have the necessary token to pay for
                    further txs.
                  </li>
                  <li>
                    When transferring some assets you might be at risk of losing your existential deposit, which may
                    reap your account on the “from” network.
                  </li>
                  <li>
                    An (increasingly rare) bug in an XCM configuration on a network means a transfer is not processed
                    correctly.
                  </li>
                </ul>
                <br />
                Additionally, always make sure that the URL of the Dapp you are using is correct. In this case:
                app.talisman.xyz.
              </Details.Content>
            </Details>
          </OrderedDetailsList>
        </>
      }
    />
  )
}

export default Transport
