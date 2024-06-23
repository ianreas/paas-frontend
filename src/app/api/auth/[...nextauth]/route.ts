import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    Google({
      clientId: "",
      clientSecret: "",
    }),
    // Add other providers here
  ],
  // Add other NextAuth.js configurations as needed
});

export { handler as GET, handler as POST };
