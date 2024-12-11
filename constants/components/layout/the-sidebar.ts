import { zeroAddress } from 'viem'
import * as chains from 'viem/chains'
import { custom } from '~/chains/custom'
import type { Tab } from '~/types'

const {
  public: { chain: runtimeChain },
} = useRuntimeConfig()

const chain =
  runtimeChain !== 'custom'
    ? (chains[
        runtimeChain as keyof typeof chains // eslint-disable-line import/namespace
      ] as chains.Chain)
    : custom

export const TABS: Record<string, Tab[]> = {
  gameInfo: [
    {
      id: 'user-info',
      name: 'User',
      component: 'User',
      folder: 'game',
    },
    {
      id: 'town-info',
      name: 'Town',
      component: 'Town',
      folder: 'game',
    },
  ],
  userOptions: [
    {
      id: 'options-info',
      name: 'Interface',
      component: 'Interface',
      folder: 'options',
    },
    {
      id: 'game-info',
      name: 'Game',
      component: 'Game',
      folder: 'options',
    },
  ],
  blockchainInfo: [
    {
      id: 'chain-info',
      name: 'Chain',
      component: 'Chain',
      folder: 'blockchain',
    },
    {
      id: 'wallet-info',
      name: 'Wallet',
      component: 'Wallet',
      folder: 'blockchain',
    },
  ],
  contractInfo: [
    {
      id: 'multicall-contract',
      name: 'Multicall',
      component: 'Contract',
      folder: 'contract',
      data: {
        contractName: 'Multicall3',
        contractDesc:
          'The multicall contract of the game. Used for batch calls in the Frontend App.',
        contractAddress: chain.contracts!.multicall3!.address || zeroAddress,
      },
    },
  ],
  gameInfoFallback: [
    {
      id: 'unregistered-fallback',
      name: 'Unregistered',
      component: 'Unregistered',
      folder: 'common',
    },
  ],
}
