"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { TransactionReceipt } from "@/components/TransactionReceiptPDFForm";
import dynamic from "next/dynamic";
import { useUser } from "@/context/UserContext";

import { writeContract, waitForTransactionReceipt } from "@wagmi/core";
import TradeflowB2B from "@/ABI/TradeflowB2B.json";
import cUSDABI from "@/ABI/cUSD.json";
import { config } from "@/app/Provider"; // wagmi config

import { Html5Qrcode } from "html5-qrcode";
import { CameraIcon } from "@heroicons/react/24/solid";

const page = () => {
  const cUSD = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
  const router = useRouter();
  const { name } = useUser();
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [scannerInitialized, setScannerInitialized] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const mockTransaction = {
    date: "2025-04-05",
    from: "Abc Trading",
    address: "0xAb...1234",
    to: "0xAb...1234",
    reason: "Payment for groceries",
    amount: 20,
    link: "https://celo-alfajores.blockscout.com/tx/0xe5a4655334d0d3995db89540a931ecea584494e137103ec5cb4f76932ffdd572",
    hash: "0xabc123def456789...",
  };
  const [sentTx, setSentTx] = useState<typeof mockTransaction | null>(null);

  const shortenAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const send = async () => {
    setLoading(true);
    try {
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * 1e18)); // cUSD has 18 decimals

      console.log("the amount in wei is ", amountInWei);

      // Step 1: Approve Tradeflow contract
      const approveHash = await writeContract(config, {
        address: cUSD as `0x${string}`,
        abi: cUSDABI,
        functionName: "approve",
        args: ["0x92c7d8B28b2c487c7f455733470B27ABE2FefF13", amountInWei],
      });

      await waitForTransactionReceipt(config, { hash: approveHash });

      // Step 2: Execute payment on Tradeflow
      const hash = await writeContract(config, {
        address: "0x92c7d8B28b2c487c7f455733470B27ABE2FefF13" as `0x${string}`,
        abi: TradeflowB2B,
        functionName: "pay",
        args: [cUSD, address, amountInWei, reason],
      });

      await waitForTransactionReceipt(config, { hash });

      // Step 3: Construct sentTx manually
      setSentTx({
        date: new Date().toISOString(), // or use Date.now() if you want a timestamp
        from: address, // this is the sender's address (your connected wallet)
        to: address, // this is the receiver's address
        reason,
        amount: parseFloat(amount),
        address,
        link: `https://celo-alfajores.blockscout.com/tx/${hash}`,
        hash,
      });

      setSent(true);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Something went wrong. Check the console for more info.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clean up scanner when component unmounts or scanner is closed
    return () => {
      if (html5QrCodeRef.current && scannerInitialized) {
        html5QrCodeRef.current.stop().catch((error) => {
          console.log("Error stopping scanner: ", error);
        });
        html5QrCodeRef.current.clear();
      }
    };
  }, [scannerInitialized]);

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
            rememberLastUsedCamera: true,
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
      // Update address state
      setAddress(decodedText);

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
      <div className="bg-white rounded-[20px] px-4 py-6">
        {sentTx && (
          <div className="max-w-md mx-auto p-6 border rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center">Tradeflow B2B</h1>
            <p className="text-center text-gray-600 mb-4">
              Transaction Receipt
            </p>

            <div className="bg-green-100 text-right text-lg font-semibold p-4 rounded mb-4">
              Amount Paid:{" "}
              <span className="text-black">${sentTx.amount.toFixed(2)}</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <strong>From:</strong>{" "}
                <div>{name || shortenAddress(sentTx.from)}</div>
              </div>
              <div className="flex justify-between">
                <strong>To:</strong> <div>{shortenAddress(sentTx.to)}</div>
              </div>
              <div className="flex justify-between">
                <strong>Date:</strong> <div>{sentTx.date.slice(0, 10)}</div>
              </div>
              <div className="flex justify-between">
                <strong>Reason:</strong> <div>{sentTx.reason}</div>
              </div>
            </div>

            <hr className="my-4" />

            <div className="text-sm flex justify-between">
              <strong>Transaction Hash:</strong>

              <a
                href={sentTx.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline"
              >
                {shortenAddress(sentTx.hash)}
              </a>
            </div>
          </div>
        )}

        <div className="flex justify-between gap-2 mt-4">
          {sentTx !== null && (
            <PDFDownloadLink
              document={<TransactionReceipt transaction={sentTx} />}
              fileName="transaction_report.pdf"
            >
              {({ loading }) =>
                loading ? (
                  <button className="bg-gray-300 p-2 rounded">
                    Preparing...
                  </button>
                ) : (
                  <button className="bg-green-500 text-white p-2 rounded hover:bg-opacity-80">
                    Download Report PDF
                  </button>
                )
              }
            </PDFDownloadLink>
          )}

          <button
            className="bg-blue-500 text-white p-2 rounded hover:bg-opacity-80"
            onClick={() => {
              setSent(false);
              setAddress("");
              setAmount("");
              setReason("");
            }}
          >
            Make Another Transaction
          </button>
        </div>
        <div className="flex justify-center">
          <button
            className="mt-4 p-2 px-4 text-black bg-gray-200 shadow-lg rounded"
            onClick={() => {
              router.push("/");
            }}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-6 px-4 py-4"
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
    >
      {/* Address Input */}
      <div className="bg-white rounded-[20px] px-4 py-6">
        <label htmlFor="address" className="text-sm text-black font-mono">
          Address
        </label>
        <div className="flex gap-2">
          <input
            id="address"
            type="text"
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x0000"
            className="w-full text-xl outline-none font-semibold bg-transparent"
          />
          <button
            type="button"
            onClick={() => {
              if (showScanner) {
                setScanError(null);
              }
              setShowScanner((prev) => !prev);
            }}
            className="shadow-md rounded-md text-black text-2xl bg-gray-300"
          >
            {showScanner ? "Cancel" : <CameraIcon className="w-10 h-10" />}
          </button>
        </div>
      </div>
      {scanError && <p className="text-red-500 text-sm mt-2">{scanError}</p>}
      {showScanner && (
        <div className="mt-4">
          <div
            id="reader"
            className="rounded shadow-md mx-auto border-2 border-gray-200"
            style={{ width: "100%", maxWidth: "500px", minHeight: "300px" }}
          />
          <p className="text-center text-sm text-gray-500 mt-2">
            {isScanning
              ? "Point your camera at a QR code"
              : "Initializing scanner..."}
          </p>
        </div>
      )}
      {/* Amount Input */}
      <div className="bg-white rounded-[20px] px-4 py-6">
        <label htmlFor="amount" className="text-sm text-black font-mono">
          Amount
        </label>
        <div className="flex justify-end text-2xl ">
          <input
            id="amount"
            type="number"
            value={amount}
            required
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="text-right w-full outline-none font-semibold bg-transparent"
          />
          <span className="ml-2 font-semibold">$</span>
        </div>
      </div>

      {/* Reason Input */}
      <div className="bg-white rounded-[18px] px-4 py-3">
        <label htmlFor="reason" className="text-sm text-black font-mono">
          Reason
        </label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="write some reason here"
          className="mt-1 w-full resize-none outline-none bg-transparent font-medium"
        />
      </div>

      {/* Pay Button */}
      <button
        type="submit"
        disabled={loading}
        className="bg-green-700 text-white rounded-[14px] py-3 font-semibold hover:bg-green-800 hover:text-white transition"
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
            Paying...
          </div>
        ) : (
          "Pay"
        )}
      </button>
    </form>
  );
};

export default page;
