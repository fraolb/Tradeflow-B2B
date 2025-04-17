// context/UserContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Tx

interface UserContextType {
  name: string | null;
  txs: TxData[];
  loading: boolean;
  refetch: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { address } = useAccount();
  const [name, setName] = useState<string | null>(null);
  const [txs, setTxs] = useState<TxData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    if (!address) return;

    setLoading(true);
    try {
      // Replace these with actual smart contract calls
      const fetchedName = await getNameFromContract(address);
      const fetchedTxs = await getTxsFromContract(address);

      setName(fetchedName);
      setTxs(fetchedTxs);
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
      value={{ name, txs, loading, refetch: fetchUserData }}
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
