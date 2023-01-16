import './typechain-types'
import { BigNumber } from 'ethers'

export interface CoordinateItem {
  x: BigNumber
  y: BigNumber
  addresses: string[]
}

export interface Tab {
  name: string
  component: string
}
