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
import type { NonPayableOverrides } from "../../../common";
import type {
  MultiCall,
  MultiCallInterface,
} from "../../../contracts/helpers/MultiCall";

const _abi = [
  {
    inputs: [],
    name: "CallFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "LengthNotMatch",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "targets",
        type: "address[]",
      },
      {
        internalType: "bytes[]",
        name: "data",
        type: "bytes[]",
      },
    ],
    name: "multiCall",
    outputs: [
      {
        internalType: "bytes[]",
        name: "results",
        type: "bytes[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080806040523461001657610369908161001c8239f35b600080fdfe608060408181526004918236101561001657600080fd5b600092833560e01c63da5b4ffd1461002d57600080fd5b3461023457826003193601126102345767ffffffffffffffff813581811161027b5761005c903690840161027f565b9190926024803583811161027757610077903690840161027f565b9390968486036102695750610096610091869997996102f1565b6102b5565b96858852601f1998896100a8886102f1565b018b5b8181106102565750508a5b878110610150578b8b8b8b805192602080850191818652845180935281848701948460051b88010195019387915b8483106100f15787870388f35b909192939495603f19888203018352848288518b815191828652815b838110610136575050818501840152601f011690910181019681019594936001019201906100e4565b8082018601518782018701528a958895508f93500161010d565b979997600581901b82810135906001600160a01b03821682036102525788831015610240578d90850135601e198636030181121561023c57850191823590878211610238576020809401918036038313610234578f92818594519283928337810184815203915afa3d1561022b573d868111610219578e6101d7848e601f850116016102b5565b91825281933d92013e5b1561020957906001916101f4828d610309565b526101ff818c610309565b50019997996100b6565b8b51633204506f60e01b81528790fd5b634e487b7160e01b8f5260418952878ffd5b606091506101e1565b8380fd5b8280fd5b5080fd5b634e487b7160e01b8e5260328852868efd5b8d80fd5b60606020828d01810191909152016100ab565b631985132360e31b81528390fd5b8880fd5b8580fd5b9181601f840112156102b05782359167ffffffffffffffff83116102b0576020808501948460051b0101116102b057565b600080fd5b6040519190601f01601f1916820167ffffffffffffffff8111838210176102db57604052565b634e487b7160e01b600052604160045260246000fd5b67ffffffffffffffff81116102db5760051b60200190565b805182101561031d5760209160051b010190565b634e487b7160e01b600052603260045260246000fdfea26469706673582212201beb86f48c5a0576fe2388861ea274d39f25281ae84cb7216eeb27370347bc3e64736f6c63430008140033";

type MultiCallConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MultiCallConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MultiCall__factory extends ContractFactory {
  constructor(...args: MultiCallConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "MultiCall";
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      MultiCall & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): MultiCall__factory {
    return super.connect(runner) as MultiCall__factory;
  }
  static readonly contractName: "MultiCall";

  public readonly contractName: "MultiCall";

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MultiCallInterface {
    return new Interface(_abi) as MultiCallInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): MultiCall {
    return new Contract(address, _abi, runner) as unknown as MultiCall;
  }
}