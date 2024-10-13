import NextAuth from "next-auth";
import Github, { GithubProfile } from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { Pool } from "pg";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      githubUsername?: string;
      googleAccountId?: string;
    };
    accessToken: string;
  }
  interface User {
    id: string;
    username: string;
    githubUsername?: string;
    googleAccountId?: string;
  }
}


const pool = new Pool({
  host: process.env.NEXT_PUBLIC_DB_HOST,
  port: parseInt(process.env.NEXT_PUBLIC_DB_PORT || "5432"),
  user: process.env.NEXT_PUBLIC_DB_USER,
  password: process.env.NEXT_PUBLIC_DB_PASSWORD,
  database: process.env.NEXT_PUBLIC_DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

// const handler = NextAuth({
//   providers: [
//     Google({
//       clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
//       clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? "",
//     }),
//     Github({
//       clientId: "Ov23liMRAfjQ8vbmGNdK",
//       clientSecret: "3be85463ce1c9b10241fd3de910c4bd3b8bec214", //process.env.GITHUB_SECRET ?? "",
//       authorization: {
//         params: {
//           scope: "read:user user:email repo",
//         },
//       },
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account, profile }) {
//       if (account?.provider === "google") {
//         try {
//           const { rows } = await pool.query(
//             "INSERT INTO users (email, username, google_account_id) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET username = $2, google_account_id = $3 RETURNING *",
//             [user.email, user.name, account.providerAccountId]
//           );
//           account.id = rows[0].id;
//           account.name = rows[0].username;
//           account.googleAccountId = rows[0].google_account_id;
//           return true;
//         } catch (error) {
//           console.error("Error upserting user:", error);
//           return false;
//         }
//       } else if (account?.provider === "github") {
//         try {
//           const githubProfile = profile as GithubProfile
//           const { rows } = await pool.query(
//             "SELECT * FROM users WHERE email = $1",
//             [user.email]
//           );
//           if (rows.length === 0) {
//             return false; // User must sign in with Google first
//           }
//           await pool.query(
//             "INSERT INTO github_accounts (github_id, github_username, github_pfp, user_id) VALUES ($1, $2, $3, $4) ON CONFLICT (github_id) DO UPDATE SET github_username = $2, github_pfp = $3",
//             [account.providerAccountId, profile?.name, profile?.image, rows[0].id]
//           );
//           await pool.query(
//             "UPDATE users SET github_username = $1 WHERE id = $2",
//             [githubProfile?.login, rows[0].id]
//           );
//           user.id = rows[0].id;
//           user.username = rows[0].username;
//           user.githubUsername = githubProfile?.login;
//           return true;
//         } catch (error) {
//           console.error("Error linking GitHub account:", error);
//           return false;
//         }
//       }
//       return false;
//     },
//     async jwt({ token, user, account }) {
//       // console.log('account in the jwt callback', account)
//       // if (user) {
//       //   token.id = user.id;
//       //   token.username = user.username;
//       //   token.githubUsername = user.githubUsername;
//       //   token.googleAccountId = user.googleAccountId;
//       // }
//       // if (account && account.provider === 'github') {
//       //   token.accessToken = account.access_token;
//       // }
//       // return token;
//       console.log('account in the jwt callback', account)
//       if (user) {
//         token.id = user.id;
//         token.username = user.username;
//         token.githubUsername = user.githubUsername;
//         token.googleAccountId = user.googleAccountId;
//       }
//       if (account) {
//         token.accessToken = account.access_token;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//     //   session.user.id = token.id as string;
//     //   session.user.username = token.username as string;
//     //   session.user.githubUsername = token.githubUsername as string | undefined;
//     //   session.user.googleAccountId = token.googleAccountId as string | undefined;
//     //   if (session.accessToken) {
//     //     console.log('access token in the session', session.accessToken)
//     //     session.accessToken = token.accessToken as string;
//     //   } else {
//     //     console.log('no access token in the session')
//     // }
//     //   return session;
//     session.user.id = token.id as string;
//     session.user.username = token.username as string;
//     session.user.githubUsername = token.githubUsername as string | undefined;
//     session.user.googleAccountId = token.googleAccountId as string | undefined;
//     session.accessToken = token.accessToken as string;
//     console.log('session in the session callback', session)
//     return session;
//     },
//   },
//   pages: {
//     signIn: "/auth/signin",
//   },
// });

import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// export { handler as GET, handler as POST };
