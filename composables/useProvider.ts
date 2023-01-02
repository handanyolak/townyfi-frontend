import { providers } from 'ethers'

export const useProvider = () => {
  return new providers.Web3Provider(window.ethereum, 'any')
}
