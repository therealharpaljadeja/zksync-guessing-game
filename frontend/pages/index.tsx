import ConnectWallet from "@/components/ConnectWallet";
import Web3Context from "@/context/Web3Context";
import React, { ChangeEvent, useContext, useState } from "react";
import CustomCard from "@/components/Card";
import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    ToastId,
} from "@chakra-ui/react";
import { parseEther } from "ethers";
import { useToast } from "@chakra-ui/react";

export default function Home() {
    const { signer, guessingGameContractInstance, networkOk } =
        useContext(Web3Context);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const toastIdRef = React.useRef<ToastId>();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        console.log(value);
        // Regular expression to check if the input contains only digits
        const isValidInput = /^\d*$/.test(value);

        if (isValidInput) {
            setInputValue(value);
            setError("");
        } else {
            setError("Please enter a valid number");
        }
    };

    const makeAGuess = async () => {
        try {
            if (guessingGameContractInstance) {
                toastIdRef.current = toast({
                    title: "Waiting for user",
                    status: "loading",
                    duration: 10000,
                    isClosable: false,
                    position: "top",
                });

                setIsLoading(true);

                let tx = await guessingGameContractInstance.guessNumber(
                    inputValue,
                    {
                        value: parseEther("0.001"),
                    }
                );

                toast.update(toastIdRef.current, {
                    title: "Waiting for transaction confirmation",
                    status: "loading",
                    duration: 10000,
                    isClosable: false,
                });

                let receipt = await tx.wait();

                console.log(receipt);

                toast.update(toastIdRef.current, {
                    title: "Transaction sent",
                    status: "success",
                    duration: 10000,
                    isClosable: true,
                });

                console.log("Tx done");
            }
        } catch (e) {
            if (toastIdRef.current) {
                toast.update(toastIdRef.current, {
                    title: "Something went wrong, check console.",
                    status: "error",
                    duration: 10000,
                    isClosable: true,
                });
            }
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex items-center bg-gradient-to-tr from-[#262B7C] to-[#262B7C] justify-center h-screen w-full">
            <CustomCard>
                <ConnectWallet />
                {signer && networkOk && (
                    <FormControl
                        onSubmit={() => {
                            console.log("he");
                            makeAGuess();
                        }}
                        isInvalid={error.length ? true : false}
                    >
                        <FormLabel>Enter the secret number</FormLabel>
                        <Input
                            onChange={handleChange}
                            value={inputValue}
                            isInvalid={error.length ? true : false}
                            placeholder="Secret Number"
                        />
                        {error && error.length && (
                            <FormErrorMessage>
                                Please enter a number
                            </FormErrorMessage>
                        )}
                        <Button
                            isDisabled={inputValue.length ? false : true}
                            isLoading={isLoading}
                            marginTop={"10px"}
                            width={"100%"}
                            type="submit"
                            onClick={makeAGuess}
                        >
                            Make a Guess
                        </Button>
                    </FormControl>
                )}
            </CustomCard>
        </main>
    );
}
