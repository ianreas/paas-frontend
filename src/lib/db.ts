"use server"
import { Pool } from 'pg';

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

export async function getGithubAccount(userId: string) {
  const { rows } = await pool.query(
    'SELECT * FROM github_accounts WHERE user_id = $1',
    [userId]
  );
  return rows[0] || null;
}

// export async function linkGithubAccount(userId: string, githubId: string, githubUsername: string, githubPfp: string) {
//   await pool.query(
//     'INSERT INTO github_accounts (github_id, github_username, github_pfp, user_id) VALUES ($1, $2, $3, $4) ON CONFLICT (github_id) DO UPDATE SET github_username = $2, github_pfp = $3',
//     [githubId, githubUsername, githubPfp, userId]
//   );
// }

export async function linkGithubAccount(userId: string, githubId: string, githubUsername: string, githubPfp: string) {
    await pool.query(
      'INSERT INTO github_accounts (github_id, github_username, github_pfp, user_id) VALUES ($1, $2, $3, $4) ON CONFLICT (github_id) DO UPDATE SET github_username = $2, github_pfp = $3',
      [githubId, githubUsername, githubPfp, userId]
    );
  }