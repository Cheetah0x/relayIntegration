import axios from "axios";

const INTEGRATOR = "bindpay";

//this is trying to start the transaction, not the quote

export interface AppFee {
  fee: string;
  recipient: string;
}

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
