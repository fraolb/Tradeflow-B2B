"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConnect, useAccount, useBalance } from "wagmi";
import { injected } from "wagmi/connectors";
import { useUser } from "@/context/UserContext";
import { formatEther } from "viem";

import {
  ArrowUpIcon,
  ArrowsUpDownIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  CurrencyEuroIcon,
} from "@heroicons/react/24/solid";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TransactionCard from "@/components/TransactionCard";

export default function Home() {
  const router = useRouter();
  const { address, chainId } = useAccount();
  const { connect } = useConnect();
  const { txs, cUSDAmount, cEURAmount, cRealAmount, loading, contracts } =
    useUser();
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
            <div className="text-4xl pt-4">
              $ {Number(cUSDAmount).toFixed(2)}
            </div>
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
          {txs
            .slice()
            .reverse()
            .map((tx, index) => (
              <TransactionCard
                key={index}
                Tx={tx}
                smartContract={
                  contracts?.TradeflowContract ??
                  "0x92c7d8B28b2c487c7f455733470B27ABE2FefF13"
                }
                chainId={chainId ?? 42220}
              />
            ))}
        </div>
        <div className="w-full">
          <div className="flex justify-left px-2 mb-2">
            <h3 className="font-bold font-mono">Currency</h3>
          </div>
          <div className="grid grid-cols-4 gap-1 md:gap-4">
            <Card className="px-2 py-2 mb-2 gap-0 bg-gray-50">
              <div className="text-green-700 pt-1">
                <CurrencyDollarIcon className="w-10 h-10" />
              </div>

              <div className="block">cUSD</div>
              <span className="text-green-700">
                {Number(cUSDAmount).toFixed(2)} $
              </span>
            </Card>
            <Card className="px-2 py-2 mb-2 gap-0 bg-gray-50">
              <div className="text-blue-700 pt-1">
                <CurrencyEuroIcon className="w-10 h-10" />
              </div>

              <div className="block">cEur</div>
              <span className="text-green-700">
                {Number(cEURAmount).toFixed(2)} €
              </span>
            </Card>
            <Card className="px-2 py-2 mb-2 gap-0 bg-gray-50">
              <div className="bg-green-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg my-2">
                R
              </div>

              <div className="block">cReal</div>
              <span className="text-green-700">
                {Number(cRealAmount).toFixed(2)} R
              </span>
            </Card>
            <Card className="px-2 py-2 mb-2 gap-0 bg-gray-50">
              <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg my-2">
                C
              </div>

              <div className="block">Celo</div>
              <span className="text-green-700">
                {" "}
                {Number(getCeloAmount).toFixed(2)} C
              </span>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
