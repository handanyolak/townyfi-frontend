/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  BigNumberish,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type {
  KtaToken,
  KtaTokenInterface,
} from "../../../../contracts/game/token/KtaToken";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "initialSupply",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientAllowance",
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
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientBalance",
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
    name: "ERC20InvalidApprover",
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
    name: "ERC20InvalidReceiver",
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
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSpender",
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
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
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
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
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
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
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
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [],
    name: "totalSupply",
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
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
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
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608034620003b0576001600160401b0390601f601f1962000b28388190038381018316850186811186821017620002b457859282916040528339602094859181010312620003b057519362000053620003b5565b92600d84526c12da5b1b08151a195b48105b1b609a1b8585015262000077620003b5565b93600391828652624b544160e81b878701528151848111620002b45783546001938482811c92168015620003a5575b8a8310146200038f57818484931162000339575b508990848311600114620002d657600092620002ca575b505060001982861b1c191690831b1783555b8551938411620002b45760049586548381811c91168015620002a9575b89821014620002945782811162000249575b5087918511600114620001e05784955090849291600095620001d4575b50501b92600019911b1c19161781555b3315620001bc5760025490838201809211620001a757506000917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91600255338352828152604083208481540190556040519384523393a36040516107529081620003d68239f35b601190634e487b7160e01b6000525260246000fd5b60249060006040519163ec442f0560e01b8352820152fd5b0151935038806200012f565b9291948416928660005284886000209460005b8a8983831062000231575050501062000216575b50505050811b0181556200013f565b01519060f884600019921b161c191690553880808062000207565b868601518955909701969485019488935001620001f3565b87600052886000208380880160051c8201928b89106200028a575b0160051c019084905b8281106200027d57505062000112565b600081550184906200026d565b9250819262000264565b602288634e487b7160e01b6000525260246000fd5b90607f169062000100565b634e487b7160e01b600052604160045260246000fd5b015190503880620000d1565b908886941691876000528b6000209260005b8d82821062000322575050841162000309575b505050811b018355620000e3565b015160001983881b60f8161c19169055388080620002fb565b8385015186558997909501949384019301620002e8565b90915085600052896000208480850160051c8201928c861062000385575b918791869594930160051c01915b82811062000375575050620000ba565b6000815585945087910162000365565b9250819262000357565b634e487b7160e01b600052602260045260246000fd5b91607f1691620000a6565b600080fd5b60408051919082016001600160401b03811183821017620002b45760405256fe608060408181526004918236101561001657600080fd5b600092833560e01c91826306fdde03146104ec57508163095ea7b31461044257816318160ddd1461042357816323b872dd1461032c578163313ce5671461031057816340c10f191461026457816370a082311461022d57816395d89b411461010e57508063a9059cbb146100de5763dd62ed3e1461009357600080fd5b346100da57806003193601126100da57806020926100af61060d565b6100b7610628565b6001600160a01b0391821683526001865283832091168252845220549051908152f35b5080fd5b50346100da57806003193601126100da576020906101076100fd61060d565b602435903361063e565b5160018152f35b8383346100da57816003193601126100da57805190828454600181811c90808316928315610223575b6020938484108114610210578388529081156101f4575060011461019f575b505050829003601f01601f191682019267ffffffffffffffff84118385101761018c57508291826101889252826105c4565b0390f35b634e487b7160e01b815260418552602490fd5b8787529192508591837f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b5b8385106101e05750505050830101858080610156565b8054888601830152930192849082016101ca565b60ff1916878501525050151560051b8401019050858080610156565b634e487b7160e01b895260228a52602489fd5b91607f1691610137565b5050346100da5760203660031901126100da5760209181906001600160a01b0361025561060d565b16815280845220549051908152f35b9190503461030c578060031936011261030c5761027f61060d565b6001600160a01b031691602435919083156102f757600254908382018092116102e4575084927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9260209260025585855284835280852082815401905551908152a380f35b634e487b7160e01b865260119052602485fd5b84602492519163ec442f0560e01b8352820152fd5b8280fd5b5050346100da57816003193601126100da576020905160128152f35b905082346104205760603660031901126104205761034861060d565b610350610628565b916044359360018060a01b03831680835260016020528683203384526020528683205491600019830361038c575b60208861010789898961063e565b8683106103f45781156103dd5733156103c6575082526001602090815286832033845281529186902090859003905582906101078761037e565b8751634a1406b160e11b8152908101849052602490fd5b875163e602df0560e01b8152908101849052602490fd5b8751637dc7a0d960e11b8152339181019182526020820193909352604081018790528291506060010390fd5b80fd5b5050346100da57816003193601126100da576020906002549051908152f35b90503461030c578160031936011261030c5761045c61060d565b6024359033156104d5576001600160a01b03169182156104be57508083602095338152600187528181208582528752205582519081527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925843392a35160018152f35b8351634a1406b160e11b8152908101859052602490fd5b835163e602df0560e01b8152808401869052602490fd5b8490843461030c578260031936011261030c5782600354600181811c908083169283156105ba575b6020938484108114610210578388529081156101f4575060011461056457505050829003601f01601f191682019267ffffffffffffffff84118385101761018c57508291826101889252826105c4565b600387529192508591837fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b5b8385106105a65750505050830101858080610156565b805488860183015293019284908201610590565b91607f1691610514565b6020808252825181830181905290939260005b8281106105f957505060409293506000838284010152601f8019910116010190565b8181018601518482016040015285016105d7565b600435906001600160a01b038216820361062357565b600080fd5b602435906001600160a01b038216820361062357565b916001600160a01b0380841692831561070357169283156106ea57600090838252816020526040822054908382106106b8575091604082827fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef958760209652828652038282205586815220818154019055604051908152a3565b60405163391434e360e21b81526001600160a01b03919091166004820152602481019190915260448101839052606490fd5b60405163ec442f0560e01b815260006004820152602490fd5b604051634b637e8f60e11b815260006004820152602490fdfea264697066735822122057dad903629129ffbe5002fca6a7f780e7108e6d3a417184b573e58115bb8c8c64736f6c63430008140033";

type KtaTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: KtaTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class KtaToken__factory extends ContractFactory {
  constructor(...args: KtaTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "KtaToken";
  }

  override getDeployTransaction(
    initialSupply: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(initialSupply, overrides || {});
  }
  override deploy(
    initialSupply: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(initialSupply, overrides || {}) as Promise<
      KtaToken & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): KtaToken__factory {
    return super.connect(runner) as KtaToken__factory;
  }
  static readonly contractName: "KtaToken";

  public readonly contractName: "KtaToken";

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): KtaTokenInterface {
    return new Interface(_abi) as KtaTokenInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): KtaToken {
    return new Contract(address, _abi, runner) as unknown as KtaToken;
  }
}