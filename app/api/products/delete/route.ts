import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  console.log('deleting...')
  const { id } = await request.json();
  console.log(id)

  const product = await prisma.products.delete({ where: { id } });

  return NextResponse.json({ product });
}