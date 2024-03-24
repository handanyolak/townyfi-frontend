export const ktaAbi = [
  {
    inputs: [
      {
        internalType: 'contract KtaToken',
        name: 'ktaToken_',
        type: 'address',
      },
      {
        internalType: 'contract KtaGamePassNft',
        name: 'ktaGamePassNft_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'rngListenerAddr_',
        type: 'address',
      },
      {
        components: [
          {
            components: [
              {
                internalType: 'uint256',
                name: 'health',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'mana',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'energy',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'armor',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'teleportDistance',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'killArmorRewardLimit',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'safeTownDistance',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'safeTownDifference',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'safeZoneDistance',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'safeZoneDifference',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'attackDistance',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'levelDifference',
                type: 'uint256',
              },
            ],
            internalType: 'struct IKillThemAll.MaxSetting',
            name: 'max',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'health',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'mana',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'energy',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'armor',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'revive',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'register',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'teleport',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'createTown',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'settleTown',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'teleportToTown',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'prepareAttack',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'prepareDefend',
                type: 'uint256',
              },
            ],
            internalType: 'struct IKillThemAll.PriceSetting',
            name: 'price',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'getHealth',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'getMana',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'getEnergy',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'registerReferralReward',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'armorAbsorption',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'attack',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'movement',
                type: 'uint256',
              },
            ],
            internalType: 'struct IKillThemAll.RateSetting',
            name: 'rate',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'revive',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'teleport',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'teleportToTown',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'attackableAt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'warExpiredAt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'protectionAt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'prepareToAttack',
                type: 'uint256',
              },
            ],
            internalType: 'struct IKillThemAll.TimeSetting',
            name: 'time',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'levelToCreateTown',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'townAreaRadius',
                type: 'uint256',
              },
            ],
            internalType: 'struct IKillThemAll.MinSetting',
            name: 'min',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'kill',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'referrerKill',
                type: 'uint256',
              },
            ],
            internalType: 'struct IKillThemAll.ExpSetting',
            name: 'exp',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'attack',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'resistance',
                type: 'uint256',
              },
            ],
            internalType: 'struct IKillThemAll.MultiplierSetting',
            name: 'multiplier',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'numberDigits',
            type: 'uint256',
          },
        ],
        internalType: 'struct IKillThemAll.Setting',
        name: 'settings_',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'min',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'max',
            type: 'uint256',
          },
        ],
        internalType: 'struct IKillThemAll.UserLevel[]',
        name: 'userLevels_',
        type: 'tuple[]',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'maxUser',
            type: 'uint256',
          },
        ],
        internalType: 'struct IKillThemAll.TownLevel[]',
        name: 'townLevels_',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
    ],
    name: 'AddressEmptyCode',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'AddressInsufficientBalance',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AlreadyAtWarPeriod',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AlreadyHasActiveGamePass',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FailedInnerCall',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InsufficientLevel',
    type: 'error',
  },
  {
    inputs: [],
    name: 'LimitExceeded',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lessThan',
        type: 'uint256',
      },
    ],
    name: 'MustLessThan',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lessThanOrEqual',
        type: 'uint256',
      },
    ],
    name: 'MustLessThanOrEqual',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MustPositiveValue',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotAuthorized',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'SafeERC20FailedOperation',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SafeZone',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TargetTooFar',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TargetTownHasProtectionTime',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'townId',
        type: 'uint256',
      },
    ],
    name: 'TownMustNotSettled',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'townId',
        type: 'uint256',
      },
    ],
    name: 'TownMustSettled',
    type: 'error',
  },
  {
    inputs: [],
    name: 'UserAlreadyRegistered',
    type: 'error',
  },
  {
    inputs: [],
    name: 'UserCannotDoThisToYourself',
    type: 'error',
  },
  {
    inputs: [],
    name: 'UserCannotDoThisYet',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'UserMustAlive',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'UserMustCitizen',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'UserMustLeader',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'UserMustNotCitizen',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'UserMustNotLeader',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'UserMustRegistered',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'LevelUp',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'TownCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'townId',
        type: 'uint256',
      },
    ],
    name: 'TownDisbanded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'TownRecruitmentUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'TownSettled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'TownVoyaged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'UserArmorBroken',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'defender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'healthDamage',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'armorDamage',
        type: 'uint256',
      },
    ],
    name: 'UserAttacked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'enum IKillThemAll.Buy',
        name: 'something',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
    ],
    name: 'UserBought',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'gamePassId',
        type: 'uint256',
      },
    ],
    name: 'UserBoughtGamePass',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'gamePassId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'gamePassPhase',
        type: 'uint256',
      },
    ],
    name: 'UserClaimedGamePassPhase',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'UserExitFromTown',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'enum IKillThemAll.Get',
        name: 'something',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'UserGot',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'UserJoinedTown',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'UserKilled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'defender',
        type: 'address',
      },
    ],
    name: 'UserMissed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'int64',
            name: '_x',
            type: 'int64',
          },
          {
            internalType: 'int64',
            name: '_y',
            type: 'int64',
          },
        ],
        indexed: false,
        internalType: 'struct Coordinates.Coordinate',
        name: 'oldCoordinate',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'int64',
            name: '_x',
            type: 'int64',
          },
          {
            internalType: 'int64',
            name: '_y',
            type: 'int64',
          },
        ],
        indexed: false,
        internalType: 'struct Coordinates.Coordinate',
        name: 'newCoordinate',
        type: 'tuple',
      },
    ],
    name: 'UserMoved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'enum IKillThemAll.Prepare',
        name: 'to',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'addressesHash',
        type: 'bytes32',
      },
    ],
    name: 'UserPrepared',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'UserRegistered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'attackerTownId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'defenderTownId',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: '_at',
                type: 'uint256',
              },
            ],
            internalType: 'struct Timers.BlockNumber',
            name: 'attackableAt',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: '_at',
                type: 'uint256',
              },
            ],
            internalType: 'struct Timers.BlockNumber',
            name: 'expiredAt',
            type: 'tuple',
          },
        ],
        indexed: false,
        internalType: 'struct IKillThemAll.War',
        name: 'war',
        type: 'tuple',
      },
    ],
    name: 'WarDeclared',
    type: 'event',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IKtaGamePass',
            name: 'pass',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'startBlock',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endBlock',
            type: 'uint256',
          },
          {
            internalType: 'uint256[]',
            name: 'phaseLimits',
            type: 'uint256[]',
          },
        ],
        internalType: 'struct IKillThemAll.GamePass',
        name: 'gamePass',
        type: 'tuple',
      },
    ],
    name: 'addGamePass',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
    ],
    name: 'attack',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum IKillThemAll.Buy',
        name: 'buy_',
        type: 'uint8',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'buy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'buyGamePass',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'name',
        type: 'bytes32',
      },
    ],
    name: 'changeName',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'changeTownRecruitment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'phase',
        type: 'uint256',
      },
    ],
    name: 'claimGamePassReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'name',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
    ],
    name: 'createTown',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'maxUser',
            type: 'uint256',
          },
        ],
        internalType: 'struct IKillThemAll.TownLevel',
        name: 'townLevel',
        type: 'tuple',
      },
    ],
    name: 'createTownLevel',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'min',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'max',
            type: 'uint256',
          },
        ],
        internalType: 'struct IKillThemAll.UserLevel',
        name: 'userLevel',
        type: 'tuple',
      },
    ],
    name: 'createUserLevel',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'townId',
        type: 'uint256',
      },
    ],
    name: 'declareWar',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'citizen',
        type: 'address',
      },
    ],
    name: 'exileCitizen',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'gamePasses',
    outputs: [
      {
        internalType: 'contract IKtaGamePass',
        name: 'pass',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'startBlock',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'endBlock',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum IKillThemAll.Get',
        name: 'get_',
        type: 'uint8',
      },
    ],
    name: 'get',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'int64',
            name: '_x',
            type: 'int64',
          },
          {
            internalType: 'int64',
            name: '_y',
            type: 'int64',
          },
        ],
        internalType: 'struct Coordinates.Coordinate',
        name: 'coordinate',
        type: 'tuple',
      },
    ],
    name: 'getAddressesByCoordinate',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'townId',
        type: 'uint256',
      },
    ],
    name: 'getCitizensByTownId',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'isRegistered',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'isUserClaimedGamePassPhase',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'townId',
        type: 'uint256',
      },
    ],
    name: 'joinTown',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'leaveTown',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum Coordinates.Direction',
        name: 'direction',
        type: 'uint8',
      },
    ],
    name: 'move',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum IKillThemAll.Prepare',
        name: 'to',
        type: 'uint8',
      },
      {
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
    ],
    name: 'prepareToConditionBonus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'name',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'referrer',
        type: 'address',
      },
    ],
    name: 'register',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'revive',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum IKillThemAll.Prepare',
        name: 'to',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'addressesHash',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'random',
        type: 'uint256',
      },
    ],
    name: 'setConditionBonus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'settings',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'health',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'mana',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'energy',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'armor',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'teleportDistance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'killArmorRewardLimit',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'safeTownDistance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'safeTownDifference',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'safeZoneDistance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'safeZoneDifference',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'attackDistance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'levelDifference',
            type: 'uint256',
          },
        ],
        internalType: 'struct IKillThemAll.MaxSetting',
        name: 'max',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'health',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'mana',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'energy',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'armor',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'revive',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'register',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'teleport',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'createTown',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'settleTown',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'teleportToTown',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'prepareAttack',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'prepareDefend',
            type: 'uint256',
          },
        ],
        internalType: 'struct IKillThemAll.PriceSetting',
        name: 'price',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'getHealth',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'getMana',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'getEnergy',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'registerReferralReward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'armorAbsorption',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'attack',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'movement',
            type: 'uint256',
          },
        ],
        internalType: 'struct IKillThemAll.RateSetting',
        name: 'rate',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'revive',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'teleport',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'teleportToTown',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'attackableAt',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'warExpiredAt',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protectionAt',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'prepareToAttack',
            type: 'uint256',
          },
        ],
        internalType: 'struct IKillThemAll.TimeSetting',
        name: 'time',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'levelToCreateTown',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'townAreaRadius',
            type: 'uint256',
          },
        ],
        internalType: 'struct IKillThemAll.MinSetting',
        name: 'min',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'kill',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'referrerKill',
            type: 'uint256',
          },
        ],
        internalType: 'struct IKillThemAll.ExpSetting',
        name: 'exp',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'attack',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'resistance',
            type: 'uint256',
          },
        ],
        internalType: 'struct IKillThemAll.MultiplierSetting',
        name: 'multiplier',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: 'numberDigits',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'settleTown',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'int64',
            name: '_x',
            type: 'int64',
          },
          {
            internalType: 'int64',
            name: '_y',
            type: 'int64',
          },
        ],
        internalType: 'struct Coordinates.Coordinate',
        name: 'coordinate',
        type: 'tuple',
      },
    ],
    name: 'teleport',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'teleportToTown',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'townById',
    outputs: [
      {
        components: [
          {
            internalType: 'int64',
            name: '_x',
            type: 'int64',
          },
          {
            internalType: 'int64',
            name: '_y',
            type: 'int64',
          },
        ],
        internalType: 'struct Coordinates.Coordinate',
        name: 'coordinate',
        type: 'tuple',
      },
      {
        internalType: 'bytes32',
        name: 'name',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'leader',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'exp',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'levelId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'recruitment',
        type: 'bool',
      },
      {
        internalType: 'enum IKillThemAll.TownStatus',
        name: 'status',
        type: 'uint8',
      },
      {
        internalType: 'enum IKillThemAll.TownMode',
        name: 'mode',
        type: 'uint8',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: '_at',
            type: 'uint256',
          },
        ],
        internalType: 'struct Timers.BlockNumber',
        name: 'protectionAt',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'int256',
        name: '',
        type: 'int256',
      },
      {
        internalType: 'int256',
        name: '',
        type: 'int256',
      },
    ],
    name: 'townIdByCoordinate',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'townWar',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'int64',
                name: '_x',
                type: 'int64',
              },
              {
                internalType: 'int64',
                name: '_y',
                type: 'int64',
              },
            ],
            internalType: 'struct Coordinates.Coordinate',
            name: 'coordinate',
            type: 'tuple',
          },
          {
            internalType: 'bytes32',
            name: 'name',
            type: 'bytes32',
          },
          {
            internalType: 'address',
            name: 'leader',
            type: 'address',
          },
          {
            internalType: 'address[]',
            name: 'citizens',
            type: 'address[]',
          },
          {
            internalType: 'uint256',
            name: 'exp',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'levelId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'recruitment',
            type: 'bool',
          },
          {
            internalType: 'enum IKillThemAll.TownStatus',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'enum IKillThemAll.TownMode',
            name: 'mode',
            type: 'uint8',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: '_at',
                type: 'uint256',
              },
            ],
            internalType: 'struct Timers.BlockNumber',
            name: 'protectionAt',
            type: 'tuple',
          },
        ],
        internalType: 'struct IKillThemAll.Town',
        name: 'town',
        type: 'tuple',
      },
    ],
    name: 'typechainGenerateTown',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'health',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'mana',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'energy',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'armor',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'int64',
                name: '_x',
                type: 'int64',
              },
              {
                internalType: 'int64',
                name: '_y',
                type: 'int64',
              },
            ],
            internalType: 'struct Coordinates.Coordinate',
            name: 'coordinate',
            type: 'tuple',
          },
          {
            internalType: 'bytes32',
            name: 'name',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'exp',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'levelId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'referrer',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'townId',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'joinBlock',
                type: 'uint256',
              },
            ],
            internalType: 'struct IKillThemAll.UserTownInfo',
            name: 'townInfo',
            type: 'tuple',
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: '_at',
                    type: 'uint256',
                  },
                ],
                internalType: 'struct Timers.BlockNumber',
                name: 'getHealth',
                type: 'tuple',
              },
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: '_at',
                    type: 'uint256',
                  },
                ],
                internalType: 'struct Timers.BlockNumber',
                name: 'getMana',
                type: 'tuple',
              },
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: '_at',
                    type: 'uint256',
                  },
                ],
                internalType: 'struct Timers.BlockNumber',
                name: 'getEnergy',
                type: 'tuple',
              },
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: '_at',
                    type: 'uint256',
                  },
                ],
                internalType: 'struct Timers.BlockNumber',
                name: 'revive',
                type: 'tuple',
              },
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: '_at',
                    type: 'uint256',
                  },
                ],
                internalType: 'struct Timers.BlockNumber',
                name: 'teleport',
                type: 'tuple',
              },
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: '_at',
                    type: 'uint256',
                  },
                ],
                internalType: 'struct Timers.BlockNumber',
                name: 'teleportToTown',
                type: 'tuple',
              },
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: '_at',
                    type: 'uint256',
                  },
                ],
                internalType: 'struct Timers.BlockNumber',
                name: 'prepareToAttack',
                type: 'tuple',
              },
            ],
            internalType: 'struct IKillThemAll.UserTimer',
            name: 'timer',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'attack',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'defend',
                type: 'uint256',
              },
            ],
            internalType: 'struct IKillThemAll.UserCharPoint',
            name: 'charPoint',
            type: 'tuple',
          },
        ],
        internalType: 'struct IKillThemAll.User',
        name: 'user',
        type: 'tuple',
      },
    ],
    name: 'typechainGenerateUser',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'uint256',
                name: 'health',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'mana',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'energy',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'armor',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'teleportDistance',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'killArmorRewardLimit',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'safeTownDistance',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'safeTownDifference',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'safeZoneDistance',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'safeZoneDifference',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'attackDistance',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'levelDifference',
                type: 'uint256',
              },
            ],
            internalType: 'struct IKillThemAll.MaxSetting',
            name: 'max',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'health',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'mana',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'energy',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'armor',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'revive',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'register',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'teleport',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'createTown',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'settleTown',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'teleportToTown',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'prepareAttack',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'prepareDefend',
                type: 'uint256',
              },
            ],
            internalType: 'struct IKillThemAll.PriceSetting',
            name: 'price',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'getHealth',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'getMana',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'getEnergy',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'registerReferralReward',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'armorAbsorption',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'attack',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'movement',
                type: 'uint256',
              },
            ],
            internalType: 'struct IKillThemAll.RateSetting',
            name: 'rate',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'revive',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'teleport',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'teleportToTown',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'attackableAt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'warExpiredAt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'protectionAt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'prepareToAttack',
                type: 'uint256',
              },
            ],
            internalType: 'struct IKillThemAll.TimeSetting',
            name: 'time',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'levelToCreateTown',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'townAreaRadius',
                type: 'uint256',
              },
            ],
            internalType: 'struct IKillThemAll.MinSetting',
            name: 'min',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'kill',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'referrerKill',
                type: 'uint256',
              },
            ],
            internalType: 'struct IKillThemAll.ExpSetting',
            name: 'exp',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'attack',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'resistance',
                type: 'uint256',
              },
            ],
            internalType: 'struct IKillThemAll.MultiplierSetting',
            name: 'multiplier',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'numberDigits',
            type: 'uint256',
          },
        ],
        internalType: 'struct IKillThemAll.Setting',
        name: 'settings_',
        type: 'tuple',
      },
    ],
    name: 'updateSettings',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum IKillThemAll.CharacterInfo',
        name: 'charInfo',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'upgradeCharacter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'userByAddr',
    outputs: [
      {
        internalType: 'uint256',
        name: 'health',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'mana',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'energy',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'armor',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'int64',
            name: '_x',
            type: 'int64',
          },
          {
            internalType: 'int64',
            name: '_y',
            type: 'int64',
          },
        ],
        internalType: 'struct Coordinates.Coordinate',
        name: 'coordinate',
        type: 'tuple',
      },
      {
        internalType: 'bytes32',
        name: 'name',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'exp',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'levelId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'referrer',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'townId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'joinBlock',
            type: 'uint256',
          },
        ],
        internalType: 'struct IKillThemAll.UserTownInfo',
        name: 'townInfo',
        type: 'tuple',
      },
      {
        components: [
          {
            components: [
              {
                internalType: 'uint256',
                name: '_at',
                type: 'uint256',
              },
            ],
            internalType: 'struct Timers.BlockNumber',
            name: 'getHealth',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: '_at',
                type: 'uint256',
              },
            ],
            internalType: 'struct Timers.BlockNumber',
            name: 'getMana',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: '_at',
                type: 'uint256',
              },
            ],
            internalType: 'struct Timers.BlockNumber',
            name: 'getEnergy',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: '_at',
                type: 'uint256',
              },
            ],
            internalType: 'struct Timers.BlockNumber',
            name: 'revive',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: '_at',
                type: 'uint256',
              },
            ],
            internalType: 'struct Timers.BlockNumber',
            name: 'teleport',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: '_at',
                type: 'uint256',
              },
            ],
            internalType: 'struct Timers.BlockNumber',
            name: 'teleportToTown',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: '_at',
                type: 'uint256',
              },
            ],
            internalType: 'struct Timers.BlockNumber',
            name: 'prepareToAttack',
            type: 'tuple',
          },
        ],
        internalType: 'struct IKillThemAll.UserTimer',
        name: 'timer',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'attack',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'defend',
            type: 'uint256',
          },
        ],
        internalType: 'struct IKillThemAll.UserCharPoint',
        name: 'charPoint',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'voyageTown',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
