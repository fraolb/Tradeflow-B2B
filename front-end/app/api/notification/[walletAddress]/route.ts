import { NextResponse } from "next/server";
import Notification from "@/model/notification";
import dbConnect from "@/lib/mongodb";

// Explicitly type the params object
interface Params {
  walletAddress: string;
}

// GET: Fetch notifications for a specific wallet address
export async function GET(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  await dbConnect();

  const { walletAddress } = await params;

  try {
    const user = await Notification.find({ walletAddress });
    if (!user) {
      return NextResponse.json(
        { message: "User notification not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching user notification", error },
      { status: 500 }
    );
  }
}

// PUT: Update a specific notification by _id (e.g., mark as read)
export async function PUT(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  await dbConnect();

  const { walletAddress } = await params;

  try {
    const body = await request.json();
    const { _id, ...updateData } = body; // Extract _id and other fields to update

    if (!_id) {
      return NextResponse.json(
        { message: "Notification _id is required" },
        { status: 400 }
      );
    }

    // Find and update the specific notification
    const updatedNotification = await Notification.findOneAndUpdate(
      { _id, walletAddress }, // Match by _id and walletAddress
      updateData,
      { new: true } // Return the updated document
    );

    if (!updatedNotification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedNotification);
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating notification", error },
      { status: 500 }
    );
  }
}

// POST: Create a new notification
export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();

    // Validate required fields
    const { walletAddress, senderAddress, amount, type, token, hashLink } =
      body;
    if (
      !walletAddress ||
      !senderAddress ||
      !amount ||
      !type ||
      !token ||
      !hashLink
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new notification
    const newNotification = await Notification.create(body);

    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating notification", error },
      { status: 500 }
    );
  }
}
