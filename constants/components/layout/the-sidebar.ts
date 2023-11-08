import { Tab } from '~/types'

export const TABS: Record<any, Tab[]> = {
  gameInfo: [
    {
      name: 'User',
      component: 'User',
    },
    {
      name: 'Town',
      component: 'Town',
    },
    {
      name: 'Interactions',
      component: 'Interactions',
    },
  ],
  userOptions: [
    {
      name: 'Options',
      component: 'Options',
    },
  ],
  blockchainInfo: [
    {
      name: 'Chain',
      component: 'Chain',
    },
    {
      name: 'Wallet',
      component: 'Wallet',
    },
  ],
  contractInfo: [
    {
      name: 'Game',
      component: 'Contract',
      data: {
        contractName: 'TownyFi',
        contractDesc: 'The main contract of the game. Used for game logic.',
        contractAddress: '0xC77EBD078Bb8c8C81D4C338364A21a7fb089D0Bf',
      },
    },
    {
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
      name: 'Pass',
      component: 'Contract',
      data: {
        contractName: 'TownyFiPass_0',
        contractDesc: 'The example Game Pass contract of the game.',
        contractAddress: '0x7a3c4dF2b7Ee8aF3f2C4f6c3bA4D3cFb6eF6D3E5',
      },
    },
    {
      name: 'Multicall',
      component: 'Contract',
      data: {
        contractName: 'Multicall',
        contractDesc:
          'The multicall contract of the game. Used for batch calls in the Frontend App.',
        contractAddress: '0x966F413E883b43CBcE9b0a795F1cbA8103AE5C95',
      },
    },
  ],
  gameInfoFallback: [
    {
      name: 'Unregistered',
      component: 'Unregistered',
    },
  ],
}
