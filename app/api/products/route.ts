import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/model/Product";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const product = await Product.create(body);

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
  console.error(error);

  return NextResponse.json(
    {
      message: error.message,
      errors: error.errors,
    },
    { status: 500 }
  );
}
  
}

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find();

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
}