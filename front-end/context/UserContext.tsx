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
  cUSDAmount: string;
  cEURAmount: string;
  loading: boolean;
  refetch: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { address } = useAccount();
  const [name, setName] = useState<string | null>(null);
  const [txs, setTxs] = useState<TxData[]>([]);
  const [loading, setLoading] = useState(true);
  const [cUSDAmount, setcUSDAmount] = useState("");
  const [cEURAmount, setcEURAmount] = useState("");

  const cUSD = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
  const cEUR = "0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F";

  const fetchUserData = async () => {
    if (!address) return;

    setLoading(true);
    try {
      const fetchedName = await getNameFromContract(address);
      const fetchedTxs = await getTxsFromContract(address);

      const getcUSDAmount = await getTokenAmount(address, cUSD);
      const getcEURAmount = await getTokenAmount(address, cEUR);

      setName(fetchedName);
      setTxs(fetchedTxs);
      setcUSDAmount(getcUSDAmount);
      setcEURAmount(getcEURAmount);
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
        cUSDAmount,
        cEURAmount,
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
