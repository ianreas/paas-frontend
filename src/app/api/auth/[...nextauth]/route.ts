import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { Pool } from "pg";

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

// const pool = new Pool({
//   connectionString: process.env.NEXT_PUBLIC_DATABASE_URL,

// });


const pool = new Pool({
  host: process.env.NEXT_PUBLIC_DB_HOST,
  port: parseInt(process.env.NEXT_PUBLIC_DB_PORT || '5432'),
  user: process.env.NEXT_PUBLIC_DB_USER,
  password: process.env.NEXT_PUBLIC_DB_PASSWORD,
  database: process.env.NEXT_PUBLIC_DB_NAME,
  ssl: {
    rejectUnauthorized: false // Use this only if you're having SSL issues and understand the security implications
  }
});

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? "",
    }),
    Github({
      clientId: "Ov23liMRAfjQ8vbmGNdK",
      clientSecret: "3be85463ce1c9b10241fd3de910c4bd3b8bec214", //process.env.GITHUB_SECRET ?? "",
      authorization: {
        params: {
          scope: "read:user repo",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('database connection string', process.env.NEXT_PUBLIC_DATABASE_URL)
      if (account?.provider === "google") {
        try {
          const { rows } = await pool.query(
            'INSERT INTO users (username, email) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET username = $1 RETURNING *',
            [user.name, user.email]
          );
          console.log("User upserted:", rows[0]);
        } catch (error) {
          console.error("Error upserting user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        if (account.provider === "github") {
          token.githubConnected = true;
          token.githubUsername = profile?.name; // GitHub username is in profile.login, not profile.name
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
    signIn: "/auth/signin",
  },
});

export { handler as GET, handler as POST };
