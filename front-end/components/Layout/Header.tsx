"use client";

import { useEffect, useState } from "react";
import { useConnect, useAccount } from "wagmi";
import { injected } from "wagmi/connectors";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Bell, ChartSpline } from "lucide-react";

const Header = () => {
  const { connect } = useConnect();
  const [hideConnectBtn, setHideConnectBtn] = useState(false);

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      setHideConnectBtn(true);
      connect({ connector: injected({ target: "metaMask" }) });
    }
  }, []);

  return (
    <div className="flex justify-between items-center px-4 mt-4 mb-6">
      <div className="font-bold font-mono">Hello, Fraol</div>
      {!hideConnectBtn && (
        <ConnectButton
          showBalance={{
            smallScreen: true,
            largeScreen: false,
          }}
        />
      )}
      <div className="flex gap-4">
        <Bell />
        <ChartSpline />
      </div>
    </div>
  );
};

export default Header;
