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
    <div>
      <Card className="w-full bg-gray-50 flex flex-row justify-beteween px-2 py-2 mb-2 gap-2">
        {Tx.txType == 0 ? (
          <div className="text-red-700 pt-1">
            <ArrowUpCircleIcon className="w-10 h-10" />
          </div>
        ) : (
          <div className="text-green-700 pt-1">
            <ArrowDownCircleIcon className="w-10 h-10" />
          </div>
        )}

        <div className="block w-4/6 md:w-4/5">
          <div className="truncate">
            {Tx.reason !== "" ? Tx.reason : Tx.counterparty}
          </div>
          <a
            href={
              chainId == 42220
                ? `https://celoscan.io/tx/${txHash}`
                : `https://celo-alfajores.blockscout.com/tx/${txHash}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline text-sm"
          >{`${txHash.slice(0, 6)}...${txHash.slice(-4)}`}</a>
        </div>

        {Tx.txType == 0 ? (
          <span className="w-1/5 text-red-700 pt-2 text-center">
            -{" "}
            {(Number(Tx.amount) / 1e18).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            $
          </span>
        ) : (
          <span className="w-1/5 text-green-700 pt-2 text-center">
            +{" "}
            {(Number(Tx.amount) / 1e18).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            $
          </span>
        )}
      </Card>
    </div>
  );
};

export default TransactionCard;
