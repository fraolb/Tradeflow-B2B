// pages/swap.tsx
"use client";

import { useState, useEffect } from "react";
import { Mento } from "@mento-protocol/mento-sdk";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { getTokenAmount } from "@/lib/ContractFunctions";
import { ArrowsUpDownIcon } from "@heroicons/react/24/solid";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Supported tokens in the Mento protocol
const CELO_SUPPORTED_TOKENS = [
  { symbol: "CELO", address: "0x471EcE3750Da237f93B8E339c536989b8978a438" },
  { symbol: "cUSD", address: "0x765DE816845861e75A25fCA122bb6898B8B1282a" },
  { symbol: "cEUR", address: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73" },
  { symbol: "cREAL", address: "0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787" },
];

const ALFAJORES_SUPPORTED_TOKENS = [
  { symbol: "CELO", address: "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9" },
  { symbol: "cUSD", address: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1" },
  { symbol: "cEUR", address: "0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F" },
  { symbol: "cREAL", address: "0xE4D517785D091D3c54818832dB6094bcc2744545" },
];

export default function SwapPage() {
  const { address, chainId } = useAccount();

  //   const { data: signer } = useSigner();
  const [mento, setMento] = useState<Mento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supportedToken, setSupportedToken] = useState<
    typeof ALFAJORES_SUPPORTED_TOKENS
  >(ALFAJORES_SUPPORTED_TOKENS);
  const [fromToken, setFromToken] = useState(supportedToken[1]); // Default cUSD
  const [fromTokenBalance, setFromTokenBalance] = useState("");
  const [toToken, setToToken] = useState(supportedToken[2]); // Default cEUR
  const [amount, setAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState<string | null>(null);
  const [expectedOutput, setExpectedOutput] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;
    if (chainId == 42220) {
      setSupportedToken(CELO_SUPPORTED_TOKENS);
    } else {
      setSupportedToken(ALFAJORES_SUPPORTED_TOKENS);
    }
  }, [address]);

  // Initialize Mento SDK
  useEffect(() => {
    const initMento = async () => {
      if (typeof window === "undefined") return;

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const mentoInstance = await Mento.create(provider);
        const pairs = await mentoInstance.getTradablePairs();
        console.log(pairs);
        setMento(mentoInstance);
        setLoading(false);
      } catch (err) {
        setError("Failed to initialize Mento SDK");
        console.error(err);
      }
    };

    initMento();
  }, []);

  // Fetch balances when address changes
  useEffect(() => {
    const fetchBalances = async () => {
      if (!address) return;

      try {
        const amount = await getTokenAmount(address, fromToken.address);
        setFromTokenBalance(amount);
      } catch (err) {
        console.error("Error fetching balances:", err);
      }
    };

    fetchBalances();
  }, [address, fromToken]);

  // Fetch exchange rate when tokens or amount changes
  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (!mento || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        setExchangeRate(null);
        setExpectedOutput(null);
        return;
      }

      try {
        const amountInWei = ethers.utils.parseUnits(amount, 18);

        const expectedAmount = await mento.getAmountOut(
          fromToken.address,
          toToken.address,
          amountInWei
        );

        setExchangeRate(ethers.utils.formatUnits(expectedAmount, 18));
        setExpectedOutput(ethers.utils.formatUnits(expectedAmount, 18));
      } catch (err) {
        console.error("Error fetching exchange rate:", err);
        setExchangeRate(null);
        setExpectedOutput(null);
      }
    };

    const debounceTimer = setTimeout(fetchExchangeRate, 500);
    return () => clearTimeout(debounceTimer);
  }, [mento, fromToken, toToken, amount]);

  const handleSwap = async () => {
    if (!mento || !amount || !expectedOutput || !address) {
      setError("Missing required fields or wallet not connected");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTxHash(null);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const amountInWei = ethers.utils.parseUnits(amount, 18);
      const mento1 = await Mento.create(signer);

      // swapping cUSD for Celo and then Celo for cEUR
      // find the tradable pair path for the tokens to swap through the router
      const tradablePair = await mento.findPairForTokens(
        fromToken.address,
        toToken.address
      );

      // Fetch the quote for the expected output
      const quoteAmountOut = await mento.getAmountOut(
        fromToken.address,
        toToken.address,
        amountInWei,
        tradablePair
      );

      console.log(
        `~${ethers.utils.formatUnits(
          quoteAmountOut,
          18
        )} cEUR in exchange for 0.01 cUSD`
      );

      // Step 1: Approve the trading allowance
      console.log("Increasing trading allowance...");
      const allowanceTxObj = await mento1.increaseTradingAllowance(
        fromToken.address,
        amountInWei,
        tradablePair
      );
      const allowanceTx = await signer.sendTransaction(allowanceTxObj);
      const allowanceReceipt = await allowanceTx.wait();
      console.log("Trading allowance approved.", allowanceReceipt);

      // Step 2: Initiate the swap
      console.log("Swapping tokens...");

      // Allow 1% slippage
      const minAmountOutWei = quoteAmountOut.mul(99).div(100);
      const swapTxObj = await mento1.swapIn(
        fromToken.address,
        toToken.address,
        amountInWei,
        minAmountOutWei,
        tradablePair
      );

      const swapTx = await signer.sendTransaction({
        ...swapTxObj,
      });
      const swapTxReceipt = await swapTx.wait();
      console.log(
        "Swap successful. Transaction hash:",
        swapTxReceipt.transactionHash
      );

      setTxHash(swapTxReceipt.transactionHash);

      // Refresh balances after successful swap
      const updatedBalance = await getTokenAmount(address, fromToken.address);
      setFromTokenBalance(updatedBalance);

      setAmount("");
      setExchangeRate(null);
      setExpectedOutput(null);
    } catch (err) {
      console.error("Swap failed:", err);
      setError("Swap transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount("");
    setExchangeRate(null);
    setExpectedOutput(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#212529]">TradeFlow Swap</h2>
        </div>

        <Card className="p-5 bg-white rounded-xl mb-4 gap-2">
          <label className="block text-sm font-medium text-[#6C757D] mb-2">
            From
          </label>
          <div className="flex items-center justify-between">
            <input
              type="number"
              className="text-2xl w-3/4 outline-none font-bold bg-transparent text-[#212529]"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <select
              className="px-3 py-2 border border-[#E9ECEF] bg-[#F8F9FA] text-[#212529] text-sm rounded-lg"
              value={fromToken.symbol}
              onChange={(e) =>
                setFromToken(
                  supportedToken.find((t) => t.symbol === e.target.value) ||
                    fromToken
                )
              }
            >
              {supportedToken.map((token) => (
                <option key={`from-${token.symbol}`} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>
          <div
            className="flex mt-2 justify-end gap-2 text-sm text-[#4361EE] cursor-pointer hover:text-[#3A56D4]"
            onClick={() => setAmount(fromTokenBalance)}
          >
            <span>Use Max</span>
            <span>{Number(fromTokenBalance).toFixed(2)}</span>
          </div>
        </Card>

        <div className="flex justify-center mb-4">
          <button
            onClick={switchTokens}
            className="p-3 bg-white rounded-full shadow-md hover:bg-[#F8F9FA] transition-colors"
            aria-label="Switch tokens"
          >
            <ArrowsUpDownIcon className="w-6 h-6 text-[#4361EE]" />
          </button>
        </div>

        <Card className="p-5 bg-white rounded-xl mb-4 gap-2">
          <label className="block text-sm font-medium text-[#6C757D] mb-2">
            To (Estimated)
          </label>
          <div className="flex items-center justify-between">
            <input
              type="text"
              className="text-2xl w-3/4 outline-none font-bold bg-transparent text-[#212529]"
              placeholder="0.0"
              value={Number(expectedOutput).toFixed(4) || ""}
              readOnly
            />
            <select
              className="px-3 py-2 border border-[#E9ECEF] bg-[#F8F9FA] text-[#212529] text-sm rounded-lg"
              value={toToken.symbol}
              onChange={(e) =>
                setToToken(
                  supportedToken.find((t) => t.symbol === e.target.value) ||
                    toToken
                )
              }
            >
              {supportedToken
                .filter((t) => t.symbol !== fromToken.symbol)
                .map((token) => (
                  <option key={`to-${token.symbol}`} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
            </select>
          </div>
        </Card>

        {exchangeRate && (
          <Card className="p-4 bg-[#F8F9FA] rounded-lg mb-6">
            <div className="flex justify-between text-sm text-[#6C757D]">
              <span>Exchange Rate:</span>
              <span className="font-medium text-[#212529]">
                1 {fromToken.symbol} ={" "}
                {(parseFloat(exchangeRate) / parseFloat(amount)).toFixed(6)}{" "}
                {toToken.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm text-[#6C757D] mt-2">
              <span>Expected Output:</span>
              <span className="font-medium text-[#212529]">
                {parseFloat(expectedOutput || "0").toFixed(6)} {toToken.symbol}
              </span>
            </div>
          </Card>
        )}

        <Button
          onClick={handleSwap}
          disabled={!amount || !expectedOutput || loading}
          className={`w-full py-4 rounded-xl text-lg font-bold ${
            !amount || !expectedOutput || loading
              ? "bg-[#4361EE]/70 cursor-not-allowed"
              : "bg-[#4361EE] hover:bg-[#3A56D4]"
          }`}
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
          ) : !address ? (
            "Connect Wallet"
          ) : (
            `Swap ${fromToken.symbol} to ${toToken.symbol}`
          )}
        </Button>

        {error && (
          <Card className="mt-4 p-4 bg-[#FF006E]/10 border border-[#FF006E]/20">
            <div className="text-[#FF006E] text-sm">{error}</div>
          </Card>
        )}

        {txHash && (
          <Card className="mt-4 p-4 bg-[#38B000]/10 border border-[#38B000]/20">
            <div className="text-[#38B000] text-sm">
              Swap successful!{" "}
              <a
                href={
                  chainId == 42220
                    ? `https://explorer.celo.org/tx/${txHash}`
                    : `https://celo-alfajores.blockscout.com/tx/${txHash}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#38B000]/80"
              >
                View on Celo Explorer
              </a>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
