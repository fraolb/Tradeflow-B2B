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
    <div className="bg-[#F8F9FA] min-h-screen">
      <Card className="w-full p-6 bg-white rounded-2xl shadow-md mb-6 border-none">
        <div className="text-center">
          <div className="text-[#6C757D] text-sm">USD</div>
          <div className="text-[#6C757D] text-xs mb-2">
            1 USD ~ 0.98 Eur ~ 0.95 GBP
          </div>
          <div className="text-[#212529] text-4xl font-bold">
            $ {Number(cUSDAmount).toFixed(2)}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <Button
          onClick={() => router.push("/send")}
          className="bg-[#4361EE] hover:bg-[#3A56D4] text-white h-14 flex flex-col items-center justify-center gap-1"
        >
          <ArrowUpIcon className="w-5 h-5" />
          <span>Send</span>
        </Button>
        <Button
          onClick={() => router.push("/swap")}
          className="bg-[#7209B7] hover:bg-[#5F078F] text-white h-14 flex flex-col items-center justify-center gap-1"
        >
          <ArrowsUpDownIcon className="w-5 h-5" />
          <span>Swap</span>
        </Button>
        <Button
          onClick={() => router.push("/receive")}
          className="bg-[#4CC9F0] hover:bg-[#3AB4D7] text-white h-14 flex flex-col items-center justify-center gap-1"
        >
          <ArrowDownIcon className="w-5 h-5" />
          <span>Receive</span>
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[#212529] font-bold">Latest Transactions</h3>
          <button className="text-[#4361EE] text-sm">See all</button>
        </div>

        {loading ? (
          <Card className="p-4 bg-white rounded-xl mb-2">
            <div className="text-[#6C757D]">Loading transactions...</div>
          </Card>
        ) : (
          txs
            .slice()
            .reverse()
            .slice(0, 2)
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
            ))
        )}
      </div>

      <div>
        <h3 className="text-[#212529] font-bold mb-3">Currency</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4 bg-white rounded-xl text-center gap-2">
            <div className="text-[#38B000] mx-auto">
              <CurrencyDollarIcon className="w-8 h-8" />
            </div>
            <div className="text-[#212529] font-medium mt-1">cUSD</div>
            <div className="text-[#38B000] font-bold">
              {Number(cUSDAmount).toFixed(2)} $
            </div>
          </Card>

          <Card className="p-4 bg-white rounded-xl text-center gap-2">
            <div className="text-[#4361EE] mx-auto">
              <CurrencyEuroIcon className="w-8 h-8" />
            </div>
            <div className="text-[#212529] font-medium mt-1">cEUR</div>
            <div className="text-[#38B000] font-bold">
              {Number(cEURAmount).toFixed(2)} €
            </div>
          </Card>

          <Card className="p-4 bg-white rounded-xl text-center gap-2">
            <div className="bg-[#FF006E] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto my-1">
              R
            </div>
            <div className="text-[#212529] font-medium mt-1">cReal</div>
            <div className="text-[#38B000] font-bold">
              {Number(cRealAmount).toFixed(2)} R
            </div>
          </Card>

          <Card className="p-4 bg-white rounded-xl text-center gap-2">
            <div className="bg-[#7209B7] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto my-1">
              C
            </div>
            <div className="text-[#212529] font-medium mt-1">CELO</div>
            <div className="text-[#38B000] font-bold">
              {Number(getCeloAmount).toFixed(2)} C
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
