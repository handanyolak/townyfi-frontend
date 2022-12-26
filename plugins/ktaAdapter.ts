import { ethers } from 'ethers'
import ktaAbi from '~/abi/ktaAbi.json'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  return {
    provide: {
      kta: (provider: ethers.providers.Web3Provider) =>
        new ethers.Contract(config.public.ktaAddress, ktaAbi, provider),
    },
  }
})
