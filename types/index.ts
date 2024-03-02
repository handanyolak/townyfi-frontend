import { type Message } from 'yup'

export * from './typechain'
export * from './composables'
export * from './components'
export * from './toastification'

declare module 'yup' {
  interface StringSchema {
    bytes32(message?: Message<any>): this
    ethereumAddress(message?: Message<any>): this
    coordinate(message?: Message<any>): this
    townyIsRegistered(message?: Message<any>): this
  }
}

declare global {
  interface Window {
    ethereum?: any
  }
}

declare module 'ethers' {
  export type BigNumberish = bigint
  export type AddressLike = string
}
