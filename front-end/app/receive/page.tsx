"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { QRCodeSVG } from "qrcode.react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
    <div>
      {copied && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-100">
          <Alert className="border border-green-500 bg-green-500 shadow-lg px-4 py-2 flex items-center space-x-2 rounded-lg">
            <InformationCircleIcon className="h-5 w-5 text-gray-100" />
            <AlertTitle className="text-white">Address Copied</AlertTitle>
          </Alert>
        </div>
      )}

      <div className="py-4 flex justify-center">
        {address && <QRCodeSVG value={address} size={256} />}
      </div>

      <div className="flex justify-center items-center space-x-2 bg-white mx-12 md:mx-24 p-2 rounded-lg">
        <span className="text-sm text-center font-mono">
          {address?.slice(0, 6)}...{address?.slice(-6)}
        </span>
        <Button
          onClick={copyToClipboard}
          className="p-2 bg-gray-300 rounded-md hover:bg-gray-400 active:bg-gray-500"
        >
          <ClipboardIcon className="w-5 h-5 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};

export default Page;
