/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "AccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AccessControl__factory>;
    getContractFactory(
      name: "IAccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccessControl__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "Pausable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Pausable__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "IERC20Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Permit__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "ERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721__factory>;
    getContractFactory(
      name: "IERC721Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Metadata__factory>;
    getContractFactory(
      name: "IERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721__factory>;
    getContractFactory(
      name: "IERC721Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Receiver__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "X_KillThemAll",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.X_KillThemAll__factory>;
    getContractFactory(
      name: "IKtaGameChat",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IKtaGameChat__factory>;
    getContractFactory(
      name: "KtaGameChat",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KtaGameChat__factory>;
    getContractFactory(
      name: "IKillThemAll",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IKillThemAll__factory>;
    getContractFactory(
      name: "KillThemAll",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KillThemAll__factory>;
    getContractFactory(
      name: "AKtaGamePass",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AKtaGamePass__factory>;
    getContractFactory(
      name: "IKtaGamePass",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IKtaGamePass__factory>;
    getContractFactory(
      name: "IKtaGamePassNft",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IKtaGamePassNft__factory>;
    getContractFactory(
      name: "KtaGamePassNft",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KtaGamePassNft__factory>;
    getContractFactory(
      name: "KtaGamePass1",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KtaGamePass1__factory>;
    getContractFactory(
      name: "KtaToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KtaToken__factory>;
    getContractFactory(
      name: "RemixTestHelpers",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.RemixTestHelpers__factory>;

    getContractAt(
      name: "AccessControl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AccessControl>;
    getContractAt(
      name: "IAccessControl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccessControl>;
    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "Pausable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Pausable>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "IERC20Permit",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Permit>;
    getContractAt(
      name: "IERC20Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "ERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721>;
    getContractAt(
      name: "IERC721Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Metadata>;
    getContractAt(
      name: "IERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721>;
    getContractAt(
      name: "IERC721Receiver",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Receiver>;
    getContractAt(
      name: "ERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165>;
    getContractAt(
      name: "IERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "X_KillThemAll",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.X_KillThemAll>;
    getContractAt(
      name: "IKtaGameChat",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IKtaGameChat>;
    getContractAt(
      name: "KtaGameChat",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.KtaGameChat>;
    getContractAt(
      name: "IKillThemAll",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IKillThemAll>;
    getContractAt(
      name: "KillThemAll",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.KillThemAll>;
    getContractAt(
      name: "AKtaGamePass",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AKtaGamePass>;
    getContractAt(
      name: "IKtaGamePass",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IKtaGamePass>;
    getContractAt(
      name: "IKtaGamePassNft",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IKtaGamePassNft>;
    getContractAt(
      name: "KtaGamePassNft",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.KtaGamePassNft>;
    getContractAt(
      name: "KtaGamePass1",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.KtaGamePass1>;
    getContractAt(
      name: "KtaToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.KtaToken>;
    getContractAt(
      name: "RemixTestHelpers",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.RemixTestHelpers>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}