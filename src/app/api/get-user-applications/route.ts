import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  console.log('the full session object' + JSON.stringify(session, null, 2))

  if (!session?.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session?.user?.id?.toString();

  try {
    const query = `
        SELECT * FROM applications
        WHERE user_id = $1`;

    const values = [userId];

    const result = await pool.query(query, values);

    const applications = result.rows;
    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Error fetching user applications", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
