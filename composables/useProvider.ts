import { providers } from 'ethers'

export const useProvider = () => {
  if (window.ethereum) {
    return new providers.Web3Provider(window.ethereum, 'any')
  }
}
