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

const capitalize = (word: string) => {
  return word.charAt(0).toUpperCase() + word.substring(1)
}

export const middleElement = <T>(array: T[]): T => {
  const middleIndex = Math.floor(array.length / 2)

  return array[middleIndex]
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

// TODO: convertToString
