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
      async sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
      }) {
        try {
          await sendEmail({
            identifier: email,
            url,
            provider: { server, from },
            theme: { brandColor: "#ffd06bff", buttonText: "Click To sign In" },
          });
        } catch (error) {
          if (error instanceof Error && error.message === "EMAIL_SEND_FAILED") {
            throw new Error("EmailSendError"); // Custom error key
          }
          throw error; // Re-throw unexpected errors
        }
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.type = user.type;
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
  },
};
