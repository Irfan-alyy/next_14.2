import { prisma } from "@/lib/prisma";
import { uberFetch } from "@/lib/uber";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page_size = searchParams.get("page_size") || "10"; // default to 10 per page
  const store_id = searchParams.get("store_id");
  const next_page_token = searchParams.get("next_page_token");
  const state= searchParams.get("state") || undefined
  // console.log("params", page_size, store_id, state);

  if(store_id && next_page_token){
    try {
      const response = await uberFetch(`/v1/delivery/store/${store_id}/orders?page_size=${page_size}&next_page_token=${next_page_token}`)
      return NextResponse.json({orders:response.data, next_page_token:response?.pagination_data?.next_page_token})
    } catch (error) {
      return NextResponse.json({message:"Error Fetching Orders", error},{status:500})
    }
  }

  try {
      const result = await prisma.order.findMany({where:{currentState:state}, orderBy:{createdAt:"desc"}})
    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching orders:", errorMessage);
    return NextResponse.json(
      { error: errorMessage, message: "Error occurred fetching orders" },
      { status: 500 }
    );
  }
}
