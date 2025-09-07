import { Metadata } from "next";
import AuthPage from "./login";


export const metadata: Metadata = {
  title: 'Login',
  description: 'Find Jobs That suits your skills and comfort',
}


export default function LoginPage(){
  return(
    <AuthPage/>
  )
}