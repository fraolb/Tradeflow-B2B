"use client";

import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { TransactionReceipt } from "@/components/TransactionReceiptPDFForm";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

const page = () => {
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

  const send = () => {
    setLoading(true);
    try {
      setSent(true);
    } catch (error) {
    } finally {
      setTimeout(() => setLoading(false), 5000);
    }
  };

  if (sent) {
    return (
      <div className="bg-white rounded-[20px] px-4 py-6">
        <PDFViewer width="100%" height={400} className="border border-black">
          <TransactionReceipt transaction={mockTransaction} />
        </PDFViewer>

        <div className="flex justify-between mt-4">
          <PDFDownloadLink
            document={<TransactionReceipt transaction={mockTransaction} />}
            fileName="transaction_report.pdf"
          >
            {({ loading }) =>
              loading ? (
                <button className="bg-gray-300 p-2 rounded">
                  Preparing...
                </button>
              ) : (
                <button className="bg-black text-white p-2 rounded hover:bg-opacity-80">
                  Download Report PDF
                </button>
              )
            }
          </PDFDownloadLink>

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
    <form className="flex flex-col gap-6 px-4 py-4" onSubmit={() => send()}>
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
