import { NextRequest, NextResponse } from "next/server";

export  async function POST(req:NextRequest, {
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  console.log("order id", id);
  try {
    const response= await fetch(`${process.env.UBER_API_BASE}/v1/eats/orders/${id}/deny_pos_order`, {
        method:"POST",
        headers:{
            "Authorization":`Bearer ${process.env.UBER_ACCESS_TOKEN}`
        }
    });
    if(!response.ok){
        throw new Error(response?.status +" "+response.statusText)
    }
    return NextResponse.json({ message: "Order Rejected successfully" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error accepting order:", errorMessage);
    return NextResponse.json(
      { error: errorMessage, message: "Error occurred while rejecting order" },
      { status: 500 }
    );
  }
}
