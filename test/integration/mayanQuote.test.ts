import { Quote } from "@mayanfinance/swap-sdk";
import { getMayanQuote, sdkMayanGetQuote, sdkMayanSwap } from "../../mayan";

//seems like swift is the way to go.

describe("Mayan Quote Integration Tests", () => {
  it("should fetch Mayan quote for USDC.e Arbitrum to Solana transfer", async () => {
    const result = await getMayanQuote(
      "arbitrum",
      "solana",
      "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", //usdc arb
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", //usdc sol
      "10", //amount to swap
      "FC4eXxkyrMPTjiYUpp4EAnkmwMbQyZ6NDCh1kfLn6vsf", //Mayan WH sol address
      "0x0654874eb7F59C6f5b39931FC45dC45337c967c3" // forwarder address you need to approve.
    );

    console.log("\nMayan Quote Response:");
    console.log(JSON.stringify(result, null, 2));

    expect(result).toBeDefined();
  }, 30000);

  //minumum amount of $5 interesting

  it("fetch quote using the sdk , swift", async () => {
    const result = await sdkMayanGetQuote(
      "arbitrum",
      "solana",
      "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", //usdc arb
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", //usdc sol
      100, //amount to swap
      {
        swift: true,
      }
    );

    console.log("\nMayan SDK Quote Response:");
    console.log(JSON.stringify(result, null, 2));

    expect(result).toBeDefined();
  }, 30000);

  it("fetch quote using the sdk , mctp", async () => {
    const result = await sdkMayanGetQuote(
      "arbitrum",
      "solana",
      "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", //usdc arb
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", //usdc sol
      100, //amount to swap
      {
        mctp: true,
      }
    );

    console.log("\nMayan SDK Quote Response:");
    console.log(JSON.stringify(result, null, 2));

    expect(result).toBeDefined();
  });

  it("fetch quote using the sdk , gasless", async () => {
    const result = await sdkMayanGetQuote(
      "arbitrum",
      "solana",
      "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", //usdc arb
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", //usdc sol
      100, //amount to swap
      {
        gasless: true,
      }
    );

    console.log("\nMayan SDK Quote Response:");
    console.log(JSON.stringify(result, null, 2));

    expect(result).toBeDefined();
  });

  it("fetch quote using the sdk , onlyDirect", async () => {
    const result = await sdkMayanGetQuote(
      "arbitrum",
      "solana",
      "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", //usdc arb
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", //usdc sol
      100, //amount to swap
      {
        onlyDirect: true,
      }
    );

    console.log("\nMayan SDK Quote Response:");
    console.log(JSON.stringify(result, null, 2));

    expect(result).toBeDefined();
  });

  it("fetch quote using the sdk , all", async () => {
    const result = await sdkMayanGetQuote(
      "arbitrum",
      "solana",
      "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", //usdc arb
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", //usdc sol
      100, //amount to swap
      {
        swift: true,
        mctp: true,
        gasless: true,
        onlyDirect: true,
      }
    );

    console.log("\nMayan SDK Quote Response:");
    console.log(JSON.stringify(result, null, 2));

    expect(result).toBeDefined();
  });

  it("fetch quote using the sdk , none", async () => {
    const result = await sdkMayanGetQuote(
      "arbitrum",
      "solana",
      "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", //usdc arb
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", //usdc sol
      100 //amount to swap
    );

    console.log("\nMayan SDK Quote Response:");
    console.log(JSON.stringify(result, null, 2));

    expect(result).toBeDefined();
  });

  //cant really test the swaps without the signers and the info from the quotes.

  //fetch quote and then swap
  it("fetch quote and then swap", async () => {
    const quote: Quote = await getMayanQuote(
      "arbitrum",
      "solana",
      "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", //usdc arb
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", //usdc sol
      "10", //amount to swap
      "FC4eXxkyrMPTjiYUpp4EAnkmwMbQyZ6NDCh1kfLn6vsf", //Mayan WH sol address
      "0x0654874eb7F59C6f5b39931FC45dC45337c967c3" // forwarder address you need to approve.
    );

    const transaction = await sdkMayanSwap(
      quote,
      "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", //usdc arb
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", //usdc sol
      undefined,
      undefined,
      undefined,
      undefined
    );

    console.log("\nMayan SDK Swap Response:");
    console.log(JSON.stringify(transaction, null, 2));

    expect(transaction).toBeDefined();
  });

  //fetch quote and then swap evm to evm
  it("fetch quote and then swap evm to evm", async () => {
    const quote: Quote = await getMayanQuote(
      "arbitrum",
      "arbitrum",
      "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", //usdc arb
      "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", //usdc arb
      "10", //amount to swap
      "FC4eXxkyrMPTjiYUpp4EAnkmwMbQyZ6NDCh1kfLn6vsf", //Mayan WH sol address
      "0x0654874eb7F59C6f5b39931FC45dC45337c967c3" // forwarder address you need to approve.
    );

    const transaction = await sdkMayanSwap(
      quote,
      "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", //usdc arb
      "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", //usdc arb
      undefined,
      undefined,
      undefined,
      undefined
    );

    console.log("\nMayan SDK Swap Response:");
    console.log(JSON.stringify(transaction, null, 2));

    expect(transaction).toBeDefined();
  });
});
