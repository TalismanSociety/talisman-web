import Modal from '@components/Modal'
import { List, Send, Share2, X, Zap } from '@talismn/icons'
import { IconButton } from '@talismn/ui'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import ActionsMenu from './ActionsMenu'
import AdvancedAction from './AdvancedAction'
import VoteAction from './vote'

export enum Action {
  Send,
  Advanced,
  MultiSend,
  Vote,
}

const actionsMetadata: Record<Action, { name: string; icon: React.ReactNode }> = {
  [Action.Send]: {
    name: 'Send',
    icon: <Send size={20} />,
  },
  [Action.Advanced]: {
    name: 'Advanced',
    icon: <List size={20} />,
  },
  [Action.MultiSend]: {
    name: 'Multi-send',
    icon: <Share2 size={20} />,
  },
  [Action.Vote]: {
    name: 'Vote',
    icon: <Zap size={20} />,
  },
}

const NewTransactionModal = () => {
  const location = useLocation().pathname
  const navigate = useNavigate()
  const [action, setAction] = useState<Action | undefined>(undefined)
  const isOpen = location.startsWith('/overview/new-transaction')
  const close = () => {
    navigate('/overview')
    setAction(undefined)
  }

  const selectedActionMetadata = action !== undefined ? actionsMetadata[action] : undefined
  return (
    <Modal isOpen={isOpen} onRequestClose={close} borderRadius={32} width="100%" contentLabel="New Transaction Modal">
      <div css={{ padding: '8px 8px 48px' }}>
        {selectedActionMetadata !== undefined && (
          <div css={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
            <p css={{ fontSize: '18px', marginTop: '4px' }}>{selectedActionMetadata.name}</p>
            {selectedActionMetadata.icon}
          </div>
        )}
        <IconButton css={{ position: 'absolute', right: '32px', top: '32px' }} onClick={close}>
          <X />
        </IconButton>
        {action === undefined ? (
          <ActionsMenu
            onActionClick={(a: Action) => {
              setAction(a)
            }}
          />
        ) : action === Action.Advanced ? (
          <AdvancedAction onCancel={() => setAction(undefined)} />
        ) : action === Action.Vote ? (
          <VoteAction onCancel={() => setAction(undefined)} />
        ) : null}
      </div>
    </Modal>
  )
}

export default NewTransactionModal
