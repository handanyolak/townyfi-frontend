import { useRuntimeConfig } from 'nuxt/app'
import { useAccount } from '@wagmi/vue'
import type { Address } from 'viem'

export function useGameNavigation() {
  const {
    public: { appBaseUrl },
  } = useRuntimeConfig()
  const accountInfo = useAccount()

  return (address: Address) => {
    if (address === accountInfo.address.value) {
      return (window.location.href = appBaseUrl)
    }
    window.location.href = `?playerAddress=${address}`
  }
}
