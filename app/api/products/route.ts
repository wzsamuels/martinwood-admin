import {NextRequest, NextResponse} from 'next/server';
import {Prisma} from "@prisma/client";
import prisma from "@/lib/prisma";

export async function GET() {
  const products: Prisma.productsCreateInput[] =  await prisma.products.findMany();

  return NextResponse.json({ products });
}

export async function POST(request: NextRequest)  {
  const { category, description, image } = await request.json();

  const product: Prisma.productsCreateInput = {
    category,
    description,
    image,
  };

  console.log(product);

  const newProduct = await prisma.products.create({ data: product });

  return NextResponse.json({ newProduct });
}

export async function PATCH(request: NextRequest) {
  const { id, category, description, image } = await request.json();

  const product: Prisma.productsUpdateInput = {
    category,
    description,
    image,
  };

  const updatedProduct = await prisma.products.update({
    where: { id },
    data: product,
  });

  console.log(updatedProduct)

  return NextResponse.json({ updatedProduct });
}

