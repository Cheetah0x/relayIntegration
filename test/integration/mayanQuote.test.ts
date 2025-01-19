import { getMayanQuote } from "../../mayan";

describe("Mayan Quote Integration Tests", () => {
  it("should fetch Mayan quote for USDC.e Arbitrum to Solana transfer", async () => {
    const result = await getMayanQuote(
      "arbitrum",
      "solana",
      "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "10",
      "GfkTE5CKW5Xm3o7NWsFNNzgGqJQ8Nd64eFW8MAnotfUQ"
    );

    console.log("\nMayan Quote Response:");
    console.log(JSON.stringify(result, null, 2));

    expect(result).toBeDefined();
  }, 30000);
});
