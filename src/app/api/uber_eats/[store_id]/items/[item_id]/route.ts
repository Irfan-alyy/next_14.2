import { uberFetch } from "@/lib/uber";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req:NextRequest, { params }: { params: { store_id: string , item_id:string } }){
    const {store_id, item_id}= params
    console.log("store id",store_id);
    const menu= await uberFetch(`/v2/eats/stores/${params?.store_id}/menus`)
    const item = menu.items?.find((i:{id:string}) => i?.id === item_id) || null;
    return NextResponse.json({item})
}