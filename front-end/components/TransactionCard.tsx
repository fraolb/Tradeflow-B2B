"use client";

import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import {
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
} from "@heroicons/react/24/solid";
import { TxData } from "@/types/transaction";
import { usePublicClient } from "wagmi";

const TransactionCard = ({
  Tx,
  smartContract,
  chainId,
}: {
  Tx: TxData;
  smartContract: string;
  chainId: number;
}) => {
  const publicClient = usePublicClient();
  const [txHash, setTxHash] = useState("");

  const findTx = async () => {
    const block = await publicClient?.getBlock({
      blockNumber: BigInt(Tx.blockNumber),
      includeTransactions: true,
    });

    console.log("the block is ", block);

    const match = block?.transactions.find(
      (tx) => tx.to?.toLowerCase() === smartContract.toLowerCase()
    );

    if (match?.hash) {
      setTxHash(match.hash);
    } else {
      setTxHash("");
    }

    console.log("match ", match);
  };

  useEffect(() => {
    findTx();
  }, []);

  return (
    <Card className="w-full bg-white p-4 py-2 rounded-xl mb-3 hover:bg-[#F8F9FA] transition-colors">
      <div className="flex items-center justify-between gap-3">
        <div
          className={`p-3 rounded-full ${
            Tx.txType == 0
              ? "bg-[#FF006E]/10 text-[#FF006E]"
              : "bg-[#38B000]/10 text-[#38B000]"
          }`}
        >
          {Tx.txType == 0 ? (
            <ArrowUpCircleIcon className="w-6 h-6" />
          ) : (
            <ArrowDownCircleIcon className="w-6 h-6" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[#212529] font-medium truncate">
            {Tx.reason || Tx.counterparty || "Unknown Transaction"}
          </div>
          <a
            href={
              chainId == 42220
                ? `https://celoscan.io/tx/${txHash}`
                : `https://celo-alfajores.blockscout.com/tx/${txHash}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4361EE] text-sm hover:underline"
          >
            {`${txHash.slice(0, 6)}...${txHash.slice(-4)}`}
          </a>
        </div>

        <div
          className={`text-right font-semibold ${
            Tx.txType == 0 ? "text-[#FF006E]" : "text-[#38B000]"
          }`}
        >
          {Tx.txType == 0 ? "-" : "+"}{" "}
          {(Number(Tx.amount) / 1e18).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          <span className="text-[#6C757D]">
            {" "}
            {Tx.stablecoin == "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1" ||
            "0x765DE816845861e75A25fCA122bb6898B8B1282a"
              ? "$"
              : Tx.stablecoin == "0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F" ||
                "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73"
              ? "€"
              : "R$"}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default TransactionCard;
