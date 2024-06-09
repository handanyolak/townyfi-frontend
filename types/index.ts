import { type Message } from 'yup'

export * from './composables'
export * from './components'
export * from './toastification'
export * from './contract'

export type ParamType<T> = T extends (...args: infer P) => any ? P : never

export type Mutable<T> = T extends object
  ? { -readonly [K in keyof T]: Mutable<T[K]> }
  : T

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
