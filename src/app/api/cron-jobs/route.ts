import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get application_id from URL params
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("application_id");

    if (!applicationId) {
      return new NextResponse(
        JSON.stringify({ error: "Application ID required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Verify user has access to this application
    const { rows: appRows } = await pool.query(
      "SELECT * FROM applications WHERE id = $1 AND user_id = $2",
      [applicationId, session.user.id]
    );

    if (appRows.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "Not authorized to access this application" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Fetch cron jobs
    const { rows } = await pool.query(
      "SELECT * FROM cron_jobs WHERE application_id = $1",
      [applicationId]
    );

    return new NextResponse(JSON.stringify({ cronJobs: rows }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching cron jobs:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
