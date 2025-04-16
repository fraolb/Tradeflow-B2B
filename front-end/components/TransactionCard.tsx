"use client";

import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import {
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
} from "@heroicons/react/24/outline";
import { TxData } from "@/types/transaction";
import { usePublicClient } from "wagmi";

const TransactionCard = ({ Tx }: { Tx: TxData }) => {
  const publicClient = usePublicClient();
  const [txHash, setTxHash] = useState("");
  const SmartContract = "0x92c7d8B28b2c487c7f455733470B27ABE2FefF13";

  const findTx = async () => {
    const block = await publicClient?.getBlock({
      blockNumber: BigInt(Tx.blockNumber),
      includeTransactions: true,
    });

    console.log("the block is ", block);

    const match = block?.transactions.find(
      (tx) => tx.to?.toLowerCase() === SmartContract.toLowerCase()
    );

    match?.hash ? setTxHash(match.hash) : setTxHash("");

    console.log(match?.hash ?? "Not found");
  };

  useEffect(() => {
    findTx();
  }, []);

  return (
    <div>
      <Card className="w-full bg-gray-50 flex flex-row justify-beteween px-2 py-2 mb-2">
        {Tx.txType == 0 ? (
          <div className="text-red-700 pt-1">
            <ArrowUpCircleIcon className="w-10 h-10" />
          </div>
        ) : (
          <div className="text-green-700 pt-1">
            <ArrowDownCircleIcon className="w-10 h-10" />
          </div>
        )}

        <div className="block w-3/5">
          <div>{Tx.reason !== "" ? Tx.reason : Tx.counterparty}</div>
          <div className="text-sm">{txHash}</div>
        </div>

        {Tx.txType == 0 ? (
          <span className="w-1/5 text-red-700 pt-2 text-center">
            - {Tx.amount} $
          </span>
        ) : (
          <span className="w-1/5 text-green-700 pt-2 text-center">
            + {Tx.amount} $
          </span>
        )}
      </Card>
    </div>
  );
};

export default TransactionCard;
