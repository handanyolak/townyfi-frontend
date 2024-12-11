import type { Log } from 'viem'
import { TYPE } from 'vue-toastification'
import { toCapitalizedWords } from './helper'
import type { User } from '~/types'

export const formatEventArgs = (eventArgs: any) => {
  let str = ''
  Object.entries(eventArgs).forEach(([key, value]) => {
    str += `${toCapitalizedWords(key)}: ${JSON.stringify(value)}\n`
  })
  str = str.slice(0, -1)

  return str
}

export const areAddressesEqual = (addressA: string, addressB: string) => {
  return addressA.toLowerCase() === addressB.toLowerCase()
}

export const getUniqueLogs = <T extends Log>(logs: T[]) => {
  const logMap = new Map<string, boolean>()
  const uniqueLogs: T[] = []

  logs.forEach((log) => {
    const { transactionHash, logIndex } = log
    const logId = `${transactionHash}-${logIndex}`
    if (!logMap.has(logId)) {
      logMap.set(logId, true)
      uniqueLogs.push(log)
    }
  })

  return uniqueLogs
}

export const processAndPrintLog = ({
  logName,
  logArgs = {},
  useToast,
  toastMessage = '',
}: {
  logName: string
  logArgs?: any
  useToast: boolean
  refreshUserInfo?: boolean
  refreshUserInfoUntilCallback?: (user: User) => boolean
  toastMessage: string
}) => {
  const eventNameMessage = `Event: ${logName}`
  const argsMessage = formatEventArgs(logArgs)
  const eventMessage = `${eventNameMessage}\n${argsMessage}`

  if (useToast) {
    const toastMsg = (toastMessage ? `${toastMessage}\n` : '') + eventMessage
    useAppToast(TYPE.INFO, toastMsg)
  }
}
