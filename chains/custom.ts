import { defineChain } from 'viem'

export const custom = defineChain({
  id: 3_058_598,
  name: 'Paribu Network',
  nativeCurrency: { name: 'Paribu', symbol: 'PRB', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://pnet.calderachain.xyz/http'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Caldera Explorer',
      url: 'https://pnet.calderaexplorer.xyz',
      apiUrl: 'https://pnet.calderaexplorer.xyz/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 751532,
    },
  },
  testnet: true,
})
