import { createPublicClient, fallback } from 'viem'
import * as chains from 'viem/chains'
import * as networks from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createAppKit } from '@reown/appkit/vue'
import { custom as customChain } from '~/chains/custom'
import { prepare, generateHttpTransports } from '~/utils'
import 'viem/window'

export const useUserWalletStore = defineStore('userWalletStore', () => {
  // --------[ Nuxt ]-------- //
  const {
    public: {
      chain: chainName,
      rpcUrlsPublic,
      rpcUrls,
      appEnv,
      reownAppkitProjectId,
      appUrl,
    },
  } = useRuntimeConfig()

  // --------[ States ]-------- //

  const chain: chains.Chain =
    // @ts-expect-error
    chainName !== 'custom' ? chains[chainName] : customChain // eslint-disable-line import/namespace

  const network: networks.AppKitNetwork =
    // @ts-expect-error
    chainName !== 'custom' ? networks[chainName] : null // eslint-disable-line import/namespace

  // TODO: this is temporary workaround for appkit modal balance issue
  // See: https://github.com/reown-com/appkit/blob/3ee19a227540bb496aa1b319d64f0306a82ce5dd/packages/appkit/src/client.ts#L1600
  network.testnet = false

  const commonGenerateHttpTransportsParams: Parameters<
    typeof generateHttpTransports
  >[0] = {
    appEnv,
    rpcUrls,
    rpcUrlsPublic,
  }

  const publicClient = createPublicClient({
    chain,
    batch: {
      multicall: true,
    },
    transport: fallback(
      generateHttpTransports({
        ...commonGenerateHttpTransportsParams,
        logging: true,
        logPrefix: 'viem',
      }),
      {
        rank: {
          interval: 45_000,
          timeout: 500,
          weights: {
            latency: 0.4,
            stability: 0.6,
          },
        },
        retryCount: 2,
        retryDelay: 100,
      },
    ),
  })

  const publicClientToSimulate = createPublicClient({
    chain,
    batch: {
      multicall: true,
    },
    transport: fallback(
      generateHttpTransports({
        ...commonGenerateHttpTransportsParams,
        logging: true,
        count: 3,
        logPrefix: 'viem simulate',
      }),
      {
        rank: {
          interval: 75_000,
        },
        retryCount: 2,
        retryDelay: 100,
      },
    ),
  })

  const wagmiAdapter = new WagmiAdapter({
    ssr: false,
    networks: [network],
    projectId: prepare(reownAppkitProjectId),
    transports: {
      [network.id]: fallback(
        generateHttpTransports({
          ...commonGenerateHttpTransportsParams,
          logPrefix: 'wagmi',
        }),
        {
          rank: {
            interval: 60_000,
            timeout: 1_000,
            weights: {
              latency: 0.2,
              stability: 0.8,
            },
          },
          retryCount: 2,
          retryDelay: 100,
        },
      ),
    },
  })

  const appkit = createAppKit({
    adapters: [wagmiAdapter],
    networks: [network],
    projectId: prepare(reownAppkitProjectId),
    themeMode: 'light',
    metadata: {
      name: 'Bingo!',
      description: 'Bingo!',
      url: appUrl,
      icons: ['https://avatars.githubusercontent.com/u/179229932'],
    },
    features: {
      legalCheckbox: true,
      email: false,
      socials: false,
      analytics: false,
      swaps: true,
      onramp: true,
      history: true,
      allWallets: true,
    },
    enableAuthLogger: false,
  })

  const currentBlockNumber = ref(BigInt(0))

  // --------[ Actions ]-------- //
  const setCurrentBlockNumber = (newBlockNumber: bigint) => {
    currentBlockNumber.value = newBlockNumber
  }

  const startEthEvents = () => {
    // @ts-ignore
    window.ethereum?.on('chainChanged', handleChainChanged)
    // @ts-ignore
    window.ethereum?.on('accountsChanged', handleAccountsChanged)
    // @ts-ignore
    window.ethereum?.on('disconnect', handleDisconnect)
  }

  const handleChainChanged = () => {
    window.location.reload()
  }

  const handleAccountsChanged = () => {
    window.location.reload()
  }

  const handleDisconnect = () => {
    window.location.reload()
  }

  return {
    appkit,
    chain,
    network,
    wagmiAdapter,
    publicClient,
    currentBlockNumber,
    startEthEvents,
    setCurrentBlockNumber,
    publicClientToSimulate,
  }
})
