import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  try {
    // Ping database with lightweight query
    await db.execute(sql`SELECT 1`);
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      latencyMs,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      uptimeSeconds: Math.floor(process.uptime()),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "degraded",
        database: "disconnected",
        error: err.message || "Database connection error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}

