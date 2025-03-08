// lib/auth.ts
// import { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google"

// export const authOptions: NextAuthOptions = {
//     // figure out the process.env later
//   providers: [
//     GoogleProvider({
//       clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
//       clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? "",
//     }),
//     // Add more providers here
//   ],
//   // Add any other NextAuth.js configurations here
// };

// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider, { GithubProfile } from "next-auth/providers/github";
import { Pool } from "pg";
import { NextApiRequest, NextApiResponse } from "next";
import { AdapterUser } from "next-auth/adapters";

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

// Database connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GithubProvider({
      clientId: "Ov23liC1xIBbylN1Rxt3", //process.env.GITHUB_CLIENT_ID ??,
      clientSecret: "9e1a27017ed7b774dd6f9b0a2bb644b439b4b615",
      //    process.env.GITHUB_CLIENT_SECRET ??

      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const { rows } = await pool.query(
            "INSERT INTO users (email, username, google_account_id) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET username = $2, google_account_id = $3 RETURNING *",
            [user.email, user.name, account.providerAccountId]
          );
          user.id = rows[0].id;
          user.username = rows[0].username;
          user.googleAccountId = rows[0].google_account_id;
          return true;
        } catch (error) {
          console.error("Error upserting user:", error);
          return false;
        }
      } else if (account?.provider === "github") {
        try {
          const githubProfile = profile as GithubProfile;
          const { rows } = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [user.email]
          );
          if (rows.length === 0) {
            return false; // User must sign in with Google first
          }
          await pool.query(
            "INSERT INTO github_accounts (github_id, github_username, github_pfp, user_id) VALUES ($1, $2, $3, $4) ON CONFLICT (github_id) DO UPDATE SET github_username = $2, github_pfp = $3",
            [
              account.providerAccountId,
              profile?.name,
              profile?.image,
              rows[0].id,
            ]
          );
          await pool.query(
            "UPDATE users SET github_username = $1 WHERE id = $2",
            [githubProfile?.login, rows[0].id]
          );
          user.id = rows[0].id;
          user.username = rows[0].username;
          user.githubUsername = githubProfile?.login;
          return true;
        } catch (error) {
          console.error("Error linking GitHub account:", error);
          return false;
        }
      }
      return false;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.githubUsername = user.githubUsername;
        token.googleAccountId = user.googleAccountId;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      session.user.githubUsername = token.githubUsername as string | undefined;
      session.user.googleAccountId = token.googleAccountId as
        | string
        | undefined;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
