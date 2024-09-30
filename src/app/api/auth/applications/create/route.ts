import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    return NextResponse.json(
      { message: "Application created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
