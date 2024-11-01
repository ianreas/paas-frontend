import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  console.log("the full session object" + JSON.stringify(session, null, 2));

  if (!session?.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const applicationId = searchParams.get("application_id");

  try {
    const query = `
        SELECT * FROM cron_jobs
        WHERE application_id = $1`;

    const values = [applicationId];

    const result = await pool.query(query, values);

    const cronJobs = result.rows;
    return NextResponse.json({ cronJobs });
  } catch (error) {
    console.error("Error fetching cron jobs", error);
    return NextResponse.json(
      { error: "Failed to fetch cron jobs" },
      { status: 500 }
    );
  }
}
