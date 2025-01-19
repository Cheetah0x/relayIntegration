import { getQuote, AppFee } from "../../index";

describe("Quote Integration Tests", () => {
  it("should fetch real quote data for Arbitrum to Solana USDC transfer", async () => {
    const appFees: AppFee[] = [
      {
        fee: "100", // 1% fee in basis points
        recipient: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
      },
    ];

    // Act
    const result = await getQuote(
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
    console.log(result);

    result.steps.forEach(
      (
        step: {
          id: string;
          action: string;
          description: string;
          kind: string;
          items?: any[];
        },
        index: number
      ) => {
        if (step.items && step.items.length > 0) {
        }
      }
    );

    // Verify the response structure matches the API documentation
    expect(result).toHaveProperty("steps");
    expect(result).toHaveProperty("fees");
    expect(result).toHaveProperty("details");

    // Verify steps structure
    expect(result.steps[0]).toMatchObject({
      id: expect.any(String),
      action: expect.any(String),
      description: expect.any(String),
      kind: expect.any(String),
      items: expect.arrayContaining([
        expect.objectContaining({
          status: expect.any(String),
          data: expect.objectContaining({
            from: expect.any(String),
            to: expect.any(String),
          }),
        }),
      ]),
    });

    // Verify fees structure
    expect(result.fees).toMatchObject({
      gas: expect.objectContaining({
        amount: expect.any(String),
        amountFormatted: expect.any(String),
        amountUsd: expect.any(String),
      }),
      relayer: expect.objectContaining({
        amount: expect.any(String),
        amountFormatted: expect.any(String),
        amountUsd: expect.any(String),
      }),
    });

    // Verify details structure
    expect(result.details).toMatchObject({
      operation: expect.any(String),
      timeEstimate: expect.any(Number),
      rate: expect.any(String),
      currencyIn: expect.objectContaining({
        amount: expect.any(String),
        amountFormatted: expect.any(String),
        amountUsd: expect.any(String),
      }),
      currencyOut: expect.objectContaining({
        amount: expect.any(String),
        amountFormatted: expect.any(String),
        amountUsd: expect.any(String),
      }),
    });
  }, 30000);
});
