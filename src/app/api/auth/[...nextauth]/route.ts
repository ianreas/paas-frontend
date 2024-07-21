import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    Google({
      clientId: "1021582275875-e1t6sm936tbvro586t2c7iso5undrdua.apps.googleusercontent.com",
      clientSecret: "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",
    }),
    // Add other providers here
  ],
  // Add other NextAuth.js configurations as needed
});

export { handler as GET, handler as POST };
