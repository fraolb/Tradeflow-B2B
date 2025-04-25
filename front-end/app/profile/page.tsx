"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { useUser } from "@/context/UserContext";
import { updateUsername } from "@/lib/ContractFunctions";

interface notificationInterfact {
  message: string;
  type: string;
}

export default function Profile() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] =
    useState<notificationInterfact | null>();
  const { name, contracts, refetch } = useUser();

  const updateUsernameFunction = async () => {
    setLoading(true);
    if (!username.trim()) {
      setNotification({
        message: "Username is empty!",
        type: "error",
      });
      setLoading(false);
      setTimeout(() => setNotification(null), 3000);

      return;
    }

    if (username === name) {
      setNotification({
        message: "The username is the same as the previous one!",
        type: "error",
      });
      setLoading(false);
      setTimeout(() => setNotification(null), 3000);

      return;
    }

    try {
      console.log("the tradeflow contract is ", contracts?.TradeflowContract);
      await updateUsername(
        username,
        contracts?.TradeflowContract ??
          "0x92c7d8B28b2c487c7f455733470B27ABE2FefF13"
      );
      setNotification({
        message: "Username updated successfully!",
        type: "success",
      });
      await refetch();
      setLoading(false);
    } catch {
      setNotification({
        message: "An error occurred while updating the username.",
        type: "error",
      });
      setLoading(false);
    }

    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    setUsername(name ? name : "");
  }, [name]);

  return (
    <div className="w-full space-y-4">
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

      <Card className="p-6 bg-white rounded-xl">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="text-sm text-[#6C757D] font-medium"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              required
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 p-3 text-lg outline-none font-medium bg-[#F8F9FA] rounded-lg border border-[#E9ECEF] focus:border-[#4361EE]"
            />
          </div>

          <Button
            onClick={(e) => {
              e.preventDefault();
              updateUsernameFunction();
            }}
            className="w-full bg-[#4361EE] hover:bg-[#3A56D4] text-white py-3 text-lg"
            disabled={loading}
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
                Updating...
              </div>
            ) : (
              "Update Username"
            )}
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-white rounded-xl">
        <h2 className="text-xl font-bold text-[#212529] mb-4 text-center">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full space-y-2">
          {[
            {
              value: "item-1",
              question: "What is the purpose of TradeFlow B2B?",
              answer:
                "TradeFlow B2B helps businesses use crypto for payments while keeping proper financial records. It bridges the gap between crypto and traditional bookkeeping by attaching business context to each transaction.",
            },
            {
              value: "item-2",
              question: "Does it generate reports?",
              answer:
                "Yes. TradeFlow B2B generates detailed transaction reports, including sender, receiver, purpose, amount, and timestamps. This makes it easy to track and manage crypto payments for business use.",
            },
            {
              value: "item-3",
              question: "Is it free to use?",
              answer:
                "Yes, TradeFlow B2B is currently free to use. You only pay the standard blockchain gas fees when making transactions.",
            },
            {
              value: "item-4",
              question: "How does TradeFlow B2B work with MiniPay?",
              answer:
                "TradeFlow B2B is fully optimized for MiniPay. You can access it inside MiniPay, send payments using Mento stablecoins, and manage your receipts — all from a mobile-first experience.",
            },
            {
              value: "item-5",
              question: "What currencies are supported?",
              answer:
                "TradeFlow B2B uses Mento stablecoins such as cUSD, cEUR, and others. Only stablecoins are allowed for transactions, ensuring price stability and usability for real-world business.",
            },
            {
              value: "item-6",
              question: "Where is the transaction data stored?",
              answer:
                "Core payment details are stored on-chain, including the sender, receiver, amount, and reason.",
            },
            {
              value: "item-7",
              question: "Can I download or share receipts?",
              answer:
                "Yes. TradeFlow B2B lets you download and share receipts for every transaction, making it easier to collaborate with accountants, auditors, or partners.",
            },
          ].map((item) => (
            <AccordionItem
              key={item.value}
              value={item.value}
              className="border-b border-[#E9ECEF]"
            >
              <AccordionTrigger className="py-3 hover:no-underline">
                <span className="text-left font-medium text-[#212529]">
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-[#6C757D] pb-3">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
}
