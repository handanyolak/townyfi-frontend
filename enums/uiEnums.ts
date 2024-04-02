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
  Minting = 'MINTING',
}
