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
  RemixTestHelpers,
  RemixTestHelpersInterface,
} from "../../../contracts/test/RemixTestHelpers";

const _abi = [
  {
    inputs: [],
    name: "getBlockNumber",
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
    name: "passNextBlock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080806040523460145760a1908161001a8239f35b600080fdfe6080806040526004361015601257600080fd5b600090813560e01c90816342cbb15c14604f575063aaeca8b114603457600080fd5b34604c5780600319360112604c576001815401815580f35b80fd5b90503460675781600319360112606757602090438152f35b5080fdfea26469706673582212200544c0b25a6fa6807a48d446fba09fac033c7e3fe23ba17565fc06fc1f4daec664736f6c63430008140033";

type RemixTestHelpersConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RemixTestHelpersConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RemixTestHelpers__factory extends ContractFactory {
  constructor(...args: RemixTestHelpersConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "RemixTestHelpers";
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      RemixTestHelpers & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): RemixTestHelpers__factory {
    return super.connect(runner) as RemixTestHelpers__factory;
  }
  static readonly contractName: "RemixTestHelpers";

  public readonly contractName: "RemixTestHelpers";

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RemixTestHelpersInterface {
    return new Interface(_abi) as RemixTestHelpersInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): RemixTestHelpers {
    return new Contract(address, _abi, runner) as unknown as RemixTestHelpers;
  }
}