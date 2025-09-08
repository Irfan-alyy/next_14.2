import type { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import EmailProvider from "next-auth/providers/email";
import { sendEmail } from "@/utils/sendVerificationEmail";
export const authOptions: AuthOptions = {
  debug: true,
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
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
      }) {
        sendEmail({
          identifier: email,
          url,
          provider: { server, from },
          theme: { brandColor: "#ffd06bff", buttonText: "Click To sign In" },
        });
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        return true; // Allow sign-in
      } catch (error) {
        console.error("Sign-in error:", error);
        return "/auth/error?error=SignInError"; // Force redirect to error page
      }
    },
    async jwt({ token, user }) {
      if (user) {
        (token.id = user.id), (token.name = user.name);
        token.type = (user as any).type;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      // Add custom fields from DB
      if (session.user) {
        session = {
          ...session,
          user: {
            id: token.id as string,
            type: token.type as string,
            name: token.name,
            image: token.image as string,
          },
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect URL:", url, "Base URL:", baseUrl);
      if (url.includes("error=OAuthCallback")) {
        console.log("Handling OAuthCallback error");
        return `${baseUrl}/auth/error?error=OAuthCallback`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
};
