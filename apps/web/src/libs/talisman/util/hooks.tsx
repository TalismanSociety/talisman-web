import { find, get } from 'lodash'
import { useEffect, useState } from 'react'

import { statusOptions as baseStatusOptions, SupportedRelaychains } from './_config'

export const useStatus = (props: { status?: string; message?: string | null; customOptions?: any } = {}) => {
  const { status = baseStatusOptions.INITIALIZED, message = null, customOptions = {} } = props

  const statusOptions = {
    ...baseStatusOptions,
    ...(typeof customOptions === 'object' ? customOptions : {}),
  }

  // set initial
  const [_status, setStatus] = useState(
    !!status && Object.keys(statusOptions).includes(status) ? statusOptions[status] : statusOptions.INITIALIZED
  )
  const [_message, setMessage] = useState<any>(message)

  const validateStatusAndSet = (newStatus: string, msg?: any) => {
    Object.keys(statusOptions).includes(newStatus) && setStatus(newStatus)
    setMessage(msg)
  }

  useEffect(() => {
    Object.keys(statusOptions).forEach(option => {
      ;(validateStatusAndSet as any)[option.toLowerCase()] = (msg: string) => {
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

export const useAwaitObjectValue = (object: any, key: string, cb = (_value: any) => {}, timeout = 500) => {
  useEffect(() => {
    const _id = setInterval(() => {
      if (get(object, key)) {
        clearInterval(_id)
        cb(get(object, key))
      }
    }, timeout)
    return () => clearInterval(_id)
  }, [get(object, key)]) // eslint-disable-line
}

export const useChainByGenesis = (genesisHash: any) => {
  return find(SupportedRelaychains, { genesisHash }) ?? { id: undefined }
}
