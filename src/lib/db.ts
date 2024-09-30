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

export default pool;