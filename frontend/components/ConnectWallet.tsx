import Web3Context from "@/context/Web3Context";
import {
    GUESSING_GAME_CONTRACT,
    GUESSING_GAME_CONTRACT_ABI,
    NETWORK_ID,
    NETWORK_NAME,
} from "@/utils/constants";
import { Button, Heading } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Signer, Contract, BrowserProvider } from "zksync-ethers";
import { BrowserProvider as Provider } from "ethers";
import { Address } from "zksync-ethers/build/types";

export default function ConnectWallet() {
    const {
        provider,
        setGuessingGameContractInstance,
        setSigner,
        networkOk,
        setNetworkOk,
    } = useContext(Web3Context);
    const [isWalletInstalled, setIsWalletInstalled] = useState(false);
    const [wallet, setWallet] = useState({ address: "", acc_short: "" });

    useEffect(() => {
        if ((window as any).ethereum) {
            setIsWalletInstalled(true);
            checkNetwork();
        }
    }, []);

    const shortenAddress = (address: Address) => {
        const start = address.slice(0, 6);
        const end = address.slice(-4);
        return `${start}...${end}`;
    };

    const checkNetwork = async () => {
        const currentChainId = await (window as any).ethereum.request({
            method: "eth_chainId",
        });

        if (currentChainId == NETWORK_ID) setNetworkOk(true);
        else setNetworkOk(false);
    };

    const initContracts = async (provider: BrowserProvider, signer: Signer) => {
        if (provider && signer) {
            const guessingGameContract = new Contract(
                GUESSING_GAME_CONTRACT,
                GUESSING_GAME_CONTRACT_ABI,
                signer
            );

            setGuessingGameContractInstance(guessingGameContract);

            const fetchedHashedNumber =
                await guessingGameContract.hashedSecretNumber();

            console.log(fetchedHashedNumber);
        }
    };

    const switchNetwork = async () => {
        await (window as any).ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: NETWORK_ID }],
        });
        window.location.reload();
    };

    const connectWallet = async () => {
        if (!networkOk) await switchNetwork();
        try {
            if ((window as any).ethereum) {
                const provider = new BrowserProvider((window as any).ethereum);

                const data = await provider.send("eth_requestAccounts", []);

                const signerInstance = await provider.getSigner();

                setSigner(signerInstance);

                setWallet({
                    address: data[0],
                    acc_short: shortenAddress(data[0]),
                });

                await initContracts(provider, signerInstance);
            }
        } catch (error) {
            console.error("Error connecting DApp to your wallet");
            console.error(error);
        }
    };

    return (
        <>
            {isWalletInstalled ? (
                !networkOk ? (
                    <Button onClick={switchNetwork}>
                        Wrong network. Switch to {NETWORK_NAME}
                    </Button>
                ) : (
                    <Button
                        onClick={connectWallet}
                        disabled={wallet.address != ""}
                        className={`relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-custom hover:bg-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-custom ${
                            wallet.address == "" ? "disabled:opacity-50" : ""
                        }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>
                            {wallet.address != ""
                                ? `Connected ${wallet.acc_short}`
                                : `Connect Wallet`}
                        </span>
                    </Button>
                )
            ) : (
                <Heading size={"md"}>Please install a wallet first</Heading>
            )}
        </>
    );
}
