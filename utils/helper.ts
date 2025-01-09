import { http } from 'viem'

export const uppercaseFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const toCapitalizedWords = (name: string) => {
  const words = name.match(/[A-Za-z][a-z]*/g) || []

  return words.map(capitalize).join(' ')
}

const capitalize = (word: string) => {
  return word.charAt(0).toUpperCase() + word.substring(1)
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
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

export const prepare = (h: string) => {
  let str = ''
  const len = h.length
  for (let i = 0; i < len; i += 2) {
    str += String.fromCharCode(parseInt(h.substring(i, i + 2), 16))
  }

  return str
}

export const shuffleArray = (arr: any[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }

  return arr
}

export const generateHttpTransports = ({
  appEnv,
  logging,
  logPrefix,
  rpcUrlsPublic,
  rpcUrls,
  count,
}: {
  appEnv: string
  logging?: boolean
  logPrefix?: string
  rpcUrlsPublic: string[]
  rpcUrls: string[]
  count?: number
}) => {
  const httpTransports = shuffleArray(
    rpcUrlsPublic.concat(
      (appEnv === 'production' ? rpcUrls : []).map((url) =>
        url
          .split('/')
          .map((part, i, arr) => (i === arr.length - 1 ? prepare(part) : part))
          .join('/'),
      ),
    ),
  ).map((url) =>
    http(url, {
      ...(logging && {
        onFetchRequest: (request, init) => {
          console.log(
            `${logPrefix ? `${logPrefix} ` : ''}onFetchRequest`,
            request.url,
            init.body && JSON.parse(init?.body as any)?.method,
          )
        },
      }),
    }),
  )

  return count ? httpTransports.slice(0, count) : httpTransports
}
