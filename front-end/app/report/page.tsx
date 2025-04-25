"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TransactionCard from "@/components/TransactionCard";
import { useUser } from "@/context/UserContext";
import { FindTx } from "@/lib/FindTxFunction";
import { usePublicClient } from "wagmi";
import { pdf } from "@react-pdf/renderer";
import { TransactionReport } from "@/components/TransactionReportPDFForm";
import { ReportTxData } from "@/types/reportTransaction";
import { blobToFile } from "@/lib/blobToFile";

export default function Report() {
  const { name, txs, loading, contracts } = useUser();
  const { address, chainId } = useAccount();
  const [transactions, setTransactions] = useState<ReportTxData[]>([]);
  const [loadingReport, setLoadingReport] = useState(false);

  const publicClient = usePublicClient();

  const generateReport = async () => {
    setLoadingReport(true);
    if (!txs || !publicClient) return;

    const enrichedTxs = await Promise.all(
      txs.map(async (i) => {
        const hash = await FindTx(
          i.blockNumber,
          publicClient,
          contracts?.TradeflowContract ??
            "0x92c7d8B28b2c487c7f455733470B27ABE2FefF13"
        );
        return {
          ...i,
          hash: hash || "Not Found",
        };
      })
    );

    setTransactions(enrichedTxs);
    setLoadingReport(false);
  };

  const handlePDF = async () => {
    if (transactions.length === 0) return;
    setLoadingReport(true);
    const pdfInstance = pdf(
      <TransactionReport
        transactions={transactions}
        name={name}
        address={address}
        chainId={chainId ?? 42220}
      />
    );

    const blob = await pdfInstance.toBlob();
    const file = await blobToFile(blob, "transaction_report.pdf");

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
      link.download = "transaction_report.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setLoadingReport(false);
    } else {
      setLoadingReport(false);
      alert("Upload failed");
    }
  };

  console.log("the txs are ", transactions);

  return (
    <div>
      <div className="my-4">
        {transactions.length > 0 ? (
          <Button
            onClick={() => handlePDF()}
            className="bg-[#4361EE] hover:bg-[#3A56D4] text-white h-14 flex flex-col items-center justify-center gap-1"
            disabled={transactions.length === 0}
          >
            {loadingReport ? (
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
                Downloading...
              </div>
            ) : (
              "Download Report"
            )}
          </Button>
        ) : (
          <Button
            className="bg-[#4361EE] hover:bg-[#3A56D4] text-white h-14 flex flex-col items-center justify-center gap-1"
            disabled={loadingReport}
            onClick={() => generateReport()}
          >
            {loadingReport ? (
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
                Generating...
              </div>
            ) : (
              "Generate Report"
            )}
          </Button>
        )}
      </div>
      <div className="w-full">
        <div className="flex justify-center items-center mb-3 text-center">
          <h3 className="text-[#212529] font-bold">All Transactions</h3>
        </div>
        <div>
          {loading && (
            <Card className="w-full bg-gray-50 flex flex-row justify-beteween px-2 py-2 mb-2">
              Loading
            </Card>
          )}
        </div>

        {txs
          .slice()
          .reverse()
          .map((tx, index) => (
            <TransactionCard
              key={index}
              Tx={tx}
              smartContract={
                contracts?.TradeflowContract ??
                "0x92c7d8B28b2c487c7f455733470B27ABE2FefF13"
              }
              chainId={chainId ?? 42220}
            />
          ))}
      </div>
    </div>
  );
}
