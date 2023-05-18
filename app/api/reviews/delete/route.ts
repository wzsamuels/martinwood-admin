import {NextRequest} from "next/server";
import prisma from "@/lib/prisma";

export const POST = async (req: NextRequest) => {
  const { id } = await req.json();

  await prisma.reviews.delete({
    where: {
      id: id
    }
  })
}