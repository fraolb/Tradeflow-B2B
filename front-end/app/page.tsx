"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useConnect, useAccount } from "wagmi";
import { injected } from "wagmi/connectors";

import {
  ArrowUpIcon,
  ArrowUpCircleIcon,
  ArrowsUpDownIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/solid";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const { connect } = useConnect();

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      connect({ connector: injected({ target: "metaMask" }) });
    }
  }, []);

  return (
    <div>
      <div className="w-full flex flex-col space-y-4">
        {" "}
        <Card className="w-full p-4 bg-gray-50 rounded-4xl">
          <Card
            style={{ backgroundColor: "rgb(253,255,127)" }}
            className="p-6 space-y-0 gap-0 text-center font-bold shadow-md rounded-2xl border-none"
          >
            <div>USD</div>
            <div className="text-sm">1 USD ~ 0.98 Eur ~ 0.95 GBP</div>
            <div className="text-4xl pt-4">$ 50</div>
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
            <Button className="block h-12 items-center px-4 py-2 bg-transparent text-gray-600 shadow-none rounded-none hover:bg-gray-100 active:bg-gray-200">
              <div className="flex justify-center">
                <ArrowDownIcon className="w-5 h-5" />
              </div>
              <span>Receive</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
