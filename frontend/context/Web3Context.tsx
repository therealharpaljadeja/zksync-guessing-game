import { Contract, Signer, Provider, BrowserProvider } from "zksync-ethers";
import React from "react";

export interface Web3ContextType {
    guessingGameContractInstance: Contract | null;
    provider: BrowserProvider | null;
    signer: Signer | null;
    networkOk: boolean | null;
    setGuessingGameContractInstance: (instance: Contract | null) => void;
    setProvider: (provider: BrowserProvider | null) => void;
    setSigner: (signer: Signer | null) => void;
    setNetworkOk: (network: boolean | null) => void;
}

export const defaultWeb3State: Web3ContextType = {
    guessingGameContractInstance: null,
    provider: null,
    signer: null,
    networkOk: null,
    setGuessingGameContractInstance: () => {},
    setProvider: () => {},
    setSigner: () => {},
    setNetworkOk: () => {},
};

const Web3Context = React.createContext<Web3ContextType>(defaultWeb3State);

export default Web3Context;
