"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { useUser } from "@/context/UserContext";
import { updateUsername } from "@/lib/ContractFunctions";

interface notificationInterfact {
  message: string;
  type: string;
}

const page = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] =
    useState<notificationInterfact | null>();
  const { name } = useUser();

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
      await updateUsername(username);
      setNotification({
        message: "Username updated successfully!",
        type: "success",
      });
      setLoading(false);
    } catch (error) {
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
    <div className="w-full space-y-6">
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-100">
          <Alert
            className={`mt-12 p-2 px-4 w-full rounded-lg ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            <InformationCircleIcon className="h-5 w-5 text-gray-100" />
            <AlertTitle className="text-white">
              {notification.message}
            </AlertTitle>
          </Alert>
        </div>
      )}
      <div>
        <div className="bg-white rounded-[20px] px-4 py-6">
          <label htmlFor="address" className="text-sm text-black font-mono">
            Username
          </label>
          <input
            id="address"
            type="text"
            value={username}
            required
            placeholder="Add username"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full text-xl outline-none font-semibold bg-transparent"
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button
            className="bg-green-700 hover:bg-green-800"
            onClick={() => updateUsernameFunction()}
          >
            Update
          </Button>
        </div>
      </div>
      <div>
        <div className="font-bold font-mono text-center">
          Frequently asked questions
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="border-b-1 border-black rounded-none">
              What is the purpose of TradeFlow B2B?
            </AccordionTrigger>
            <AccordionContent>
              TradeFlow B2B helps businesses use crypto for payments while
              keeping proper financial records. It bridges the gap between
              crypto and traditional bookkeeping by attaching business context
              to each transaction.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="border-b-1 border-black rounded-none">
              Does it generate reports?
            </AccordionTrigger>
            <AccordionContent>
              Yes. TradeFlow B2B generates detailed transaction reports,
              including sender, receiver, purpose, amount, and timestamps. This
              makes it easy to track and manage crypto payments for business
              use.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="border-b-1 border-black rounded-none">
              Is it free to use?
            </AccordionTrigger>
            <AccordionContent>
              Yes, TradeFlow B2B is currently free to use. You only pay the
              standard blockchain gas fees when making transactions.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="border-b-1 border-black rounded-none">
              How does TradeFlow B2B work with MiniPay?
            </AccordionTrigger>
            <AccordionContent>
              TradeFlow B2B is fully optimized for MiniPay. You can access it
              inside MiniPay, send payments using Mento stablecoins, and manage
              your receipts — all from a mobile-first experience.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="border-b-1 border-black rounded-none">
              What currencies are supported?
            </AccordionTrigger>
            <AccordionContent>
              TradeFlow B2B uses Mento stablecoins such as cUSD, cEUR, and
              others. Only stablecoins are allowed for transactions, ensuring
              price stability and usability for real-world business.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger className="border-b-1 border-black rounded-none">
              Where is the transaction data stored?
            </AccordionTrigger>
            <AccordionContent>
              Core payment details are stored on-chain, including the sender,
              receiver, amount, and reason.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger className="border-b-1 border-black rounded-none">
              Can I download or share receipts?
            </AccordionTrigger>
            <AccordionContent>
              Yes. TradeFlow B2B lets you download and share receipts for every
              transaction, making it easier to collaborate with accountants,
              auditors, or partners.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default page;
