"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getNotifications } from "@/lib/NotificationFunctions";
import { useAccount } from "wagmi";

interface Notification {
  _id: string;
  walletAddress: string;
  senderAddress: string;
  amount: string;
  description?: string;
  type: "Testnet" | "Mainnet";
  token: string;
  hashLink: string;
  markAsRead?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  refetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { address } = useAccount();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedNotifications = await getNotifications(address);
      setNotifications(fetchedNotifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [address]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        error,
        refetchNotifications: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }
  return context;
};
