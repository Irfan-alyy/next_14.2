import { Suspense } from "react";
import VerifyRequestPage from "./VerifyPage";

export default function VerifyPage(){
return(
  <div>
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
    <VerifyRequestPage/>
    </Suspense>
  </div>
)
}