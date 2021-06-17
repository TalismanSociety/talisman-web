import { 
  useState,
} from 'react'
import styled from 'styled-components'
import Identicon from '@polkadot/react-identicon';
import { useAccount, useGuardian } from '@libs/talisman'
import { truncateString } from '@util/helpers'

export default styled(
  ({
    className
  }) => {
    const { address, name, switchAccount } = useAccount()
    const { accounts } = useGuardian()
    const [open, setOpen] = useState(false)

    return <span
      className={className}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      >
      <Identicon
        className='identicon'
        value={address}
        theme={'polkadot'}
      />
      <span
        className='selected-account'
        >
        <div>{name}</div>
        <div>{truncateString(address, 4, 4)}</div>
      </span>

      {!!open &&
        <span
          className={'account-picker'}
          >
          {
            accounts.map(account => 
              <div
                className='account'
                onClick={() => switchAccount(account?.address)}
                >
                <Identicon
                  className='identicon'
                  value={account?.address}
                  theme={'polkadot'}
                />
                <div>{truncateString(account?.name, 8, 0)}</div>
                <div>{truncateString(account?.address, 4, 4)}</div>
                <div>x.xx&nbsp;DOT</div>
              </div>
            )
          }
        </span>
      }
    </span>
  })
  `
    font-size: inherit;
    display: flex;
    align-items: center;
    padding: 0.2em 0.8em 0.2em 0.2em;
    background: rgba(0,0,0,0.1);
    border-radius: 1em;
    cursor: pointer;
    position: relative;

    >.identicon{
      margin-right:  0.3em;
      >svg{
        width: 1.6em;
        height: 1.6em;
      }
    }

    >.selected-account{
      display: block;
      >div{
        line-height: 1em;
        &:first-child{
          font-size: 0.8em;
        }

        &:last-child{
          font-size: 0.7em;
          opacity: 0.4;
        }
      }
    }

    .account-picker{
      position: absolute;
      top: calc(100% + 0.5em);
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.1);
      padding: 0.5em;
      font-size: 0.8em;

      >.account{
        display: flex;
        align-items: center;
      }
    }

    
  `