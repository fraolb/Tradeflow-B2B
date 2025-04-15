"use client";

import { useEffect, useState } from "react";
import { useConnect, useAccount } from "wagmi";
import { injected } from "wagmi/connectors";

export default function Home() {
  const { connect } = useConnect();

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      connect({ connector: injected({ target: "metaMask" }) });
    }
  }, []);

  return (
    <div>
      <div className="w-full flex flex-col space-y-4">Home Page</div>
    </div>
  );
}
