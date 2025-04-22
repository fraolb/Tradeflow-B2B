// context/UserContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { TxData } from "@/types/transaction";
import {
  getNameFromContract,
  getTxsFromContract,
  getTokenAmount,
} from "@/lib/ContractFunctions";

interface UserContextType {
  name: string | null;
  txs: TxData[];
  contracts: typeof CELO_TOKEN_ADDRESSES | null;
  cUSDAmount: string;
  cEURAmount: string;
  cRealAmount: string;
  loading: boolean;
  refetch: () => Promise<void>;
}

const ALFAJORES_TOKEN_ADDRESSES = {
  TradeflowContract: "0x92c7d8B28b2c487c7f455733470B27ABE2FefF13",
  cUSD: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
  cEUR: "0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F",
  cReal: "0xE4D517785D091D3c54818832dB6094bcc2744545",
};
const CELO_TOKEN_ADDRESSES = {
  TradeflowContract: "0x9b55647cb55B5a4367D356069d29e969584Ceb18",
  cUSD: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
  cEUR: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73",
  cReal: "0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787",
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { address, chainId } = useAccount();
  const [name, setName] = useState<string | null>(null);
  const [txs, setTxs] = useState<TxData[]>([]);
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<
    typeof CELO_TOKEN_ADDRESSES | null
  >(null);
  const [cUSDAmount, setcUSDAmount] = useState("");
  const [cEURAmount, setcEURAmount] = useState("");
  const [cRealAmount, setcRealAmount] = useState("");

  const fetchUserData = async () => {
    if (!address) return;

    setLoading(true);
    try {
      let chainTokens =
        chainId == 42220 ? CELO_TOKEN_ADDRESSES : ALFAJORES_TOKEN_ADDRESSES;

      const fetchedName = await getNameFromContract(
        address,
        chainTokens.TradeflowContract
      );
      const fetchedTxs = await getTxsFromContract(
        address,
        chainTokens.TradeflowContract
      );

      const getcUSDAmount = await getTokenAmount(address, chainTokens.cUSD);
      const getcEURAmount = await getTokenAmount(address, chainTokens.cEUR);
      const getcRealAmount = await getTokenAmount(address, chainTokens.cReal);

      setName(fetchedName);
      setTxs(fetchedTxs);
      setContracts(chainTokens);
      setcUSDAmount(getcUSDAmount);
      setcEURAmount(getcEURAmount);
      setcRealAmount(getcRealAmount);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) fetchUserData();
  }, [address]);

  return (
    <UserContext.Provider
      value={{
        name,
        txs,
        contracts,
        cUSDAmount,
        cEURAmount,
        cRealAmount,
        loading,
        refetch: fetchUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
