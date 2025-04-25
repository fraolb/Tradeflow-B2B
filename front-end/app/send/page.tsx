"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { pdf } from "@react-pdf/renderer";
import { TransactionReceipt } from "@/components/TransactionReceiptPDFForm";
import { useUser } from "@/context/UserContext";

import { useAccount } from "wagmi";
import { Html5Qrcode } from "html5-qrcode";
import { CameraIcon } from "@heroicons/react/24/solid";
import { payUser } from "@/lib/ContractFunctions";
import { blobToFile } from "@/lib/blobToFile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getTokenAmount } from "@/lib/ContractFunctions";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

interface notificationInterfact {
  message: string;
  type: string;
}
interface TransactionInterface {
  date: string;
  from: string | null;
  address: `0x${string}` | undefined;
  to: string;
  reason: string | null;
  amount: number;
  link: string;
  hash: string;
}

export default function Send() {
  const router = useRouter();
  const { address, chainId } = useAccount();
  const { name, contracts, refetch } = useUser();

  const [scanError, setScanError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [sentTx, setSentTx] = useState<TransactionInterface | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [selectedToken, setSelectedToken] = useState<"cUSD" | "cEUR" | "cReal">(
    "cUSD"
  );
  const [tokenBalance, setTokenBalance] = useState("");
  const tokens: ("cUSD" | "cEUR" | "cReal")[] = ["cUSD", "cEUR", "cReal"];
  const [notification, setNotification] =
    useState<notificationInterfact | null>();

  const shortenAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const send = async () => {
    setLoading(true);
    console.log("selectedToken is ", selectedToken, contracts?.[selectedToken]);
    if (Number(tokenBalance) < Number(amount)) {
      setNotification({
        message: "Insufficient funds!",
        type: "error",
      });
      setLoading(false);
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    try {
      const Pay = await payUser(
        contracts?.TradeflowContract ??
          "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
        contracts?.[selectedToken] ??
          "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
        receiverAddress,
        amount,
        reason
      );

      // Construct sentTx manually
      setSentTx({
        date: new Date().toISOString(),
        from: name,
        address: address,
        to: receiverAddress,
        reason,
        amount: parseFloat(amount),

        link:
          chainId == 42220
            ? `https://celoscan.io/tx/${Pay}`
            : `https://celo-alfajores.blockscout.com/tx/${Pay}`,
        hash: Pay,
      });
      await refetch();

      setSent(true);
    } catch (error) {
      console.error("Transaction failed:", error);
      setNotification({
        message: "Transaction failed!",
        type: "error",
      });
      setLoading(false);
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handlePDF = async () => {
    if (sentTx == null) return;
    setLoadingReport(true);
    const pdfInstance = pdf(<TransactionReceipt transaction={sentTx} />);

    const blob = await pdfInstance.toBlob();
    const file = await blobToFile(blob, "transaction_receipt.pdf");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (result.contentUrl) {
      // Create the download URL by adding Cloudinary's force download flag
      const downloadUrl = result.contentUrl.replace(
        "/upload/",
        "/upload/fl_attachment/"
      );

      // Trigger the download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "transaction_receipt.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setLoadingReport(false);
    } else {
      setLoadingReport(false);
      alert("Upload failed");
    }
  };

  // Fetch balances when address changes
  useEffect(() => {
    const fetchBalances = async () => {
      if (!address) return;

      try {
        const amount = await getTokenAmount(
          address,
          contracts?.[selectedToken] ??
            "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"
        );
        setTokenBalance(amount);
      } catch (err) {
        console.error("Error fetching balances:", err);
      }
    };

    fetchBalances();
  }, [address, selectedToken]);

  useEffect(() => {
    let scannerInstance: Html5Qrcode | null = null;

    const startScanner = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (cameras.length === 0) {
          throw new Error("No cameras found");
        }

        // Create new scanner instance
        scannerInstance = new Html5Qrcode("reader");

        // Use back camera or default to last camera
        const cameraId =
          cameras.find((cam) => cam.label.includes("back"))?.id ||
          cameras[cameras.length - 1].id;

        await scannerInstance.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // Success callback
            handleScanSuccess(decodedText, scannerInstance!);
          },
          (errorMessage) => {
            // Error callback
            console.warn("QR Code scan error:", errorMessage);
          }
        );

        setIsScanning(true);
      } catch (error) {
        console.error("Scanner error:", error);
        setScanError(
          error instanceof Error ? error.message : "Camera access denied"
        );
        setShowScanner(false);
      }
    };

    const handleScanSuccess = (decodedText: string, scanner: Html5Qrcode) => {
      // Update receiver address state
      setReceiverAddress(decodedText);

      // Stop scanner
      scanner
        .stop()
        .then(() => {
          scanner.clear();
          setShowScanner(false);
          setIsScanning(false);
        })
        .catch((err) => {
          console.error("Error stopping scanner:", err);
        });
    };

    if (showScanner && !isScanning) {
      startScanner();
    }

    return () => {
      // Cleanup function
      if (scannerInstance && isScanning) {
        scannerInstance
          .stop()
          .then(() => {
            scannerInstance?.clear();
            setIsScanning(false);
          })
          .catch((err) => {
            console.error("Error during cleanup:", err);
          });
      }
    };
  }, [showScanner, isScanning]);

  if (sent) {
    return (
      <Card className="bg-white rounded-xl p-6 max-w-md mx-auto">
        {sentTx && (
          <div className="space-y-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#212529]">
                Tradeflow B2B
              </h1>
              <p className="text-[#6C757D] mt-1">Transaction Receipt</p>
            </div>

            <div className="bg-[#38B000]/10 p-4 rounded-lg text-right">
              <span className="text-[#6C757D] font-medium">Amount Paid: </span>
              <span className="text-[#212529] text-xl font-bold">
                ${sentTx.amount.toFixed(2)}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6C757D] font-medium">From:</span>
                <span className="text-[#212529] font-medium">
                  {name || (sentTx.from != null && shortenAddress(sentTx.from))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6C757D] font-medium">To:</span>
                <span className="text-[#212529] font-medium">
                  {shortenAddress(sentTx.to)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6C757D] font-medium">Date:</span>
                <span className="text-[#212529] font-medium">
                  {sentTx.date.slice(0, 10)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6C757D] font-medium">Reason:</span>
                <span className="text-[#212529] font-medium">
                  {sentTx.reason || "-"}
                </span>
              </div>
            </div>

            <div className="border-t border-[#E9ECEF] my-4"></div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-[#6C757D] font-medium">
                Transaction Hash:
              </span>
              <a
                href={sentTx.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4361EE] hover:underline font-medium"
              >
                {shortenAddress(sentTx.hash)}
              </a>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {sentTx !== null && (
              <Button
                onClick={() => handlePDF()}
                className={`bg-[#4361EE] hover:bg-[#3A56D4] text-white ${
                  loadingReport ? "opacity-80" : ""
                }`}
                disabled={loadingReport}
              >
                {loadingReport ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Downloading
                  </div>
                ) : (
                  "Download Receipt"
                )}
              </Button>
            )}

            <Button
              onClick={() => {
                setSent(false);
                setReceiverAddress("");
                setAmount("");
                setReason("");
              }}
              className="bg-[#7209B7] hover:bg-[#5F078F] text-white"
            >
              New Transaction
            </Button>
          </div>

          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="w-full border-[#E9ECEF] hover:bg-[#F8F9FA] text-[#212529]"
          >
            Return to Home
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <form
      className="flex flex-col gap-2 px-2 py-2"
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
    >
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-100 max-w-md w-full">
          <Alert
            className={`mt-12 p-4 w-full flex justify-center items-center text-center gap-2 rounded-xl shadow-lg ${
              notification.type === "success" ? "bg-[#38B000]" : "bg-[#FF006E]"
            } text-white`}
          >
            <InformationCircleIcon className="h-5 w-5 text-white" />
            <AlertTitle className="text-white font-medium">
              {notification.message}
            </AlertTitle>
          </Alert>
        </div>
      )}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {tokens.map((token) => (
          <button
            key={token}
            type="button"
            onClick={() => setSelectedToken(token)}
            className={`px-4 py-2 rounded-full border-2 transition-all whitespace-nowrap ${
              selectedToken === token
                ? "bg-[#4361EE] text-white border-[#4361EE]"
                : "bg-white text-[#212529] border-[#E9ECEF] hover:border-[#4361EE]"
            }`}
          >
            {token}
          </button>
        ))}
      </div>

      <Card className="rounded-xl p-5 bg-white gap-2">
        <label
          htmlFor="receiverAddress"
          className="text-sm text-[#6C757D] font-medium"
        >
          Address
        </label>
        <div className="flex gap-2">
          <input
            id="receiverAddress"
            type="text"
            value={receiverAddress}
            required
            onChange={(e) => setReceiverAddress(e.target.value)}
            placeholder="0x0000"
            className="w-full text-lg outline-none font-semibold bg-transparent text-[#212529]"
          />
          <button
            type="button"
            onClick={() => {
              if (showScanner) {
                setScanError(null);
              }
              setShowScanner((prev) => !prev);
            }}
            className="p-2 rounded-lg bg-[#F8F9FA] hover:bg-[#E9ECEF] transition-colors"
          >
            {showScanner ? (
              <span className="text-[#FF006E]">Cancel</span>
            ) : (
              <CameraIcon className="w-6 h-6 text-[#4361EE]" />
            )}
          </button>
        </div>
      </Card>

      {scanError && (
        <div className="text-[#FF006E] text-sm px-2">{scanError}</div>
      )}

      {showScanner && (
        <Card className="mt-2 p-4">
          <div
            id="reader"
            className="rounded-lg mx-auto border-2 border-[#E9ECEF]"
            style={{ width: "100%", maxWidth: "500px", minHeight: "300px" }}
          />
          <p className="text-center text-sm text-[#6C757D] mt-3">
            {isScanning
              ? "Point your camera at a QR code"
              : "Initializing scanner..."}
          </p>
        </Card>
      )}

      <Card className="rounded-xl p-5 bg-white gap-2">
        <label htmlFor="amount" className="text-sm text-[#6C757D] font-medium">
          Amount
        </label>
        <div className="flex items-center">
          <input
            id="amount"
            type="number"
            value={amount}
            required
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full text-right text-2xl outline-none font-bold bg-transparent text-[#212529]"
          />
          <span className="ml-2 text-xl font-bold text-[#4361EE]">
            {selectedToken === "cUSD"
              ? "$"
              : selectedToken === "cEUR"
              ? "€"
              : selectedToken === "cReal"
              ? "R$"
              : "C"}
          </span>
        </div>
        <div className="text-sm text-[#6C757D] mt-1 flex justify-end gap-2">
          <span className="text-sm text-[#6C757D] font-medium">
            Balance: {tokenBalance} {selectedToken}
          </span>
          <span className="text-sm text-[#6C757D] font-medium">
            {Number(tokenBalance) < Number(amount) && (
              <span className="text-[#FF006E]">Insufficient funds</span>
            )}
          </span>
        </div>
      </Card>

      <Card className="rounded-xl p-5 bg-white gap-2">
        <label htmlFor="reason" className="text-sm text-[#6C757D] font-medium">
          Reason (Optional)
        </label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Write a note here..."
          className="mt-2 w-full h-10 resize-none outline-none bg-transparent font-medium text-[#212529]"
        />
      </Card>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 rounded-xl font-bold text-lg ${
          loading
            ? "bg-[#4361EE] opacity-70"
            : "bg-[#4361EE] hover:bg-[#3A56D4]"
        } text-white transition-colors shadow-md`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </div>
        ) : (
          `Send ${selectedToken}`
        )}
      </button>
    </form>
  );
}
