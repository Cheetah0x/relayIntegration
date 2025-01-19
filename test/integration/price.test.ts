import { getPrice } from "../..";
import { getQuote, AppFee, getTransactionStatus } from "../../index";

describe("Quote Integration Tests", () => {
  let transactionStatusTest1: string;
  let transactionStatusTest2: string;
  it("should fetch real quote data for Arbitrum to Solana USDC transfer", async () => {
    const appFees: AppFee[] = [
      {
        fee: "100", // 1% fee in basis points
        recipient: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
      },
    ];

    // Act
    const result = await getPrice(
      42161, // Arbitrum One
      792703809, // Solana
      "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // USDC on Arbitrum
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC on Solana
      "1000000000", // 1000 USDC (6 decimals)
      "GfkTE5CKW5Xm3o7NWsFNNzgGqJQ8Nd64eFW8MAnotfUQ", // Solana recipient
      "0x2A3Ce312571612d2ca3A05F4AB5f6AbEde266271", // User's Ethereum address
      appFees,
      "EXACT_INPUT"
    );

    // Log detailed information about the quote
    console.log("\nArbitrum to Solana USDC Transfer Quote:");
    console.log("\nTransaction Details:");
    console.log("price result   ", result);
  }, 30000);
});
