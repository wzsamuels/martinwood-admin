import { S3} from '@aws-sdk/client-s3';
import {NextRequest, NextResponse} from "next/server";

import { Upload } from "@aws-sdk/lib-storage";

const s3 = new S3({
  region: "us-east-1"
});

export async function POST(request: NextRequest) {
  const data = await request.formData();
  console.log("Body", data)
  if (data) {
    const name = data.get('name')
    const file = data.get('file')
    console.log("File", file)
    console.log("FileName", name)

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: name,
      Body: file
    };

    try {
      const response = await new Upload({
        client: s3,
        params
      }).done();

      return NextResponse.json( { success: true, data: response });
    } catch (error) {
      console.log(error)
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' });
  }
}
