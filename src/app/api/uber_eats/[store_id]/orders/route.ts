import { uberFetch } from "@/lib/uber";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req:NextRequest, { params }: { params: { store_id: string } }){
    const {store_id}= params
    // console.log("store id",store_id);
    const orders = await uberFetch(`/v1/delivery/store/${store_id}/orders`)
    console.log(orders);
    return NextResponse.json(orders)
}