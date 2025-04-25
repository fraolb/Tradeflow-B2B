"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { QRCodeSVG } from "qrcode.react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  InformationCircleIcon,
  ClipboardIcon,
} from "@heroicons/react/24/solid";

const Page = () => {
  const { address } = useAccount();
  const [copied, setCopied] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const copyToClipboard = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hasMounted) return null;

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      {copied && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full">
          <Alert className="bg-[#38B000] text-white p-4 rounded-xl shadow-lg flex items-center gap-2 text-center">
            <InformationCircleIcon className="h-5 w-5 text-white" />
            <AlertTitle className="text-white font-medium">
              Address Copied to Clipboard
            </AlertTitle>
          </Alert>
        </div>
      )}

      <Card className="p-6 bg-white rounded-xl mb-6">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold text-[#212529] mb-4">
            Receive Payment
          </h2>
          {address && (
            <div className="p-4 bg-white rounded-lg border border-[#E9ECEF]">
              <QRCodeSVG
                value={address}
                size={220}
                level="H"
                includeMargin={true}
              />
            </div>
          )}
        </div>
      </Card>

      <Card className="p-5 bg-white rounded-xl">
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-medium text-[#6C757D] mb-3">
            Your Wallet Address
          </h3>
          <div className="flex items-center justify-between w-full bg-[#F8F9FA] rounded-lg p-3">
            <span className="font-mono text-[#212529]">
              {address?.slice(0, 6)}...{address?.slice(-6)}
            </span>
            <Button
              onClick={copyToClipboard}
              className="p-2 bg-[#4361EE] hover:bg-[#3A56D4] text-white rounded-lg"
              aria-label="Copy address"
            >
              <ClipboardIcon className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-[#6C757D] mt-3 text-center">
            Share this address to receive payments
          </p>
        </div>
      </Card>

      <Card className="p-5 bg-white rounded-xl mt-6">
        <h3 className="text-lg font-bold text-[#212529] mb-3">
          How to Receive Payments
        </h3>
        <ul className="space-y-3 text-sm text-[#6C757D]">
          <li className="flex items-start gap-2">
            <div className="bg-[#4361EE] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">
              1
            </div>
            <span>Share your QR code or wallet address with sender</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="bg-[#4361EE] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">
              2
            </div>
            <span>Sender initiates payment to your address</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="bg-[#4361EE] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">
              3
            </div>
            <span>Transaction will appear in your wallet once confirmed</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default Page;
