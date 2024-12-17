import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { sepolia } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'

export const projectId = 'f1af70943ebd1ef87a5642ad2b859a82'
export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [sepolia]
export const wagmiAdapter = new WagmiAdapter({
  ssr: false,
  networks,
  projectId,
})
