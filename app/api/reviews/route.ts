import prisma from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";

export const GET = async () => {
  const reviews = await prisma.reviews.findMany();

  return NextResponse.json({reviews})
}

export const PATCH = async (request: NextRequest) => {
  const {id, approved} = await request.json();

  const review = await prisma.reviews.update({
    where: {
      id: id
    },
    data: {
      approved: approved
    }
  });


  return NextResponse.json({review})
}
