"use client";

import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { TransactionReceipt } from "@/components/TransactionReceiptPDFForm";
import dynamic from "next/dynamic";

import { writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { parseAbiItem } from "viem";
import TradeflowB2B from "@/ABI/TradeflowB2B.json";
import cUSDABI from "@/ABI/cUSD.json";
import { config } from "@/app/Provider"; // wagmi config
import { decodeEventLog } from "viem";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

const page = () => {
  const cUSD = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
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

  if (sent) {
    return (
      <div className="bg-white rounded-[20px] px-4 py-6">
        {sentTx && (
          <div className="space-y-2 text-sm">
            <p>
              <strong>From:</strong> {sentTx.from}
            </p>
            <p>
              <strong>To:</strong> {sentTx.to}
            </p>
            <p>
              <strong>Reason:</strong> {sentTx.reason}
            </p>
            <p>
              <strong>Amount:</strong> ${sentTx.amount}
            </p>
            <p>
              <strong>Date:</strong> {sentTx.date}
            </p>
            <a
              href={sentTx.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline"
            >
              View on Block Explorer
            </a>
          </div>
        )}

        <div className="flex justify-between mt-4">
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

        <button className="mt-4 text-blue-700 underline">Return to Home</button>
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
        <input
          id="address"
          type="text"
          value={address}
          required
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x0000"
          className="w-full text-xl outline-none font-semibold bg-transparent"
        />
      </div>

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
        className="bg-green-700 text-white rounded-[14px] py-3 font-semibold hover:bg-black hover:text-white transition"
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
