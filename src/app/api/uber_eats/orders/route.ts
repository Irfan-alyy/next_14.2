import { uberFetch } from "@/lib/uber";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page_size = searchParams.get("page_size") || "10"; // default to 10 per page
  const store_id = searchParams.get("store_id");
  const next_page_token = searchParams.get("next_page_token");
  const state= searchParams.get("state") || ""
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
      const response = await uberFetch("/v1/eats/stores");
      const stores= response?.stores
      // console.log("all stores",stores);
      const result = await Promise.all(
        stores.map(async (store:{store_id:string, name:string}) => {
          const dat = await uberFetch(`/v1/delivery/store/${store.store_id}/orders?state=${state}&expand=${state?"carts":""}&page_size=${page_size}`);                
          return {
            store_name: store.name,
            store_id: store.store_id,
            orders: dat.data || [],
            next_page_token: dat?.pagination_data?.next_page_token || null,
          };
        })
      );
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
