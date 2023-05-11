// pages/api/delete.js

import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import {NextRequest, NextResponse} from "next/server";

// Create an S3 client object
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

export async function POST(request: NextRequest) {
  const { key } = await request.json();

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    return NextResponse.json( { success: true});
  } catch (error) {
    console.log(error)
    return NextResponse.json({ success: false, error: error.message });
  }
}
