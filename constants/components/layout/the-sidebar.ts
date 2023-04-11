import { Tab } from '~/types'

export const TABS: Record<any, Tab[]> = {
  gameInfo: [
    {
      name: 'User',
      component: 'User',
    },
    {
      name: 'Town',
      component: 'Town',
    },
    {
      name: 'Interactions',
      component: 'Interactions',
    },
  ],
  userOptions: [
    {
      name: 'Options',
      component: 'Options',
    },
  ],
  blockchainInfo: [
    {
      name: 'Chain',
      component: 'Chain',
    },
    {
      name: 'Wallet',
      component: 'Wallet',
    },
  ],
  contractInfo: [
    {
      name: 'Game',
      component: 'Game',
    },
  ],
  gameinfoFallback: [
    {
      name: 'Unregistered',
      component: 'Unregistered',
    },
  ],
}
