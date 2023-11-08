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

export const numberToHex = (number: number) => {
  return '0x' + number.toString(16)
}

export const stringToHex = (str: string) => {
  return str.startsWith('0x') ? str : '0x' + str
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

export const convertToInteger = (
  variable: any,
  defaultValue?: number,
  error?: boolean
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

// function cleanUrls(urls) {
//   return urls.map((url) =>
//     url.replace(/^https?:\/\//, '').replace(/\.[a-z]{2,}$/, '')
//   )
// }

// // Example usage:
// const urls = [
//   'https://sepolia.etherscan.io',
//   'https://sepolia.beaconcha.in',
//   'http://eth-sepolia.blockscout.com',
// ]

// const cleanedUrls = cleanUrls(urls)
// console.log(cleanedUrls)

export const convertToArray = (variable: any, defaultValue?: any[]) => {
  let result = typeof variable === 'string' ? variable.split(',') : undefined

  if (!result && defaultValue) {
    result = defaultValue
  }

  return result
}

// TODO: convertToString
