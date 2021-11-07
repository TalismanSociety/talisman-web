import { find, get } from 'lodash'
import { useEffect, useState } from 'react'

import { statusOptions as baseStatusOptions } from './_config'
import { SupportedRelaychains } from './_config'

export const useStatus = (props = {}) => {
  const { status = baseStatusOptions.INITIALIZED, message = null, customOptions = {} } = props

  const statusOptions = {
    ...baseStatusOptions,
    ...(typeof customOptions === 'object' ? customOptions : {}),
  }

  // set initial
  const [_status, setStatus] = useState(
    !!status && Object.keys(statusOptions).includes(status) ? statusOptions[status] : statusOptions.INITIALIZED
  )
  const [_message, setMessage] = useState(message)

  const validateStatusAndSet = (newStatus, msg) => {
    Object.keys(statusOptions).includes(newStatus) && setStatus(newStatus)
    setMessage(msg)
  }

  useEffect(() => {
    Object.keys(statusOptions).forEach(option => {
      validateStatusAndSet[option.toLowerCase()] = msg => {
        setStatus(option)
        setMessage(msg)
      }
    })
  }, [Object.keys(statusOptions)]) // eslint-disable-line

  return {
    status: _status,
    message: _message,
    setStatus: validateStatusAndSet,
    options: statusOptions,
  }
}

export const useAwaitObjectValue = (object, key, cb = () => {}, timeout = 500) => {
  useEffect(() => {
    let _id = setInterval(() => {
      if (!!get(object, key)) {
        clearInterval(_id)
        cb(get(object, key))
      }
    }, timeout)
    return () => clearInterval(_id)
  }, [get(object, key)]) // eslint-disable-line
}

export const useChainByGenesis = genesisHash => {
  return find(SupportedRelaychains, { genesisHash: genesisHash }) || {}
}
