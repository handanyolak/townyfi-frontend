import { ethers } from 'ethers'
import ktaTokenAbi from '~/abi/ktaTokenAbi.json'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  return {
    provide: {
      ktaToken: (provider: ethers.providers.Web3Proivder) =>
        new ethers.Contract(
          config.public.ktaTokenAddress,
          ktaTokenAbi,
          provider
        ),
    },
  }
})
