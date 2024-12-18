import { createPublicClient, http, fallback } from 'viem'
import * as chains from 'viem/chains'
import { custom as customChain } from '~/chains/custom'

export const useUserWalletStore = defineStore('userWalletStore', () => {
  // --------[ Nuxt ]-------- //
  const {
    public: { chain: runtimeChain, publicRpcUrls },
  } = useRuntimeConfig()

  // --------[ States ]-------- //
  const chain =
    runtimeChain !== 'custom'
      ? (chains[
          runtimeChain as keyof typeof chains // eslint-disable-line import/namespace
        ] as chains.Chain)
      : customChain

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

  const currentBlockNumber = ref(BigInt(0))

  // --------[ Actions ]-------- //
  const setCurrentBlockNumber = (newBlockNumber: bigint) => {
    currentBlockNumber.value = newBlockNumber
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
    publicClient,
    currentBlockNumber,
    startEthEvents,
    setCurrentBlockNumber,
  }
})
