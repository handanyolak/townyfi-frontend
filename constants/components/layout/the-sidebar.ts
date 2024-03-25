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
    },
    {
      id: 'town-info',
      name: 'Town',
      component: 'Town',
    },
    {
      id: 'interactions-info',
      name: 'Interactions',
      component: 'Interactions',
    },
  ],
  userOptions: [
    {
      id: 'options-info',
      name: 'Interface',
      component: 'Interface',
    },
  ],
  blockchainInfo: [
    {
      id: 'chain-info',
      name: 'Chain',
      component: 'Chain',
    },
    {
      id: 'wallet-info',
      name: 'Wallet',
      component: 'Wallet',
    },
  ],
  contractInfo: [
    {
      id: 'game-contract',
      name: 'Game',
      component: 'Contract',
      data: {
        contractName: 'TownyFi',
        contractDesc: 'The main contract of the game. Used for game logic.',
        contractAddress: '0xC77EBD078Bb8c8C81D4C338364A21a7fb089D0Bf',
      },
    },
    {
      id: 'token-contract',
      name: 'Token',
      component: 'Contract',
      data: {
        contractName: 'TownyFi Token',
        contractDesc:
          'The token contract of the game. Used for rewards and payments. The token is a standard ERC20 token.',
        contractAddress: '0xdcd0f1eB0Fdc6CDa180339323c7686321ff3F147',
      },
    },
    {
      id: 'nft-contract',
      name: 'NFT',
      component: 'Contract',
      data: {
        contractName: 'TownyFiNFT',
        contractDesc:
          'The NFT contract of the game. Used for NFTs and Game Passes. The NFT is a standard ERC721 token.',
        contractAddress: '0x9D2e2C7F2cB2B7b9F4c6B9c7cF5F3D9fBdD9f9D9',
      },
    },
    {
      id: 'chat-contract',
      name: 'Chat',
      component: 'Contract',
      data: {
        contractName: 'TownyFiChat',
        contractDesc:
          'The chat contract of the game. Used for chat messages and official announcements.',
        contractAddress: '0x8fF5c9C5d4bB3c0c0D9Bb3E9fC9b8c7D5F6aFF00',
      },
    },
    {
      id: 'pass-contract',
      name: 'Pass',
      component: 'Contract',
      data: {
        contractName: 'TownyFiPass_0',
        contractDesc: 'The example Game Pass contract of the game.',
        contractAddress: '0x7a3c4dF2b7Ee8aF3f2C4f6c3bA4D3cFb6eF6D3E5',
      },
    },
    {
      id: 'multicall-contract',
      name: 'Multicall',
      component: 'Contract',
      data: {
        contractName: 'Multicall3',
        contractDesc:
          'The multicall contract of the game. Used for batch calls in the Frontend App.',
        contractAddress: chain.contracts!.multicall3!.address,
      },
    },
  ],
  gameInfoFallback: [
    {
      id: 'unregistered-fallback',
      name: 'Unregistered',
      component: 'Unregistered',
    },
  ],
}
