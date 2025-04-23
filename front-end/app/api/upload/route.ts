import { cloudinary } from "@/lib/cloudinaryConfig"; // your config path
import { NextRequest, NextResponse } from "next/server";
import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

type UploadResponse =
  | { success: true; result: UploadApiResponse }
  | { success: false; error: UploadApiErrorResponse };

const uploadToCloudinary = (
  fileUri: string,
  fileName: string
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(fileUri, {
        invalidate: true,
        resource_type: "auto",
        filename_override: fileName,
        folder: "transaction-report", // any sub-folder name in your cloud
        use_filename: true,
      })
      .then((result) => {
        resolve({ success: true, result });
      })
      .catch((error) => {
        reject({ success: false, error });
      });
  });
};

export async function POST(req: NextRequest) {
  // your auth check here if required

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }

  // Convert the file to a base64-encoded string
  const fileBuffer = await file.arrayBuffer();

  const mimeType = file.type;
  const encoding = "base64";
  const base64Data = Buffer.from(fileBuffer).toString("base64");

  // this will be used to upload the file
  const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

  const res = await uploadToCloudinary(fileUri, file.name);

  // In your API route (api/upload/route.ts)
  if (res.success && res.result) {
    console.log("from route, the result is ", res.result);
    return NextResponse.json(
      {
        message: "success",
        contentUrl: res.result.secure_url, // Make sure to return secure_url
        downloadUrl: `${res.result.secure_url}?dl=1`, // This forces download
      },
      { status: 200 }
    );
  } else return NextResponse.json({ message: "failure" }, { status: 200 });
}
