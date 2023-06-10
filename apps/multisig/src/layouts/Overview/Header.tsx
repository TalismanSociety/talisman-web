import Logo from '@components/Logo'
import { copyToClipboard } from '@domains/common'
import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { Copy, Plus, PlusCircle, TalismanHand } from '@talismn/icons'
import { Button, IconButton, Identicon, Select } from '@talismn/ui'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Multisig {
  name: string
  signers: string[]
  threshold: number
  networks: {
    [key: string]: {
      proxy: string
      multisig: string
    }
  }
}

const mockMultisigs: Multisig[] = [
  {
    name: 'Paraverse Foundation',
    signers: ['5FmE1Adpwp1bT1oY95w59RiSPVu9LmJ8y7u4yK8Zi5vznv5Y', '5DLfh24Fy7xhDf4dj4E4M4D4ewhRJi29v5A9X9uKXCf1QxQ3'],
    threshold: 2,
    networks: {
      polkadot: {
        proxy: '5Cf9PXqb7Wp8QBBoC3NRS1iMnaVGU8WCCnZUcBnv9Pp9d8NZ',
        multisig: '5E2iJwFrcK8WUBn1jvYc9rYFxJGSM8jKkzUvEczQ2BwSnDZ6',
      },
      kusama: {
        proxy: 'Ez8WgjKToXYT6TJw6F76R8B7DhjfSJY9qv7KuBsaFJgQq3h',
        multisig: 'F4aNh6qxPPJXQobU6S5U5JwDz3q3qVQjrrYciZ7Q97CgJkA',
      },
    },
  },
  {
    name: 'Centrifuge Pty Ltd',
    signers: [
      '5Dy7YpGw3Nn8WDEeNWntvRk9XQ2kQmnsbYZQ2n6nEkT6CwT6',
      '5FmPy6kM4fU4Mz7UyT52T6T8b2aL4BAvP4Z9z4f4sUUN4eU6',
      '5GJpzMh8UkMqUWoHjzXZwbRgC8EEMco1JvDjqVQAXwfsR5Kr',
      '5DvFd3q9GZa3g8VjWnRWv5MkdnrBFRk21J1GmDVpEj7ZC9eq',
    ],
    threshold: 3,
    networks: {
      polkadot: {
        proxy: 'EF4SKSX7D8Rv9H7FfnzS5bS7W8zvQ2Q4g4A4YJMXyW8Dv1b',
        multisig: 'H1e7Z8EoPz5hVY5Yf2Q7VtkGv5u5nV6hcQmQfjGZDCxrnJu',
      },
    },
  },
  {
    name: 'Chaos DAO Primary',
    signers: [
      '5Ay7YpGw3Nn8WDEeNWntvRk9XQ2kQmnsbYZQ2n6nEkT6CwT6',
      '5FmPy6kM4fU4Mz7UyT52T6T8b2aL4BAvP4Z9z4f4sUUN4eU6',
      '5GJpzMh8UkMqUWoHjzXZwbRgC8EEMco1JvDjqVQAXwfsR5Kr',
      '5DvFd3q9GZa3g8VjWnRWv5MkdnrBFRk21J1GmDVpEj7ZC9eq',
    ],
    threshold: 3,
    networks: {
      polkadot: {
        proxy: 'CF4SKSX7D8Rv9H7FfnzS5bS7W8zvQ2Q4g4A4YJMXyW8Dv1b',
        multisig: 'D1e7Z8EoPz5hVY5Yf2Q7VtkGv5u5nV6hcQmQfjGZDCxrnJu',
      },
    },
  },
]

const Header = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [selectedMultisig, setSelectedMultisig] = useState(mockMultisigs[0] as Multisig)

  return (
    <header
      className={css`
        grid-area: header;
        display: flex;
        align-items: center;
        height: 56px;
        gap: 16px;
      `}
    >
      <Logo
        className={css`
          width: 106px;
          margin-right: auto;
        `}
      />
      <Button
        onClick={() => {
          navigate('/overview/new-transaction')
        }}
        className={css`
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: nowrap;
          height: 100%;
          width: 207px;
          border-radius: 12px !important;
          span {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
        `}
      >
        <Plus />
        <span>New Transaction</span>
      </Button>
      <div
        className={css`
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        `}
      >
        <div
          className={css`
            button {
              border-radius: 12px;
            }
            figure > svg {
              height: 40px;
              width: 40px;
            }
            span {
              color: var(--color-offWhite) !important;
              font-size: 16px;
            }
            ul {
              box-shadow: 5px 5px 10px 0 rgba(0, 0, 0, 0.15);
            }
          `}
        >
          <Select
            placeholderPointerEvents={true}
            afterOptionsNode={
              <div
                css={{
                  'display': 'flex',
                  'alignItems': 'center',
                  'fontWeight': 'bold',
                  'padding': '15px 12.5px',
                  'gap': '8px',
                  'backgroundColor': theme.color.foreground,
                  ':hover': {
                    filter: 'brightness(1.2)',
                  },
                  'cursor': 'pointer',
                }}
                onClick={() => {
                  navigate('/create?skipNoVault')
                }}
              >
                <IconButton size={'40px'} contentColor={theme.color.primary}>
                  <PlusCircle size="40px" />
                </IconButton>
                New Vault
              </div>
            }
            beforeOptionsNode={
              <div
                css={{
                  fontWeight: 'bold',
                  color: 'var(--color-dim)',
                  height: '38px',
                  margin: '0 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <IconButton size={'16px'} contentColor={`rgb(${theme.dim})`}>
                  <TalismanHand />
                </IconButton>
                Connected Vaults
              </div>
            }
            placeholder={
              <div
                className={css`
                  width: max-content;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 12px;
                  height: 41px;
                `}
              >
                <Identicon
                  className={css`
                    height: 40px;
                    width: 40px;
                  `}
                  value={selectedMultisig.networks.polkadot?.proxy as string}
                />
                <p
                  className={css`
                    color: var(--color-offWhite) !important;
                    pointer-events: none;
                    user-select: none;
                  `}
                >
                  {selectedMultisig.name}
                </p>
                <Copy
                  className={css`
                    height: 18px;
                    transition: 100ms ease-in-out;
                    :hover {
                      color: #d4d4d4;
                    }
                  `}
                  onClick={e => {
                    copyToClipboard(selectedMultisig.networks.polkadot?.proxy as string, 'Address copied to clipboard')
                    e.stopPropagation()
                  }}
                />
              </div>
            }
            value={selectedMultisig.networks.polkadot?.proxy}
            onChange={key => {
              setSelectedMultisig(
                mockMultisigs.find(m => {
                  return m.networks.polkadot?.proxy === key
                }) as Multisig
              )
            }}
          >
            {mockMultisigs.reduce((accumulator, multisig) => {
              if ((selectedMultisig.networks.polkadot?.proxy as string) === multisig.networks.polkadot?.proxy)
                return accumulator

              return accumulator.concat(
                <Select.Item
                  key={multisig.networks.polkadot?.proxy}
                  leadingIcon={<Identicon value={multisig.networks.polkadot?.proxy as string} />}
                  value={multisig.networks.polkadot?.proxy}
                  headlineText={
                    <div
                      css={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                        fontSize: '14px',
                        color: 'var(--color-foreground)',
                      }}
                    >
                      {multisig.name}
                    </div>
                  }
                  supportingText={
                    <div
                      css={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', marginTop: '3px' }}
                    >
                      <Identicon value={(multisig.networks.polkadot?.proxy as string) + 'something'} size={'16px'} />
                      <div css={{ color: 'var(--color-foreground)', marginTop: '3px' }}>My Piping Hot Ledger</div>
                    </div>
                  }
                />
              )
            }, [] as any)}
          </Select>
        </div>
      </div>
    </header>
  )
}

export default Header
