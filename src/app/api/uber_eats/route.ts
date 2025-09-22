import { uberFetch } from "@/lib/uber";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    const stores= await uberFetch(`/v1/eats/stores`)
    // console.log(stores);
    return NextResponse.json(stores)
}