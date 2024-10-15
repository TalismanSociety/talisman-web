import type { ReactNode } from 'react'
import { Details, Text } from '@talismn/ui'

export const Faq = () => (
  <section css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
    {faq.map(({ question, answer }, index) => (
      <Details key={index}>
        <Details.Summary>{question}</Details.Summary>
        <Details.Content>{answer}</Details.Content>
      </Details>
    ))}

    <Text.Body alpha="disabled" css={{ textAlign: 'center', marginTop: '2.4rem' }}>
      Still need help? Reach out to us on our{' '}
      <Text
        as="a"
        alpha="high"
        href="https://discord.gg/talisman"
        target="_blank"
        css={theme => ({ color: theme.color.primary, whiteSpace: 'nowrap' })}
      >
        Discord channel
      </Text>
      .
    </Text.Body>
  </section>
)

const faq: Array<{ question: string; answer: ReactNode }> = [
  {
    question: 'How does XCM work?',
    answer: (
      <>
        <div>This feature leverages Cross-Chain Messaging (XCM) on Polkadot to transfer assets between chains.</div>
        <br />
        <div>
          Talisman Portal crafts the XCM transaction, requests a signature via your connected wallet, then submits the
          signed transaction to the <i>from</i> chain. The <i>from</i> chain then executes the transfer of tokens to the{' '}
          <i>to</i> chain.
        </div>
        <br />
        <div>
          <Text.Noop.A
            href="https://polkadot.network/features/cross-chain-communication/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Learn more about XCM
          </Text.Noop.A>
          .
        </div>
      </>
    ),
  },
  {
    question: 'How do I perform a teleport?',
    answer: (
      <>
        <div>
          A teleport is an XCM instruction that transfers assets between two chains that trust one-another, e.g.
          Polkadot and Asset Hub.
        </div>
        <br />
        <div>
          Talisman Portal can perform a teleport just like any other XCM transfer: specify the asset, amount,{' '}
          <i>from</i> and <i>to</i> chains that you are interested in, then click <b>Transport</b>.
        </div>
      </>
    ),
  },
  {
    question: 'What are the risks?',
    answer: (
      <>
        <div>Sending assets between chains is generally a safe procedure on Talisman Portal.</div>
        <br />
        <div>
          Talisman interacts directly with the chains to execute your transaction, and our team have tested all of the
          routes we offer.
        </div>
        <br />
        <div>However there are some risks to be aware of:</div>
        <ul className="list-disc pl-5">
          <li>
            You should never use XCM to transfer assets to an exchange. The assets may be ignored by the exchange, and
            many exchanges are unwilling to help recover assets lost in this way.
          </li>
          <li>
            Your assets can become stranded if you use XCM to transfer them to a chain where you don't have the
            necessary tokens to pay for further transaction fees (e.g. the fee required to transfer the assets back
            again).
          </li>
          <li>
            When transferring assets in the Polkadot network you should understand the{' '}
            <a
              className="text-primary"
              href="https://support.polkadot.network/support/solutions/articles/65000168651-what-is-the-existential-deposit-"
              target="_blank"
              rel="noreferrer noopener"
            >
              Existential Deposit
            </a>{' '}
            to avoid having your deposit reaped on the <i>from</i> chain.
          </li>
          <li>
            There's an (increasingly rare) bug in the XCM configuration on some chains which can mean transfers are not
            processed correctly.
          </li>
        </ul>
        <br />
        <div>
          Always check that the URL of the DApp you are using is correct.
          <br />
          In this case:{' '}
          <a className="text-primary" href="https://app.talisman.xyz">
            https://app.talisman.xyz
          </a>
          .
        </div>
      </>
    ),
  },
]
