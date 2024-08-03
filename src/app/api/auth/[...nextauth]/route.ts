// number 1)
// import NextAuth from "next-auth";
// import Github from "next-auth/providers/github";
// import Google from "next-auth/providers/google";

// declare module "next-auth" {
//   interface Session {
//     accessToken?: string;
//   }
// }

// const handler = NextAuth({
//   providers: [
//     Google({
//       clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
//       clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? "",
//     }),
//     Github({
//       clientId: process.env.GITHUB_ID ?? "Ov23liMRAfjQ8vbmGNdK",
//       clientSecret: process.env.GITHUB_SECRET ?? "4e21397dbb477c9016765c51278aa5f7718bcd61",
//       authorization: {
//         params: {
//           scope: "read:user repo",
//         },
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, account }) {
//       if (account) {
//         token.accessToken = account.access_token;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.accessToken = token.accessToken as string;
//       return session;
//     },
//   },
// });

// export { handler as GET, handler as POST };

// number 2)
// import NextAuth from "next-auth";
// import Github from "next-auth/providers/github";
// import Google from "next-auth/providers/google";

// declare module "next-auth" {
//   interface Session {
//     accessToken?: string;
//     user: {
//       id: string;
//       email: string;
//       name: string;
//       image: string;
//       githubConnected?: boolean;
//     };
//   }
// }

// const handler = NextAuth({
//   providers: [
//     Google({
//       clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
//       clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? "",
//     }),
//     Github({
//       clientId: process.env.GITHUB_ID ?? "",
//       clientSecret: process.env.GITHUB_SECRET ?? "",
//       authorization: {
//         params: {
//           scope: "read:user repo",
//         },
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, account, profile }) {
//       if (account) {
//         token.accessToken = account.access_token;
//         if (account.provider === "github") {
//           token.githubConnected = true;
//         }
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.accessToken = token.accessToken as string;
//       session.user.githubConnected = token.githubConnected as boolean;
//       return session;
//     },
//   },
// });

// export { handler as GET, handler as POST };


// number 3) 
// import NextAuth from "next-auth";
// import Github from "next-auth/providers/github";
// import Google from "next-auth/providers/google";

// declare module "next-auth" {
//   interface Session {
//     accessToken?: string;
//     user: {
//       id: string;
//       email: string;
//       name: string;
//       image: string;
//       githubConnected?: boolean;
//     };
//   }
// }

// const handler = NextAuth({
//   providers: [
//     Google({
//       clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
//       clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? "",
//     }),
//     Github({
//       clientId: process.env.GITHUB_ID ?? "",
//       clientSecret: process.env.GITHUB_SECRET ?? "",
//       authorization: {
//         params: {
//           scope: "read:user repo",
//         },
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, account, profile }) {
//       if (account) {
//         token.accessToken = account.access_token;
//         if (account.provider === 'github') {
//           token.githubConnected = true;
//         }
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.accessToken = token.accessToken as string;
//       session.user.githubConnected = token.githubConnected as boolean;
//       return session;
//     },
//   },
//   pages: {
//     signIn: '/auth/signin',
//   },
// });

// export { handler as GET, handler as POST };


//number 4) 
import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email: string;
      name: string;
      image: string;
      githubConnected?: boolean;
      githubUsername?: string;
    };
  }
}

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? "",
    }),
    Github({
      clientId: "Ov23liMRAfjQ8vbmGNdK",
      clientSecret: "3be85463ce1c9b10241fd3de910c4bd3b8bec214",//process.env.GITHUB_SECRET ?? "",
      authorization: {
        params: {
          scope: "read:user repo",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        if (account.provider === 'github') {
          token.githubConnected = true;
          token.githubUsername = profile?.name  // GitHub username is in profile.login, not profile.name
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.githubConnected = token.githubConnected as boolean;
      session.user.githubUsername = token.githubUsername as string;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
});

export { handler as GET, handler as POST };