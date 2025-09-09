import { Metadata } from "next";
import AuthPage from "./login";
import { Suspense } from "react";


export const metadata: Metadata = {
  title: 'Login',
  description: 'Find Jobs That suits your skills and comfort',
}


export default function LoginPage(){
  return(
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <AuthPage/>

    </Suspense>
  )
}