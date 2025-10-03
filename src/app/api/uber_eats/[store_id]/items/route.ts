import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { store_id: string } }
) {
  const { store_id } = params;
  // console.log("store id",store_id);
  const res = await fetch(
    `${process.env.UBER_API_BASE}/v2/eats/stores/${store_id}/menus`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${process.env.UBER_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  const menu=await res.json()
//   console.log("new menu", menu);
  return NextResponse.json({ menu });
}


