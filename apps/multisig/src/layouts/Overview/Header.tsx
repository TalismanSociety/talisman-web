import Logo from '@components/Logo'
import { css } from '@emotion/css'
import { Copy, Plus } from '@talismn/icons'
import { Button, Identicon, Select } from '@talismn/ui'

import { copyToClipboard } from '../../domain/common'

const Header = () => {
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
            button > svg {
              color: var(--color-offWhite);
            }
          `}
        >
          <Select
            placeholderPointerEvents={true}
            placeholder={
              <div
                className={css`
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
                  value={'5Casdf'}
                />
                <p
                  className={css`
                    color: var(--color-offWhite) !important;
                    pointer-events: none;
                    user-select: none;
                  `}
                >
                  Paraverse Foundation
                </p>
                <Copy
                  className={css`
                    height: 18px;
                    transition: 100ms ease-in-out;
                    :hover {
                      color: #bdbdbd;
                    }
                  `}
                  onClick={e => {
                    copyToClipboard('0x123', 'Address copied to clipboard')
                    e.stopPropagation()
                  }}
                />
              </div>
            }
            value={1}
            // onChange={value =>
            //   setSelectedSigner(props.augmentedAccounts.find(a => a.address === value) as AugmentedAccount)
            // }
            // {...props}
          >
            {/* {props.augmentedAccounts.map(account => (
          <Select.Item
            key={account.address}
            leadingIcon={<Identicon value={account.address} />}
            value={account.address}
            headlineText={account.nickname}
            supportingText={'1 DOT'}
          />
        ))} */}
          </Select>
        </div>
      </div>
    </header>
  )
}

export default Header
