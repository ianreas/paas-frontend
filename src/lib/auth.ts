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
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
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
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("Sign-in attempt:", {
        user,
        accountProvider: account?.provider,
        profileEmail: profile?.email,
        redirectUrl: process.env.NEXTAUTH_URL,
      });

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
          const githubProfile = profile as any;
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
    async jwt({ token, user, account, profile }) {
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
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
        (session.user as any).githubUsername = token.githubUsername;
        (session.user as any).googleAccountId = token.googleAccountId;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: true,
};
