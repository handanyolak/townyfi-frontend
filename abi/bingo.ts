export const bingoAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'vrfWrapperAddress',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'CardAlreadyChecked_1015',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CardPurchaseBlocked_1004',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DrawnNumbersFilled_1019',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DrawnNumbersNotFilled_1012',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FinalizationExpired_1013',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FinalizationPending_1016',
    type: 'error',
  },
  {
    inputs: [],
    name: 'GasPriceTooHigh_1001',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InsufficientContractBalance_1011',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InsufficientPayment_1006',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InsufficientPlayers_1010',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidCardNumberRange_1007',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidGameId_1018',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NoRewardAvailable_1017',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NonUniqueCardNumbers_1008',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'have',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'want',
        type: 'address',
      },
    ],
    name: 'OnlyVRFWrapperCanFulfill',
    type: 'error',
  },
  {
    inputs: [],
    name: 'PlayerAlreadyExists_1005',
    type: 'error',
  },
  {
    inputs: [],
    name: 'PlayerNotFound_1014',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ReentrancyBlocked_1002',
    type: 'error',
  },
  {
    inputs: [],
    name: 'RefundMismatch_1020',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SendFailed_1003',
    type: 'error',
  },
  {
    inputs: [],
    name: 'VRFRequestExists_1009',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'gameId',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'playerAddress',
            type: 'address',
          },
          {
            internalType: 'uint8',
            name: 'remainingNumbersCount',
            type: 'uint8',
          },
          {
            internalType: 'uint8[15]',
            name: 'cardNumbers',
            type: 'uint8[15]',
          },
          {
            internalType: 'uint256',
            name: 'numberBitmap',
            type: 'uint256',
          },
        ],
        indexed: false,
        internalType: 'struct BinGoods.Player',
        name: 'player',
        type: 'tuple',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'CardPurchased',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'gameId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'drawnNumbersTimestamp',
        type: 'uint256',
      },
    ],
    name: 'DrawnNumbersFilled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'gameId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'requestPrice',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'refundAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'requestTimestamp',
        type: 'uint256',
      },
    ],
    name: 'RequestRandomness',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'gameId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'winner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'claimAmount',
        type: 'uint256',
      },
    ],
    name: 'RewardClaimed',
    type: 'event',
  },
  {
    inputs: [],
    name: 'BINGO_CARD_NUMBERS_COUNT',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'BINGO_CARD_PRICE',
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
    name: 'BINGO_MAX_NUMBER',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'BINGO_MIN_NUMBER',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'BINGO_NUMBERS_COUNT',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'FINALIZATION_COOLDOWN',
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
    name: 'MAX_VRF_CALLBACK_GAS_LIMIT',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MIN_PLAYERS',
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
    name: 'MIN_VRF_CALLBACK_GAS_LIMIT',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MIN_VRF_REQUEST_RETRY_INTERVAL',
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
    name: 'VRF_NUM_WORDS',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'VRF_REQUEST_CONFIRMATIONS',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'availableGameId',
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
    inputs: [
      {
        internalType: 'uint8[15]',
        name: 'cardNumbers',
        type: 'uint8[15]',
      },
    ],
    name: 'buyCard',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'claimReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'drawnNumbers',
    outputs: [
      {
        internalType: 'uint8[90]',
        name: '',
        type: 'uint8[90]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'drawnNumbersTimestamp',
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
    name: 'getBalance',
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
    name: 'getLinkToken',
    outputs: [
      {
        internalType: 'contract LinkTokenInterface',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'i_vrfV2PlusWrapper',
    outputs: [
      {
        internalType: 'contract IVRFV2PlusWrapper',
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
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'isDrawnNumbersFilled',
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
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'isGameFinished',
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
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'playerAddress',
        type: 'address',
      },
    ],
    name: 'isPlayerExists',
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
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'playerAddress',
        type: 'address',
      },
    ],
    name: 'playerDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'playerAddress',
            type: 'address',
          },
          {
            internalType: 'uint8',
            name: 'remainingNumbersCount',
            type: 'uint8',
          },
          {
            internalType: 'uint8[15]',
            name: 'cardNumbers',
            type: 'uint8[15]',
          },
          {
            internalType: 'uint256',
            name: 'numberBitmap',
            type: 'uint256',
          },
        ],
        internalType: 'struct BinGoods.Player',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'cursor',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'length',
        type: 'uint256',
      },
    ],
    name: 'players',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'prizePoolBalance',
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
    inputs: [
      {
        internalType: 'uint256',
        name: '_requestId',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: '_randomWords',
        type: 'uint256[]',
      },
    ],
    name: 'rawFulfillRandomWords',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'requestRandomNumbers',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'requestRandomNumbersRefund',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'requestRandomnessPayment',
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
    name: 'shouldSubmitCard',
    outputs: [
      {
        internalType: 'bool',
        name: '_shouldSubmitCard',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'submitCard',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'vrfRequestId',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'vrfRequested',
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
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'cursor',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'length',
        type: 'uint256',
      },
    ],
    name: 'winners',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'winningDrawnNumberIndex',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdrawNative',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
] as const
