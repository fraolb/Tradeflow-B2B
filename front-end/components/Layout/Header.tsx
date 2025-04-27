"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useConnect, useAccount } from "wagmi";
import { injected } from "wagmi/connectors";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Bell, ChartSpline } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useNotificationContext } from "@/context/NotificationContext";
import { markAsRead } from "@/lib/NotificationFunctions";

const Header = () => {
  const { connect } = useConnect();
  const router = useRouter();
  const { chainId } = useAccount();
  const { name } = useUser();
  const [hideConnectBtn, setHideConnectBtn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {
    notifications,
    loading,
    error,
    refetchNotifications: fetchNotifications,
    // markNotificationAsRead,
  } = useNotificationContext();

  // Determine network type based on chainId
  const isMainnet = chainId === 42220; // Celo Mainnet

  // Filter notifications based on network type
  const filteredNotifications = Array.isArray(notifications)
    ? notifications.filter((notification) =>
        isMainnet
          ? notification.type === "Mainnet"
          : notification.type === "Testnet"
      )
    : [];

  // Update unread count to use filtered notifications
  const unreadCount = filteredNotifications.filter((n) => !n.markAsRead).length;
  const unreadNotifications = filteredNotifications.filter(
    (n) => !n.markAsRead
  );

  console.log("Notifications:", notifications);

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      setHideConnectBtn(true);
      connect({ connector: injected({ target: "metaMask" }) });
    }
  }, []);

  const markAllAsRead = () => {
    try {
      unreadNotifications.forEach((notification) => {
        markAsRead(notification.walletAddress, notification._id);
      });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  return (
    <div className="flex justify-between bg-[#4361EE] text-white p-4 rounded-b-2xl mb-4 relative">
      <h1 className="text-xl font-bold">Hello, {name}</h1>

      {!hideConnectBtn && (
        <ConnectButton
          showBalance={{
            smallScreen: true,
            largeScreen: false,
          }}
        />
      )}
      <div className="flex gap-4 relative">
        <div className="relative">
          <button
            className="relative p-1 pt-2 rounded-full hover:bg-[#3a56d4] transition-colors"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-label="Notifications"
            aria-expanded={dropdownOpen}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white text-black shadow-xl rounded-lg z-10 border border-gray-200 transform origin-top-right transition-all duration-200">
              <div className="p-3 border-b border-gray-200">
                <h3 className="font-bold text-lg flex justify-between items-center">
                  Notifications
                  <button
                    onClick={fetchNotifications}
                    className="text-sm text-blue-500 hover:text-blue-700"
                  >
                    Refresh
                  </button>
                </h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {loading ? (
                  <p className="p-4 text-gray-500">Loading...</p>
                ) : error ? (
                  <p className="p-4 text-red-500">{error}</p>
                ) : filteredNotifications.length === 0 ? (
                  <p className="p-4 text-gray-500">
                    No {isMainnet ? "Mainnet" : "Testnet"} notifications
                  </p>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 border-b ${
                        !notification.markAsRead ? "bg-gray-100" : ""
                      }`}
                    >
                      <div className="flex justify-between">
                        <p className="text-sm w-2/3 truncate overflow-hidden whitespace-nowrap">
                          {notification.description || "No description"}
                        </p>

                        <p>
                          {notification.amount} &nbsp; {notification.token}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
              {unreadCount > 0 && (
                <div className="p-2 border-t border-gray-200 text-center">
                  <button
                    className="text-sm text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      markAllAsRead();
                      setDropdownOpen(false);
                      fetchNotifications();
                    }}
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className="p-1 pt-0  rounded-full hover:bg-[#3a56d4] transition-colors"
          onClick={() => router.push("/report")}
          aria-label="Reports"
        >
          <ChartSpline className="w-5 h-5" />
        </button>
      </div>

      {dropdownOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default Header;
