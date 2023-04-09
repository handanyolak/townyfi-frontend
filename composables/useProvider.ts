import { BrowserProvider } from 'ethers'

// TODO: solve metamask logic here
export const useProvider = () => {
  return new BrowserProvider(window.ethereum)
}
