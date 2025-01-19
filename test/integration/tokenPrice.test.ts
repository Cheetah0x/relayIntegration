import { getTokenInfo } from "../../index";

describe("Token Price Integration Tests", () => {
  it("should fetch token info for USDC on Arbitrum", async () => {
    // Arrange
    const tokenAddress = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"; // USDC on Arbitrum
    const chainId = 42161; // Arbitrum One

    // Act
    const result = await getTokenInfo(tokenAddress, chainId);

    // Log the result
    console.log("\nUSDC Token Info on Arbitrum:");
    console.log(result);

    expect(result.price).toBeGreaterThan(0.9);
    expect(result.price).toBeLessThan(1.1);
  }, 30000); // 30 second timeout

  it("should fetch token info for USDC on Solana", async () => {
    // Arrange
    const tokenAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC on Solana
    const chainId = 792703809; // Solana

    // Act
    const result = await getTokenInfo(tokenAddress, chainId);

    // Log the result
    console.log("\nUSDC Token Info on Solana:");
    console.log(result);

    expect(result.price).toBeGreaterThan(0.9);
    expect(result.price).toBeLessThan(1.1);
  });

  it("should fetch eth price on ethereum", async () => {
    // Arrange
    const tokenAddress = "0x0000000000000000000000000000000000000000"; // ETH on Ethereum
    const chainId = 1; // Ethereum

    // Act
    const result = await getTokenInfo(tokenAddress, chainId);

    // Log the result
    console.log("\nETH Token Info on Ethereum:");
    console.log(result);
  });
});
