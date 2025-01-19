import axios from "axios";

const INTEGRATOR = "bindpay";

//this is trying to start the transaction, not the quote

export interface AppFee {
  fee: string;
  recipient: string;
}

//THIS GETS THE QUOTE

export const getQuote = async (
  fromChain: number, // originChainId
  toChain: number, // destinationChainId
  fromToken: string, // originCurrency
  toToken: string, // destinationCurrency
  fromAmount: string, // amount
  toAddress: string, // recipient
  fromAddress: string, // user
  appFees: AppFee[], // array of app fees
  tradeType = "EXACT_INPUT" // default trade type
) => {
  try {
    const response = await axios.post(
      "https://api.relay.link/quote",
      {
        user: fromAddress,
        originChainId: fromChain,
        originCurrency: fromToken,
        destinationChainId: toChain,
        destinationCurrency: toToken,
        tradeType: tradeType,
        recipient: toAddress,
        amount: fromAmount.toString(),
        usePermit: false,
        useExternalLiquidity: false,
        referrer: INTEGRATOR,
        useDepositAddress: true,
        refundTo: fromAddress,
        appFees: appFees,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching quote:", error);
    throw error;
  }
};

//GETS TOKEN PRICES

export const getTokenInfo = async (tokenAddress: string, chainId: number) => {
  try {
    console.log(
      `Fetching token info for: Token Address: ${tokenAddress}, Chain ID: ${chainId}`
    );
    const response = await axios.get(
      "https://api.relay.link/currencies/token/price",
      {
        params: {
          address: tokenAddress,
          chainId: chainId,
        },
      }
    );
    console.log("Relay Token Info Response:", response.data);
    const tokenInfo = response.data;
    if (!tokenInfo.price) {
      throw new Error(
        `Token price not available for ${tokenAddress} on chain ${chainId}`
      );
    }
    return {
      price: tokenInfo.price,
      decimals: 6, // Hardcoded for USDC
      symbol: "USDC", // Hardcoded for USDC
      name: "USD Coin", // Hardcoded for USDC
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Relay API Error Response:", error.response.data);
      throw new Error(
        `Failed to get token info: ${error.response.data.message}`
      );
    } else if (error instanceof Error) {
      throw new Error(`Failed to get token info: ${error.message}`);
    } else {
      throw new Error("Failed to get token info: An unknown error occurred");
    }
  }
};

//GETS THE STATUS OF REQUEST
export const getTransactionStatus = async (requestId: string) => {
  try {
    const response = await axios.get(
      `https://api.relay.link/intents/status/v2`,
      {
        params: {
          requestId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction status:", error);
    throw error;
  }
};
