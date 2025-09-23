import { uberFetch } from "@/lib/uber";
import { NextRequest, NextResponse } from "next/server";

export  async function GET(req:NextRequest, {
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  console.log("order id", id);
  try {
     const response=await uberFetch(`/v2/eats/order/${id}`)
    return NextResponse.json(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error accepting order:", errorMessage);
    return NextResponse.json(
      { error: errorMessage, message: "Error occurred while accepting order" },
      { status: 500 }
    );
  }
}
