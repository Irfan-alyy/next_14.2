import { uberFetch } from "@/lib/uber";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest, { params }: { params: { store_id: string } }){
    const {store_id}= params
    // console.log("store id",store_id);
    const menu= await uberFetch(`/v2/eats/stores/${params?.store_id}/menus`)
    return NextResponse.json({ menu})
}