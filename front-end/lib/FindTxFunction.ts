"use client";

import { PublicClient } from "viem";

export const FindTx = async (
  blockNumber: number,
  publicClient: PublicClient,
  smartContract: string
) => {
  if (!publicClient) return null;

  const block = await publicClient.getBlock({
    blockNumber: BigInt(blockNumber),
    includeTransactions: true,
  });

  const SmartContract = "0x92c7d8B28b2c487c7f455733470B27ABE2FefF13";

  const match = block.transactions.find(
    (tx) => tx.to?.toLowerCase() === smartContract.toLowerCase()
  );

  return match?.hash || null;
};
