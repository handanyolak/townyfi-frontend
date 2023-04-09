import { BrowserProvider } from 'ethers'

export const useProvider = () => {
  return new BrowserProvider(window.ethereum)
}
