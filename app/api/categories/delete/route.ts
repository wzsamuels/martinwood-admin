import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  console.log('deleting...')
  const { id } = await request.json();
  console.log(id)

  const category = await prisma.categories.delete({ where: { id } });

  return NextResponse.json({ category });
}