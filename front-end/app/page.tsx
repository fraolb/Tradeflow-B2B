"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useConnect, useAccount, useBalance } from "wagmi";
import { injected } from "wagmi/connectors";
import { useUser } from "@/context/UserContext";
import { formatEther } from "viem";

import {
  ArrowUpIcon,
  ArrowUpCircleIcon,
  ArrowsUpDownIcon,
  ArrowDownIcon,
  ArrowDownCircleIcon,
  CurrencyDollarIcon,
  CurrencyEuroIcon,
} from "@heroicons/react/24/solid";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TransactionCard from "@/components/TransactionCard";

export default function Home() {
  const router = useRouter();
  const { address } = useAccount();
  const { connect } = useConnect();
  const { name, txs, cUSDAmount, cEURAmount, loading, refetch } = useUser();
  const { data: getCelo } = useBalance({ address });
  const getCeloAmount = getCelo ? formatEther(getCelo.value) : "0";

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      connect({ connector: injected({ target: "metaMask" }) });
    }
  }, []);

  return (
    <div>
      <div className="w-full flex flex-col space-y-4">
        <Card className="w-full p-4 bg-gray-50 rounded-4xl">
          <Card
            style={{ backgroundColor: "rgb(253,255,127)" }}
            className="p-6 space-y-0 gap-0 text-center font-bold shadow-md rounded-2xl border-none"
          >
            <div>USD</div>
            <div className="text-sm">1 USD ~ 0.98 Eur ~ 0.95 GBP</div>
            <div className="text-4xl pt-4">$ {cUSDAmount}</div>
          </Card>
          <div className="w-full grid grid-cols-3 divide-x divide-gray-400">
            <Button
              onClick={() => router.push("/send")}
              className="block h-12 items-center px-4 py-2 bg-transparent text-gray-600 shadow-none rounded-none hover:bg-gray-100 active:bg-gray-200"
            >
              <div className="flex justify-center">
                <ArrowUpIcon className="w-5 h-5" />
              </div>
              <span>Send</span>
            </Button>
            <Button className="block h-12 items-center px-4 py-2 bg-transparent text-gray-600 shadow-none rounded-none hover:bg-gray-100 active:bg-gray-200">
              <div className="flex justify-center">
                <ArrowsUpDownIcon className="w-5 h-5" />
              </div>
              <span>Swap</span>
            </Button>
            <Button
              onClick={() => router.push("/receive")}
              className="block h-12 items-center px-4 py-2 bg-transparent text-gray-600 shadow-none rounded-none hover:bg-gray-100 active:bg-gray-200"
            >
              <div className="flex justify-center">
                <ArrowDownIcon className="w-5 h-5" />
              </div>
              <span>Receive</span>
            </Button>
          </div>
        </Card>
        <div className="w-full">
          <div className="flex justify-between px-2 mb-2">
            <h3 className="font-bold font-mono">Latest Transactions</h3>
            <div className="font-light">See all</div>
          </div>
          <div>
            {loading && (
              <Card className="w-full bg-gray-50 flex flex-row justify-beteween px-2 py-2 mb-2">
                Loading
              </Card>
            )}
          </div>
          {txs.map((tx, index) => (
            <TransactionCard key={index} Tx={tx} />
          ))}
          <Card className="w-full bg-gray-50 flex flex-row justify-beteween px-2 py-2 mb-2">
            <div className="text-red-700 pt-1">
              <ArrowUpCircleIcon className="w-10 h-10" />
            </div>

            <div className="block w-3/5">
              <div>To 10 blocks of Ice</div>
              <div className="text-sm">0xabcd32r342...</div>
            </div>
            <span className="w-1/5 text-red-700 pt-2 text-center">- 250 $</span>
          </Card>
          <Card className="w-full bg-gray-50 flex flex-row justify-beteween px-2 py-2 mb-2">
            <div className="text-green-700 pt-1">
              <ArrowDownCircleIcon className="w-10 h-10" />
            </div>

            <div className="block w-3/5">
              <div>Buy Macbook Pc</div>
              <div className="text-sm">0xabcd32r342...</div>
            </div>
            <span className="w-1/5 text-green-700 pt-2 text-center">
              + 750 $
            </span>
          </Card>
        </div>
        <div className="w-full">
          <div className="flex justify-left px-2 mb-2">
            <h3 className="font-bold font-mono">Currency</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Card className="px-2 py-2 mb-2 gap-0 bg-gray-50">
              <div className="text-green-700 pt-1">
                <CurrencyDollarIcon className="w-10 h-10" />
              </div>

              <div className="block">cUSD</div>
              <span className="text-green-700">{cUSDAmount} $</span>
            </Card>
            <Card className="px-2 py-2 mb-2 gap-0 bg-gray-50">
              <div className="text-blue-700 pt-1">
                <CurrencyEuroIcon className="w-10 h-10" />
              </div>

              <div className="block">cEur</div>
              <span className="text-green-700">{cEURAmount} €</span>
            </Card>
            <Card className="px-2 py-2 mb-2 gap-0 bg-gray-50">
              <div className="text-yellow-400 pt-1">
                <CurrencyDollarIcon className="w-10 h-10" />
              </div>

              <div className="block">Celo</div>
              <span className="text-green-700">
                {" "}
                {Number(getCeloAmount).toFixed(2)} CELO
              </span>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
