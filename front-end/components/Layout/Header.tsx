"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Bell, ChartSpline } from "lucide-react";
import { useUser } from "@/context/UserContext";

const Header = () => {
  const { connect } = useConnect();
  const router = useRouter();
  const { name } = useUser();
  const [hideConnectBtn, setHideConnectBtn] = useState(false);

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      setHideConnectBtn(true);
      connect({ connector: injected({ target: "metaMask" }) });
    }
  }, []);

  return (
    <div className="flex justify-between bg-[#4361EE] text-white p-4 rounded-b-2xl mb-4">
      <div className="block md:flex md:w-2/3 md:justify-between ">
        <h1 className="text-xl font-bold">Hello, {name}</h1>
        {!hideConnectBtn && (
          <ConnectButton
            showBalance={{
              smallScreen: true,
              largeScreen: false,
            }}
          />
        )}
      </div>
      <div className="flex gap-4">
        <Bell />
        <ChartSpline onClick={() => router.push("/report")} />
      </div>
    </div>
  );
};

export default Header;
