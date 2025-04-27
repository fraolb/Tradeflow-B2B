const API_BASE_URL = "/api/notification";

/**
 * Fetch notifications for a specific wallet address.
 * @param walletAddress - The wallet address to fetch notifications for.
 * @returns A list of notifications.
 */
export async function getNotifications(walletAddress: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/${walletAddress}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.statusText}`);
    }
    console.log(" the fetched notifications ", response);
    return await response.json();
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new Error("Failed to fetch notifications");
  }
}

/**
 * Mark a specific notification as read.
 * @param walletAddress - The wallet address associated with the notification.
 * @param notificationId - The ID of the notification to mark as read.
 * @returns The updated notification.
 */
export async function markAsRead(
  walletAddress: string,
  notificationId: string
) {
  try {
    const response = await fetch(`${API_BASE_URL}/${walletAddress}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: notificationId,
        markAsRead: true,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to mark notification as read: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw new Error("Failed to mark notification as read");
  }
}

/**
 * Create a new notification.
 * @param notificationData - The data for the new notification.
 * @returns The created notification.
 */
export async function createNotification(notificationData: {
  walletAddress: string;
  senderAddress: string;
  amount: string;
  type: string;
  token: string;
  hashLink: string;
  description?: string;
}) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/${notificationData.walletAddress}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create notification: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating notification:", error);
    throw new Error("Failed to create notification");
  }
}
