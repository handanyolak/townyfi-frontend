/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IKtaGamePass,
  IKtaGamePassInterface,
} from "../../../../contracts/game/pass/IKtaGamePass";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "phase",
        type: "uint256",
      },
    ],
    name: "claim",
    outputs: [
      {
        internalType: "bool",
        name: "result",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IKtaGamePass__factory {
  static readonly abi = _abi;
  static createInterface(): IKtaGamePassInterface {
    return new utils.Interface(_abi) as IKtaGamePassInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IKtaGamePass {
    return new Contract(address, _abi, signerOrProvider) as IKtaGamePass;
  }
}