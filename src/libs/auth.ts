 
import type { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google"
import {prisma} from "./prisma"
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages:{
    signIn:"/auth/signin",
    error:"/auth/error",
    verifyRequest:"/auth/verify-request"
  },
    callbacks: {
      async jwt({token,user}) {
            if(user){
                token.id= user.id,
                token.name=user.name
                token.type= (user as any).type
                token.image=user.image
            }
            return token
        },
    async session({ session, token }) {
      // Add custom fields from DB
      if (session.user) {
        session={
          ...session,
          user:{
            id:token.id as string,
            type:token.type as string,
            name:token.name,
            image:token.image as string
          }
        }
      }
      return session;
    },
  }
};
