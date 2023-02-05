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

const capitalize = (word: string) =>
  word.charAt(0).toUpperCase() + word.substring(1)
