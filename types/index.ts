import * as yup from 'yup'

export * from './typechain'
export * from './components/CastleBox'
export * from './components/SidebarTab'
export * from './TownyToast'

declare module 'yup' {
  interface StringSchema {
    bytes32(message?: yup.Message<any>): this
  }
}
