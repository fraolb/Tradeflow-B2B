"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TransactionCard from "@/components/TransactionCard";
import { useUser } from "@/context/UserContext";
import { FindTx } from "@/lib/FindTxFunction";
import { usePublicClient } from "wagmi";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { TransactionReport } from "@/components/TransactionReportPDFForm";
import { ReportTxData } from "@/types/reportTransaction";

const page = () => {
  const { name, txs, loading, refetch, contracts } = useUser();
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
  console.log("the txs are ", transactions);

  return (
    <div>
      <div className="my-4">
        {transactions.length > 0 ? (
          <PDFDownloadLink
            document={
              <TransactionReport
                transactions={transactions}
                name={name}
                address={address}
                chainId={chainId ?? 42220}
              />
            }
            fileName="transaction_report.pdf"
          >
            {({ loading }) =>
              loading ? (
                <Button className="bg-green-600 hover:bg-green-800">
                  Preparing...
                </Button>
              ) : (
                <Button className="bg-green-700 hover:bg-green-800">
                  Download Report PDF
                </Button>
              )
            }
          </PDFDownloadLink>
        ) : (
          <Button
            className="bg-green-700 hover:bg-green-800"
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
        <div className="flex justify-between px-2 mb-2">
          <h3 className="font-bold font-mono">Latest Transactions</h3>
          {/* <div className="font-light">See all</div> */}
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
};

export default page;
