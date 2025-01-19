import axios from "axios";

export const getMayanQuote = async (
  fromChain: string, // e.g., "avalanche"
  toChain: string, // e.g., "solana"
  fromToken: string, // token address on source chain
  toToken: string, // token address on destination chain
  amountIn: string, // amount to swap
  referrer: string, // referrer address
  slippageBps = "300", // default slippage
  gasless = true // default to gasless
) => {
  try {
    const response = await axios.get(
      "https://price-api.mayan.finance/v3/quote",
      {
        params: {
          solanaProgram: "FC4eXxkyrMPTjiYUpp4EAnkmwMbQyZ6NDCh1kfLn6vsf",
          forwarderAddress: "0x0654874eb7F59C6f5b39931FC45dC45337c967c3",
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
