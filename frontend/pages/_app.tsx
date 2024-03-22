import Web3Context from "@/context/Web3Context";
import "@/styles/globals.css";
import { BrowserProvider, Contract, Provider, Signer } from "zksync-ethers";
import type { AppProps } from "next/app";
import { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
    const [guessingGameContractInstance, setGuessingGameContractInstance] =
        useState<Contract | null>(null);
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [signer, setSigner] = useState<Signer | null>(null);
    const [networkOk, setNetworkOk] = useState<boolean | null>(null);

    return (
        <>
            <Head>
                <title>ZkSync Guessing Game</title>
            </Head>
            <ChakraProvider>
                <Web3Context.Provider
                    value={{
                        guessingGameContractInstance,
                        setGuessingGameContractInstance,
                        provider,
                        networkOk,
                        setProvider,
                        signer,
                        setSigner,
                        setNetworkOk,
                    }}
                >
                    <Component {...pageProps} />
                </Web3Context.Provider>
            </ChakraProvider>
        </>
    );
}
