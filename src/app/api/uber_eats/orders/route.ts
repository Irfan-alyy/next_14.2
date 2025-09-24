import { uberFetch } from "@/lib/uber";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page_size = searchParams.get("page_size") || "10"; // default to 10 per page
  const store_id = searchParams.get("store_id");
  const next_page_token = searchParams.get("next_page_token");


  console.log("params", page_size, store_id);
  

  try {
    const response = await uberFetch(
      `/v1/delivery/store/${store_id}/orders?page_size=${page_size}&${next_page_token?("next_page_token="+next_page_token): ""}`
    );
    return NextResponse.json(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching orders:", errorMessage);
    return NextResponse.json(
      { error: errorMessage, message: "Error occurred fetching orders" },
      { status: 500 }
    );
  }
}

// const getOrders = async (stores) => {
//   // console.log("stores", stores);
//   const orderPromises =
//     stores?.stores?.map(async (store) => {
//       try {
//         const response = await uberFetch(
//           `/v1/delivery/store/${store?.store_id}/orders?page_size=100`
//         );
//         console.log("response", response);
//         if (response?.data && response.data.length > 0) {
//           return response.data; // returns array of orders for this store
//         }
//         return []; // return empty array if no orders, to avoid undefined
//       } catch (error) {
//         console.error(
//           `Failed to fetch orders for store ${store?.store_id}:`,
//           error
//         );
//         return []; // or throw if you want to fail fast
//       }
//     }) || [];

//   let orders = await Promise.all(orderPromises);
//   orders = orders.flat();
//   return orders;
// };
