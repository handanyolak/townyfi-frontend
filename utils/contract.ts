import { toCapitalizedWords } from './helper'

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
