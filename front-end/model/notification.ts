import { Schema, model, models, Document } from "mongoose";

export interface INotification extends Document {
  _id: string;
  walletAddress: string;
  senderAddress: string;
  amount: string;
  description?: string; // Optional because it has a default value
  type: "Testnet" | "Mainnet";
  token: string;
  hashLink: string;
  markAsRead?: boolean; // Optional because it has a default value
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    walletAddress: { type: String, required: true },
    senderAddress: { type: String, required: true },
    amount: { type: String, required: true },
    description: { type: String, default: "" },
    type: {
      type: String,
      enum: ["Testnet", "Mainnet"],
      required: true,
    },
    token: { type: String, required: true },
    hashLink: { type: String, required: true },
    markAsRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create and export the model
const Notification =
  models.Notification ||
  model<INotification>("Notification", NotificationSchema);
export default Notification;
