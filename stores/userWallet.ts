import { useAppKitAccount } from '@reown/appkit/vue'
import {
  type Address,
  custom,
  publicActions,
  createWalletClient,
  createPublicClient,
  http,
  fallback,
} from 'viem'
import * as chains from 'viem/chains'
import { custom as customChain } from '~/chains/custom'

export const useUserWalletStore = defineStore('userWalletStore', () => {
  // --------[ Nuxt ]-------- //
  const {
    public: { chain: runtimeChain, publicRpcUrls },
  } = useRuntimeConfig()

  // --------[ Stores ]-------- //
  const connectionStore = useConnectionStore()

  // --------[ States ]-------- //
  const ethereum = window.ethereum
  const chain =
    runtimeChain !== 'custom'
      ? (chains[
          runtimeChain as keyof typeof chains // eslint-disable-line import/namespace
        ] as chains.Chain)
      : customChain

  const walletClient = computed(() =>
    createWalletClient({
      chain,
      transport: custom(ethereum),
      account: useAppKitAccount().value.address as Address,
    }).extend(publicActions),
  )

  const publicClient = computed(() =>
    createPublicClient({
      chain,
      transport: fallback(
        publicRpcUrls.map((url) =>
          http(url, {
            onFetchRequest: (req, init) => {
              console.debug(
                'method rpc',
                req.url,
                init.body && JSON.parse(init.body as any).method,
              )
            },
          }),
        ),
        {
          rank: true,
        },
      ),
      batch: {
        multicall: true,
      },
    }),
  )

  const chainClient = connectionStore.hasMetamask ? walletClient : publicClient
  const currentBlockNumber = ref(BigInt(0))

  // --------[ Actions ]-------- //
  const setCurrentBlockNumber = (newBlockNumber: bigint) => {
    currentBlockNumber.value = newBlockNumber
  }

  const connect = async () => {
    await walletClient.value.getAddresses()
    await walletClient.value.requestAddresses()
  }

  const startEthEvents = () => {
    window.ethereum.on('chainChanged', handleChainChanged)
    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('disconnect', handleDisconnect)
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
    chain,
    chainClient,
    publicClient,
    walletClient,
    currentBlockNumber,
    connect,
    startEthEvents,
    setCurrentBlockNumber,
  }
})
