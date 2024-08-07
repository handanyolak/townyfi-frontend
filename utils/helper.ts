import type { Address } from 'viem'
import { abs } from 'extra-bigint.web'

export const uppercaseFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const toCapitalizedWords = (name: string) => {
  const words = name.match(/[A-Za-z][a-z]*/g) || []

  return words.map(capitalize).join(' ')
}

export const middleCropping = (str: string) => {
  return str.substring(0, 5) + '...' + str.substring(str.length - 5)
}

export const addHexPrefix = (str: string) => {
  return (str.startsWith('0x') ? str : '0x' + str) as Address
}

const capitalize = (word: string) => {
  return word.charAt(0).toUpperCase() + word.substring(1)
}

export const middleElement = <T>(array: T[]): T => {
  const middleIndex = Math.floor(array.length / 2)

  return array[middleIndex]
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const enumKeys = (enumValue: any) => {
  return Object.keys(enumValue).filter((key) => isNaN(Number(key)))
}

export const formattedDate = (dateValue: any) => {
  const date = new Date(dateValue)
  return `${date.toLocaleString('default', { month: 'short' })}-${date.getDate()}-${date.getFullYear()}-${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

export const convertToInteger = (
  variable: any,
  defaultValue?: number,
  error?: boolean,
) => {
  let result =
    typeof variable === 'boolean' ||
    (typeof variable !== 'number' && !variable) ||
    isNaN(variable)
      ? undefined
      : parseInt(variable)

  if (!result && defaultValue) {
    result = defaultValue
  }

  if (!result && error) {
    throw new Error('Missing environment in your ".env" file.')
  }

  return result
}

export const replaceAtKeys = (inputObj: { [key: string]: any }): any => {
  const outputObj: { [key: string]: any } = {}
  for (const key in inputObj) {
    const value = inputObj[key]
    if (typeof value === 'object' && '_at' in value) {
      outputObj[key] = value._at
    } else {
      outputObj[key] = value
    }
  }
  return outputObj
}

export function getEnumKeyByEnumValue<
  R extends string | number,
  T extends { [key: string]: R },
>(myEnum: T, enumValue: T[keyof T]) {
  const keys = Object.keys(myEnum).filter((x) => myEnum[x] === enumValue)

  return keys.length > 0 ? keys[0] : null
}

export const getDifference = (
  x1: number | string | bigint,
  y1: number | string | bigint,
  x2: number | string | bigint,
  y2: number | string | bigint,
) => {
  return abs(BigInt(x2) - BigInt(x1)) + abs(BigInt(y2) - BigInt(y1))
}
