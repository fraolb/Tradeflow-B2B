// pages/swap.tsx
"use client";

import { useState, useEffect } from "react";
import { Mento } from "@mento-protocol/mento-sdk";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { providers } from "ethers";

// Supported tokens in the Mento protocol
const CELO_SUPPORTED_TOKENS = [
  { symbol: "CELO", address: "0x471EcE3750Da237f93B8E339c536989b8978a438" },
  { symbol: "cUSD", address: "0x765DE816845861e75A25fCA122bb6898B8B1282a" },
  { symbol: "cEUR", address: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73" },
  { symbol: "cREAL", address: "0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787" },
];

const SUPPORTED_TOKENS = [
  { symbol: "CELO", address: "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9" },
  { symbol: "cUSD", address: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1" },
  { symbol: "cEUR", address: "0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F" },
  { symbol: "cREAL", address: "0xE4D517785D091D3c54818832dB6094bcc2744545" },
];

export default function SwapPage() {
  const { address } = useAccount();

  //   const { data: signer } = useSigner();
  const [mento, setMento] = useState<Mento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [fromToken, setFromToken] = useState(SUPPORTED_TOKENS[1]); // Default cUSD
  const [toToken, setToToken] = useState(SUPPORTED_TOKENS[2]); // Default cEUR
  const [amount, setAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState<string | null>(null);
  const [expectedOutput, setExpectedOutput] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Initialize Mento SDK
  useEffect(() => {
    const initMento = async () => {
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
  //   useEffect(() => {
  //     const fetchBalances = async () => {
  //       if (!address) return;

  //       try {
  //         const balancePromises = SUPPORTED_TOKENS.map(async (token) => {
  //           const balance = await mento.getBalance(token.address, address);
  //           return {
  //             symbol: token.symbol,
  //             balance: ethers.utils.formatUnits(balance, 18), // Assuming 18 decimals
  //           };
  //         });

  //         const results = await Promise.all(balancePromises);
  //         const balanceMap = results.reduce((acc, curr) => {
  //           acc[curr.symbol] = curr.balance;
  //           return acc;
  //         }, {} as Record<string, string>);

  //         setBalances(balanceMap);
  //       } catch (err) {
  //         console.error('Error fetching balances:', err);
  //       }
  //     };

  //     fetchBalances();
  //   }, [address]);

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
        // const rate = await mento.getExchangeRate(
        //   fromToken.address,
        //   toToken.address,
        //   amountInWei
        // );

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
    // if (!mento || !signer || !amount || !expectedOutput) return;
    // try {
    //   setLoading(true);
    //   setError(null);
    //   setTxHash(null);
    //   const amountInWei = ethers.parseUnits(amount, 18);
    //   const minAmountOutWei = ethers.parseUnits(expectedOutput, 18);
    //   const allowanceTxObj = await mento.increaseTradingAllowance(
    //     fromToken.address,
    //     amountInWei
    //   );
    //   const allowanceTx = await signer.sendTransaction(allowanceTxObj);
    //   const allowanceReceipt = await allowanceTx.wait();
    //   console.log("tx receipt: ", allowanceReceipt);
    //   const expectedAmountOut = Number(expectedOutput) * (99 / 100); // allow 1% slippage from quote
    //   const swapTxObj = await mento.swapIn(
    //     fromToken.address,
    //     toToken.address,
    //     amountInWei,
    //     expectedAmountOut
    //   );
    //   const swapTx = await signer.sendTransaction(swapTxObj);
    //   const swapTxReceipt = await swapTx.wait();
    //   setTxHash(swapTxReceipt);
    //   // Refresh balances after successful swap
    //   const updatedBalances = { ...balances };
    //   updatedBalances[fromToken.symbol] = (
    //     parseFloat(updatedBalances[fromToken.symbol]) - parseFloat(amount)
    //   ).toString();
    //   updatedBalances[toToken.symbol] = (
    //     parseFloat(updatedBalances[toToken.symbol]) + parseFloat(expectedOutput)
    //   ).toString();
    //   setBalances(updatedBalances);
    // } catch (err) {
    //   console.error("Swap failed:", err);
    //   setError("Swap transaction failed");
    // } finally {
    //   setLoading(false);
    // }
  };

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount("");
    setExchangeRate(null);
    setExpectedOutput(null);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Mento Swap</h2>
            {address && (
              <div className="text-sm text-gray-500">
                Connected: {address.slice(0, 6)}...{address.slice(-4)}
              </div>
            )}
          </div>

          {/* From Token Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <div className="flex rounded-md shadow-sm border border-gray-300">
              <input
                type="number"
                className="flex-1 min-w-0 block w-full px-3 py-3 rounded-none rounded-l-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <select
                className="inline-flex items-center px-3 py-2 border-l border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-r-md"
                value={fromToken.symbol}
                onChange={(e) =>
                  setFromToken(
                    SUPPORTED_TOKENS.find((t) => t.symbol === e.target.value) ||
                      fromToken
                  )
                }
              >
                {SUPPORTED_TOKENS.map((token) => (
                  <option key={`from-${token.symbol}`} value={token.symbol}>
                    {token.symbol}
                    {balances[token.symbol] &&
                      ` (${parseFloat(balances[token.symbol]).toFixed(2)})`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Switch Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={switchTokens}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Switch tokens"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>
          </div>

          {/* To Token Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To (Estimated)
            </label>
            <div className="flex rounded-md shadow-sm border border-gray-300">
              <input
                type="text"
                className="flex-1 min-w-0 block w-full px-3 py-3 rounded-none rounded-l-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
                placeholder="0.0"
                value={expectedOutput || ""}
                readOnly
              />
              <select
                className="inline-flex items-center px-3 py-2 border-l border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-r-md"
                value={toToken.symbol}
                onChange={(e) =>
                  setToToken(
                    SUPPORTED_TOKENS.find((t) => t.symbol === e.target.value) ||
                      toToken
                  )
                }
              >
                {SUPPORTED_TOKENS.filter(
                  (t) => t.symbol !== fromToken.symbol
                ).map((token) => (
                  <option key={`to-${token.symbol}`} value={token.symbol}>
                    {token.symbol}
                    {balances[token.symbol] &&
                      ` (${parseFloat(balances[token.symbol]).toFixed(2)})`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Exchange Rate Info */}
          {exchangeRate && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Exchange Rate:</span>
                <span className="font-medium">
                  1 {fromToken.symbol} = {parseFloat(exchangeRate).toFixed(6)}{" "}
                  {toToken.symbol}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Expected Output:</span>
                <span className="font-medium">
                  {parseFloat(expectedOutput || "0").toFixed(6)}{" "}
                  {toToken.symbol}
                </span>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            disabled={!amount || !expectedOutput || loading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              !amount || !expectedOutput || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
              ? "Processing..."
              : //   : !signer
                //   ? "Connect Wallet"
                `Swap ${fromToken.symbol} to ${toToken.symbol}`}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Transaction Hash */}
          {txHash && (
            <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-md text-sm">
              Swap successful!{" "}
              <a
                href={`https://explorer.celo.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-green-700"
              >
                View on Celo Explorer
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
