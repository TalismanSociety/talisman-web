import { 
  useState,
} from 'react'
import styled from 'styled-components'
import Identicon from '@polkadot/react-identicon';
import { useAccount, useGuardian } from '@libs/talisman'
import { Button } from '@components'
import { truncateString } from '@util/helpers'
import { ReactComponent as ChevronDown } from '@icons/chevron-down.svg'

export default styled(
  ({
    className
  }) => {
    const { address, name, balance, switchAccount } = useAccount()
    const { accounts } = useGuardian()
    const [open, setOpen] = useState(false)

    return <span
      className={className}
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
        <div>{balance?.total} KSM</div>
        {/*<div>{truncateString(address, 4, 4)}</div>*/}
      </span>

      <Button.Icon
        className='nav-toggle'
        onMouseEnter={() => setOpen(true)}
        >
        <ChevronDown/>
      </Button.Icon>

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
    padding: 0;
    //background: rgba(0,0,0,0.1);
    //border-radius: 1em;
    //cursor: pointer;
    position: relative;

    >.identicon{
      margin-right:  0.3em;
      >svg{
        width: 4rem;
        height: 4rem;
        //background: rgba(255,0,0,0.4);
      }
    }

    >.nav-toggle{
      margin-left: 1.1rem;
    }

    >.selected-account{
      display: block;
      margin-left: 0.4rem;
      >div{
        line-height: 1.2em;
        &:first-child{
          font-weight: var(--font-weight-bold);
          width: 11rem;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        &:last-child{
          opacity: 0.3;
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