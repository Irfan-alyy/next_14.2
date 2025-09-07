"use client"

import { useSession } from "next-auth/react"

export default function ClientComponent(){
    const session= useSession()
    console.log(session);
    
    return(
        <div>
            client component
        </div>
    )
}