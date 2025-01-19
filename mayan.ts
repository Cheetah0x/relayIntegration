import axios from "axios";
import {
  fetchQuote,
  swapFromEvm,
  swapFromSolana,
  Quote,
  ChainName,
  SolanaTransactionSigner,
} from "@mayanfinance/swap-sdk";
import { Signer, Overrides } from "ethers";

//the referrer is us. To set it up we need to go here and set a fee with Mayan
//https://explorer.mayan.finance/referrer-fee

//for the solana program, this is a set of addresses that determine whether it will be
//Wormhole Swap
//Mayan Swift
//or Mayan MCTP

//We could have three quotes that go through each of these programs

//might have to do an approval first with Mayan, think this is the same for LIFI??
//the address for Mayan EVM is 0x0654874eb7F59C6f5b39931FC45dC45337c967c3

//WH Swap contract addresses : Solana: FC4eXxkyrMPTjiYUpp4EAnkmwMbQyZ6NDCh1kfLn6vsf
//:    EVM:    0xBF5f3f65102aE745A48BD521d10BaB5BF02A9eF4
// :   Base:   0x11AA521C888d84f374B63823d9b873CAa3591f55

//Mayan Swift contract addresses: Solana: BLZRi6frs4X4DNLw56V4EXai1b6QVESN1BhHBTYM9VcY
//:    EVM:    00xC38e4e6A15593f908255214653d3D947CA1c2338

//Mayan MCTP contract addresses: Solana: Awm2zSgzMGTRraAVjRvshqLehy7mJ2Qr3maURDsoDmwi
//:    EVM:    0xF18f923480dC144326e6C65d4F3D47Aa459bb41C

//its like theyve deliberately made the api shit so you use the SDK.

export interface QuoteOptions {
  swift?: boolean;
  mctp?: boolean;
  gasless?: boolean;
  onlyDirect?: boolean;
}

type Erc20Permit = {
  value: bigint;
  deadline: number;
  v: number;
  r: string;
  s: string;
};

export const getMayanQuote = async (
  fromChain: string, // e.g., "avalanche"
  toChain: string, // e.g., "solana"
  fromToken: string, // token address on source chain
  toToken: string, // token address on destination chain
  amountIn: string, // amount to swap
  solanaProgram: string, // Mayan WH sol address
  forwarderAddress: string // forwarder address you need to approve.
) => {
  try {
    const referrer = "GfkTE5CKW5Xm3o7NWsFNNzgGqJQ8Nd64eFW8MAnotfUQ"; // referrer address
    const slippageBps = "300"; // we can set this ourselves
    const gasless = true; // default to gasless

    const response = await axios.get(
      "https://price-api.mayan.finance/v3/quote",
      {
        params: {
          solanaProgram: solanaProgram, //Mayan WH sol address
          forwarderAddress: forwarderAddress, // forwarder address you need to approve.
          amountIn,
          fromToken,
          fromChain,
          toToken,
          toChain,
          slippageBps,
          referrer,
          gasDrop: "0",
          gasless: gasless.toString(),
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching Mayan quote:", error);
    throw error;
  }
};

//will need to find a way to get the transaction hash, should be able to get this from the
//transaction of the user to the escrow

export const getTransactionStatus = async (transactionHash: string) => {
  const response = await axios.get(
    `https://explorer-api.mayan.finance/v3/swap/trx/${transactionHash}`
  );
  return response.data;
};

//type is either "swift" or "mctp", "WH" or "onlyDirect"

export const sdkMayanGetQuote = async (
  fromChain: string, // e.g., "avalanche" as string
  toChain: string, // e.g., "solana"
  fromToken: string, // token address
  toToken: string, // token address on destination chain
  amount: number, // amount to swap
  quoteOptions?: QuoteOptions
) => {
  let referrer;
  const referrerSol = "GfkTE5CKW5Xm3o7NWsFNNzgGqJQ8Nd64eFW8MAnotfUQ"; // referrer address
  const referrerEvm = "0x0654874eb7F59C6f5b39931FC45dC45337c967c3"; // referrer address

  if (fromChain === "solana") {
    referrer = referrerSol;
  } else {
    referrer = referrerEvm;
  }

  try {
    const quote = await fetchQuote(
      {
        amount,
        fromToken,
        toToken,
        fromChain: fromChain as ChainName,
        toChain: toChain as ChainName,
        slippageBps: 300, // means 3%
        gasDrop: 0.04, // optional
        referrer, // optional
        referrerBps: 5, // optional
      },
      quoteOptions
    );

    if (!quote) {
      throw new Error("No quote returned from Mayan SDK");
    }

    return quote;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching Mayan quote:", error.message);
      throw error;
    } else {
      console.error("Unknown error fetching Mayan quote:", error);
      throw new Error("Failed to fetch Mayan quote");
    }
  }
};

export const sdkMayanSwap = async (
  quote: Quote,
  fromAddress: string, //originWalletAddress
  toAddress: string, //destinationWalletAddress
  solanaConnection?: SolanaTransactionSigner,
  signer?: Signer, //will probl need to be viem signer that is passed through, thats going to be tough
  permit?: Erc20Permit,
  overrides?: Overrides,
  payload?: any
) => {
  //if to solana, use swapFromSolana
  //if to evm use swapFromEvm

  const referrerSol = "GfkTE5CKW5Xm3o7NWsFNNzgGqJQ8Nd64eFW8MAnotfUQ"; // referrer address
  const referrerEvm = "0x0654874eb7F59C6f5b39931FC45dC45337c967c3"; // referrer address

  if (quote.toChain === "solana") {
    if (!solanaConnection) {
      throw new Error("Solana connection is required");
    }
    const transaction = await swapFromSolana(
      quote,
      fromAddress,
      toAddress,
      {
        solana: referrerSol,
        evm: referrerEvm,
      },
      solanaConnection
    );
    return transaction;
  }

  if (
    quote.toChain.toLowerCase() !== "solana" &&
    quote.toChain.toLowerCase() !== "aptos"
  ) {
    if (!signer || !permit || !overrides || !payload) {
      throw new Error("Signer, permit, overrides, and payload are required");
    }
    const transaction = await swapFromEvm(
      quote,
      fromAddress,
      toAddress,
      {
        solana: referrerSol,
        evm: referrerEvm,
      },
      signer,
      permit,
      overrides,
      payload
    );
    return transaction;
  }
};
