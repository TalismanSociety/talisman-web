import Logo from '@components/Logo'
import { copyToClipboard } from '@domains/common'
import { Multisig, activeMultisigsState, selectedMultisigState } from '@domains/multisig'
import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { Copy, Plus, PlusCircle, TalismanHand } from '@talismn/icons'
import { Button, IconButton, Identicon, Select } from '@talismn/ui'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'

const Header = () => {
  const theme = useTheme()
  const navigate = useNavigate()

  // Manage switching to active multisig if the selected one becomes inactive
  const [selectedMultisig, setSelectedMultisig] = useRecoilState(selectedMultisigState)
  const activeMultisigs = useRecoilValue(activeMultisigsState)
  useEffect(() => {
    if (
      activeMultisigs[0] &&
      !activeMultisigs.find(multisig => multisig.proxyAddress === selectedMultisig?.proxyAddress)
    ) {
      setSelectedMultisig(activeMultisigs[0])
    }
  })

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
              activeMultisigs.length > 1 && (
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
              )
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
                  value={selectedMultisig.proxyAddress as string}
                />
                <div
                  className={css`
                    color: var(--color-offWhite) !important;
                    pointer-events: none;
                    user-select: none;
                  `}
                >
                  <div css={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <p>{selectedMultisig.name}</p>
                    <img
                      css={{ marginBottom: '2px' }}
                      height={16}
                      src={selectedMultisig.chain.logo}
                      alt={selectedMultisig.chain.chainName}
                    />
                  </div>
                </div>
                <Copy
                  className={css`
                    height: 18px;
                    transition: 100ms ease-in-out;
                    :hover {
                      color: #d4d4d4;
                    }
                  `}
                  onClick={e => {
                    copyToClipboard(selectedMultisig.proxyAddress, 'Address copied to clipboard')
                    e.stopPropagation()
                  }}
                />
              </div>
            }
            value={selectedMultisig.proxyAddress}
            onChange={key => {
              setSelectedMultisig(activeMultisigs.find(m => m.proxyAddress === key) as Multisig)
            }}
          >
            {activeMultisigs.reduce((accumulator, multisig) => {
              if (selectedMultisig.proxyAddress === multisig.proxyAddress) return accumulator

              return accumulator.concat(
                <Select.Item
                  key={multisig.proxyAddress}
                  leadingIcon={<Identicon value={multisig.proxyAddress} />}
                  value={multisig.proxyAddress}
                  headlineText={
                    <div
                      css={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '14px',
                        color: 'var(--color-foreground)',
                      }}
                    >
                      <p>{multisig.name}</p>
                    </div>
                  }
                  supportingText={
                    <div css={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                      {/* This was originally in the spec, maybe want to enable it later. but for now, seems to make most sense to display the network. */}
                      {/* <Identicon value={multisig.proxyAddress} size={'16px'} /> */}
                      {/* <div css={{ color: 'var(--color-foreground)', marginTop: '3px' }}>My Piping Hot Ledger</div> */}
                      <img
                        css={{ marginBottom: '2px' }}
                        height={16}
                        src={multisig.chain.logo}
                        alt={multisig.chain.chainName}
                      />
                      <div css={{ color: 'var(--color-foreground)', marginTop: '3px' }}>{multisig.chain.chainName}</div>
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
