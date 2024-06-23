// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
    // figure out the process.env later 
  providers: [
    GoogleProvider({
      clientId: "1021582275875-e1t6sm936tbvro586t2c7iso5undrdua.apps.googleusercontent.com",
      clientSecret: "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",
    }),
    // Add more providers here
  ],
  // Add any other NextAuth.js configurations here
};
