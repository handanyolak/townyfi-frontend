export enum FindOptions {
  ID = 'ID',
  Address = 'Address',
  Coordinate = 'Coordinate',
}

export enum SearchType {
  Town = 'Town',
  User = 'User',
}

export enum LoadingState {
  Idle = 'IDLE',
  Registering = 'REGISTERING',
  Approving = 'APPROVING',
  AddingToken = 'ADDING_TOKEN',
  RelayerWebhookRequest = 'RELAYER_WEBHOOK_REQUEST',
  Minting = 'MINTING',
}

export enum DrawerName {
  GameInfo = 'isGameInfo',
  Options = 'isOptions',
  BlockchainInfo = 'isBlockchainInfo',
  ContractInfo = 'isContractInfo',
}
