import {NextRequest, NextResponse} from 'next/server';
import {Prisma} from "@prisma/client";
import prisma from "@/lib/prisma";

export async function GET() {
  const categories: Prisma.categoriesCreateInput[] =  await prisma.categories.findMany();

  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {

  const { name, image } = await request.json();

  const category = await prisma.categories.create({
    data: {
      name,
      image
    },
  });

  return NextResponse.json({ category });
}

export async function PATCH(request: NextRequest)  {
  const { id, name, image } = await request.json();

  const category = await prisma.categories.update({
    where: {
      id,
    },
    data: {
      name,
      image,
    },
  });

  return NextResponse.json({ category });
}