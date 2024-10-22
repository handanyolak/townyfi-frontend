import { zeroAddress } from 'viem'
import * as chains from 'viem/chains'
import { custom } from '~/chains/custom'
import type { Tab } from '~/types'

const {
  public: {
    chain: runtimeChain,
    ktaAddress,
    ktaGameChatAddress,
    ktaGamePassNftAddress,
    ktaTokenAddress,
  },
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
      id: 'game-contract',
      name: 'Game',
      component: 'Contract',
      folder: 'contract',
      data: {
        contractName: 'TownyFi',
        contractDesc: 'The main contract of the game. Used for game logic.',
        contractAddress: ktaAddress,
      },
    },
    {
      id: 'token-contract',
      name: 'Token',
      component: 'Contract',
      folder: 'contract',
      data: {
        contractName: 'TownyFi Token',
        contractDesc:
          'The token contract of the game. Used for rewards and payments. The token is a standard ERC20 token.',
        contractAddress: ktaTokenAddress,
      },
    },
    {
      id: 'nft-contract',
      name: 'NFT',
      component: 'Contract',
      folder: 'contract',
      data: {
        contractName: 'TownyFiNFT',
        contractDesc:
          'The NFT contract of the game. Used for NFTs and Game Passes. The NFT is a standard ERC721 token.',
        contractAddress: ktaGamePassNftAddress,
      },
    },
    {
      id: 'chat-contract',
      name: 'Chat',
      component: 'Contract',
      folder: 'contract',
      data: {
        contractName: 'TownyFiChat',
        contractDesc:
          'The chat contract of the game. Used for chat messages and official announcements.',
        contractAddress: ktaGameChatAddress,
      },
    },
    {
      id: 'pass-contract',
      name: 'Pass',
      component: 'Contract',
      folder: 'contract',
      data: {
        contractName: 'TownyFiPass_0',
        contractDesc: 'The example Game Pass contract of the game.',
        contractAddress: ktaGamePassNftAddress,
      },
    },
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
