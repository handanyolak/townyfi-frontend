/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type {
  KtaGamePassNft,
  KtaGamePassNftInterface,
} from "../../../../contracts/game/pass/KtaGamePassNft";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AccessControlBadConfirmation",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "neededRole",
        type: "bytes32",
      },
    ],
    name: "AccessControlUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ERC721IncorrectOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ERC721InsufficientApproval",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC721InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "ERC721InvalidOperator",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ERC721InvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC721InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC721InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ERC721NonexistentToken",
    type: "error",
  },
  {
    inputs: [],
    name: "EnforcedPause",
    type: "error",
  },
  {
    inputs: [],
    name: "ExpectedPause",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MINTER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PAUSER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "nftDataByTokenId",
    outputs: [
      {
        internalType: "uint256",
        name: "gamePassId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "contract IKtaGamePass",
            name: "pass",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startBlock",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endBlock",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "phaseLimits",
            type: "uint256[]",
          },
        ],
        internalType: "struct IKillThemAll.GamePass",
        name: "gamePass",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "playerExpAtCreation",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "playerTokenIdByGamePassId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "callerConfirmation",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "passId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "contract IKtaGamePass",
            name: "pass",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startBlock",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endBlock",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "phaseLimits",
            type: "uint256[]",
          },
        ],
        internalType: "struct IKillThemAll.GamePass",
        name: "gamePass",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "playerExp",
        type: "uint256",
      },
    ],
    name: "safeMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60803462000338576001600160401b03906040908082018381118282101762000322578252601581526020927f4b696c6c5468656d416c6c2047616d65205061737300000000000000000000008483015282518381018181108382111762000322578452600581526404b544147560dc1b85820152825190828211620003225760008054926001958685811c9516801562000317575b8986101462000303578190601f95868111620002b0575b5089908683116001146200024c57849262000240575b5050600019600383901b1c191690861b1781555b81519384116200022c5784548581811c9116801562000221575b888210146200020d57838111620001c5575b50869284116001146200015f5783949596509262000153575b5050600019600383901b1c191690821b1790555b60ff196006541660065562000144336200033d565b50516118319081620003d08239f35b0151905038806200011b565b9190601f1984169685845280842093905b888210620001ad575050838596971062000193575b505050811b0190556200012f565b015160001960f88460031b161c1916905538808062000185565b80878596829496860151815501950193019062000170565b8582528782208480870160051c8201928a881062000203575b0160051c019086905b828110620001f757505062000102565b838155018690620001e7565b92508192620001de565b634e487b7160e01b82526022600452602482fd5b90607f1690620000f0565b634e487b7160e01b81526041600452602490fd5b015190503880620000c2565b8480528a85208994509190601f198416865b8d8282106200029957505084116200027f575b505050811b018155620000d6565b015160001960f88460031b161c1916905538808062000271565b8385015186558c979095019493840193016200025e565b9091508380528984208680850160051c8201928c8610620002f9575b918a91869594930160051c01915b828110620002ea575050620000ac565b8681558594508a9101620002da565b92508192620002cc565b634e487b7160e01b83526022600452602483fd5b94607f169462000095565b634e487b7160e01b600052604160045260246000fd5b600080fd5b6001600160a01b031660008181527f6d5257204ebe7d88fd91ae87941cb2dd9d8062b64ae5a2bd2d28ec40b9fbf6df602052604081205490919060ff16620003cb5781805260076020526040822081835260205260408220600160ff1982541617905533917f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d8180a4600190565b509056fe608080604052600436101561001357600080fd5b60003560e01c90816301ffc9a7146111b75750806306fdde03146110f8578063081812fc146110ba578063095ea7b314610fd357806323b872dd14610fbc578063248a9ca314610f8d5780632f2ff15d14610f4e57806336568abe14610f075780633f4ba83a14610e9d57806342842e0e14610e6f5780635c975abb14610e4c5780636352211e14610e1c57806370a0823114610dc35780638456cb5914610d6957806391d1485414610d1c57806395d89b4114610c11578063a217fddf14610bf5578063a22cb46514610b50578063b12b98b214610b08578063b88d4fde14610a74578063c0dc21c7146103dc578063c87b56dd14610385578063d53913931461034a578063d547741f14610309578063e63ab1e9146102ce578063e985e9c5146102785763ec8fa9641461014857600080fd5b346102735760208060031936011261027357600435600052600881526040600020908154906040519061017a826112dd565b60018060a01b039060019482868201541684526002810154828501908152600382015460408601908152600483015491606087019283526005840193604051948587825491828152019160005287600020908c60005b8281106102605750505050906101ea866006930387611315565b608089019586520154956040519889526060868a0152610100890197511660608901525160808801525160a08701525160c0860152519260a060e0860152835180915281610120860194019160005b82811061024d578680878760408301520390f35b8351865294810194928101928701610239565b83548552938a01939281019281016101d0565b600080fd5b346102735760403660031901126102735761029161127c565b610299611292565b9060018060a01b03809116600052600560205260406000209116600052602052602060ff604060002054166040519015158152f35b346102735760003660031901126102735760206040517f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a8152f35b3461027357604036600319011261027357610348600435610328611292565b908060005260076020526103436001604060002001546113af565b611455565b005b346102735760003660031901126102735760206040517f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a68152f35b34610273576020366003190112610273576103a160043561165a565b5060006040516103b0816112f9565b526103d86040516103c0816112f9565b6000815260405191829160208352602083019061123c565b0390f35b3461027357600319608036820112610273576103f661127c565b906044359067ffffffffffffffff82116102735760a09082360301126102735760405190610423826112dd565b60048101356001600160a01b038116810361027357825260248101356020830152604082016044820135815260608301916064810135835260848101359067ffffffffffffffff82116102735701366023820112156102735760048101359067ffffffffffffffff821161094b578160051b604051926104a66020830185611315565b8352602460208401918301019136831161027357602401905b828210610a645750505060808401523360009081527fa4bfd7afe708e2e87e7f0e2ad9b4d545417e0f795f57b5c5ab5d799c565a04f460205260409020547f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a69060ff1615610a4657506105306117dd565b514310610a0157514310156109bc5760018060a01b0382166000526009602052604060002060243560005260205260406000205461097757600a549060001982146109615760018201600a5560018060a01b03831660005260096020526040600020602435600052602052600182016040600020556040519081606081011067ffffffffffffffff60608401111761094b57606082016040526024358252602082015260643560408201526001820160005260086020526040600020908051825560806001830160208301519060018060a01b038251166bffffffffffffffffffffffff60a01b825416179055602081015160028501556040810151600385015560608101516004850155015180519067ffffffffffffffff821161094b5768010000000000000000821161094b57600584015482600586015580831061091e575b5060200160058401600052602060002060005b83811061090a5750505050604060069101519101556040516106a6816112f9565b600081526001600160a01b038316156108f1576106c16117dd565b600182016000908152600260205260409020546001600160a01b031680151590816108ab575b6001600160a01b03851660008181526003602090815260408083208054600190810190915588018084526002909252822080546001600160a01b0319168417905592907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9080a461089257823b61075a57005b602061079991604051809381926001630a85bd0160e11b978885523360048601526000602486015201604484015260806064840152608483019061123c565b038160006001600160a01b0388165af16000918161084d575b5061081a57823d15610812573d906107c982611337565b916107d76040519384611315565b82523d6000602084013e5b8151918261080b57604051633250574960e11b81526001600160a01b0383166004820152602490fd5b9050602001fd5b6060906107e2565b6001600160e01b0319160361082b57005b604051633250574960e11b81526001600160a01b039091166004820152602490fd5b9091506020813d60201161088a575b8161086960209383611315565b8101031261027357516001600160e01b0319811681036102735790846107b2565b3d915061085c565b6040516339e3563760e11b815260006004820152602490fd5b6108d660018501600052600460205260406000206bffffffffffffffffffffffff60a01b8154169055565b806000526003602052604060002060001981540190556106e7565b604051633250574960e11b815260006004820152602490fd5b600190602084519401938184015501610685565b600585016000526020600020908382015b818301811061093f575050610672565b6000815560010161092f565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052601160045260246000fd5b60405162461bcd60e51b815260206004820152601c60248201527f506c6179657220616c72656164792068617320746869732070617373000000006044820152606490fd5b60405162461bcd60e51b815260206004820152601a60248201527f54686973207061737320616c72656164792066696e69736865640000000000006044820152606490fd5b60405162461bcd60e51b815260206004820152601a60248201527f546869732070617373206e6f74206d696e7461626c65207965740000000000006044820152606490fd5b6044906040519063e2517d3f60e01b82523360048301526024820152fd5b81358152602091820191016104bf565b3461027357608036600319011261027357610a8d61127c565b610a95611292565b906044356064359267ffffffffffffffff8411610273573660238501121561027357836004013592610ac684611337565b93610ad46040519586611315565b808552366024828801011161027357602081600092602461034899018389013786010152610b038383836114cc565b611695565b34610273576040366003190112610273576001600160a01b03610b2961127c565b16600052600960205260406000206024356000526020526020604060002054604051908152f35b3461027357604036600319011261027357610b6961127c565b60243590811515809203610273576001600160a01b0316908115610bdc57336000526005602052604060002082600052602052604060002060ff1981541660ff83161790556040519081527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3160203392a3005b604051630b61174360e31b815260048101839052602490fd5b3461027357600036600319011261027357602060405160008152f35b3461027357600036600319011261027357604051600060019081549182811c91818416918215610d12575b6020948585108414610cfc578587948686529182600014610cdc575050600114610c82575b50610c6e92500383611315565b6103d860405192828493845283019061123c565b6000818152859250907fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf65b858310610cc4575050610c6e935082010185610c61565b80548389018501528794508693909201918101610cad565b60ff191685820152610c6e95151560051b8501019250879150610c619050565b634e487b7160e01b600052602260045260246000fd5b92607f1692610c3c565b3461027357604036600319011261027357610d35611292565b600435600052600760205260406000209060018060a01b0316600052602052602060ff604060002054166040519015158152f35b3461027357600036600319011261027357610d82611353565b610d8a6117dd565b600160ff1960065416176006557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586020604051338152a1005b34610273576020366003190112610273576001600160a01b03610de461127c565b168015610e035760005260036020526020604060002054604051908152f35b6040516322718ad960e21b815260006004820152602490fd5b34610273576020366003190112610273576020610e3a60043561165a565b6040516001600160a01b039091168152f35b3461027357600036600319011261027357602060ff600654166040519015158152f35b3461027357610348610e80366112a8565b9060405192610e8e846112f9565b60008452610b038383836114cc565b3461027357600036600319011261027357610eb6611353565b60065460ff811615610ef55760ff19166006557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa6020604051338152a1005b604051638dfc202b60e01b8152600490fd5b3461027357604036600319011261027357610f20611292565b336001600160a01b03821603610f3c5761034890600435611455565b60405163334bd91960e11b8152600490fd5b3461027357604036600319011261027357610348600435610f6d611292565b90806000526007602052610f886001604060002001546113af565b6113d5565b346102735760203660031901126102735760043560005260076020526020600160406000200154604051908152f35b3461027357610348610fcd366112a8565b916114cc565b3461027357604036600319011261027357610fec61127c565b602435610ff88161165a565b331515806110a7575b8061107a575b611062576001600160a01b039283169282918491167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925600080a4600090815260046020526040902080546001600160a01b0319169091179055005b60405163a9fbf51f60e01b8152336004820152602490fd5b5060018060a01b038116600052600560205260406000203360005260205260ff6040600020541615611007565b506001600160a01b038116331415611001565b34610273576020366003190112610273576004356110d78161165a565b506000526004602052602060018060a01b0360406000205416604051908152f35b34610273576000366003190112610273576040516000805490600182811c918184169182156111ad575b6020948585108414610cfc578587948686529182600014610cdc5750506001146111535750610c6e92500383611315565b6000808052859250907f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e5635b858310611195575050610c6e935082010185610c61565b8054838901850152879450869390920191810161117e565b92607f1692611122565b34610273576020366003190112610273576004359063ffffffff60e01b821680920361027357602091637965db0b60e01b81149081156111f9575b5015158152f35b6380ac58cd60e01b81149150811561122b575b811561121a575b50836111f2565b6301ffc9a760e01b14905083611213565b635b5e139f60e01b8114915061120c565b919082519283825260005b848110611268575050826000602080949584010152601f8019910116010190565b602081830181015184830182015201611247565b600435906001600160a01b038216820361027357565b602435906001600160a01b038216820361027357565b6060906003190112610273576001600160a01b0390600435828116810361027357916024359081168103610273579060443590565b60a0810190811067ffffffffffffffff82111761094b57604052565b6020810190811067ffffffffffffffff82111761094b57604052565b90601f8019910116810190811067ffffffffffffffff82111761094b57604052565b67ffffffffffffffff811161094b57601f01601f191660200190565b3360009081527f270c7cc4331b1445974c76712d9bb2afa8846ba0435cde7d1460f79fd91c04bd60205260409020547f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a9060ff1615610a465750565b80600052600760205260406000203360005260205260ff6040600020541615610a465750565b906000918083526007602052604083209160018060a01b03169182845260205260ff604084205416156000146114505780835260076020526040832082845260205260408320600160ff198254161790557f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d339380a4600190565b505090565b906000918083526007602052604083209160018060a01b03169182845260205260ff604084205416600014611450578083526007602052604083208284526020526040832060ff1981541690557ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b339380a4600190565b6001600160a01b0391821692909183156108f1576114e86117dd565b6000928284528260209560028752604096848888205416968791331515806115c4575b509060027fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9284611591575b858352600381528b8320805460010190558683525289812080546001600160a01b0319168517905580a416928383036115705750505050565b6064945051926364283d7b60e01b8452600484015260248301526044820152fd5b600087815260046020526040902080546001600160a01b0319169055848352600381528b83208054600019019055611537565b91939450915080611619575b156115e05785929187913861150b565b8786886115fd576024915190637e27328960e01b82526004820152fd5b604491519063177e802f60e01b82523360048301526024820152fd5b50338714801561163e575b806115d057508582526004815233858984205416146115d0565b5086825260058152878220338352815260ff8883205416611624565b6000818152600260205260409020546001600160a01b031690811561167d575090565b60249060405190637e27328960e01b82526004820152fd5b813b6116a2575b50505050565b604051630a85bd0160e11b8082523360048301526001600160a01b039283166024830152604482019490945260806064820152602095929091169390929083906116f090608483019061123c565b039285816000958187895af1849181611799575b50611764575050503d60001461175c573d61171e81611337565b9061172c6040519283611315565b81528091843d92013e5b8051928361175757604051633250574960e11b815260048101849052602490fd5b019050fd5b506060611736565b919450915063ffffffff60e01b160361178157503880808061169c565b60249060405190633250574960e11b82526004820152fd5b9091508681813d83116117d6575b6117b18183611315565b810103126117d257516001600160e01b0319811681036117d2579038611704565b8480fd5b503d6117a7565b60ff600654166117e957565b60405163d93c066560e01b8152600490fdfea2646970667358221220d20fa6b5b7aa2161e54337550887b4d4069a5ee9541775139c74abe1a6ef655e64736f6c63430008140033";

type KtaGamePassNftConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: KtaGamePassNftConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class KtaGamePassNft__factory extends ContractFactory {
  constructor(...args: KtaGamePassNftConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "KtaGamePassNft";
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      KtaGamePassNft & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): KtaGamePassNft__factory {
    return super.connect(runner) as KtaGamePassNft__factory;
  }
  static readonly contractName: "KtaGamePassNft";

  public readonly contractName: "KtaGamePassNft";

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): KtaGamePassNftInterface {
    return new Interface(_abi) as KtaGamePassNftInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): KtaGamePassNft {
    return new Contract(address, _abi, runner) as unknown as KtaGamePassNft;
  }
}