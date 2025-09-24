import { uberFetch } from "@/lib/uber";
import { NextResponse } from "next/server";

export async function GET(){
    const stores= await uberFetch(`/v1/eats/stores`)
    // console.log(stores);
    return NextResponse.json(stores)
}