import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simple health check without any database dependency during build
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
      services: {
        database: "not_checked",
        auth: "configured",
        stripe: "configured",
      },
    }

    // Only check database in production runtime, not during build
    if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
      try {
        // Use Supabase for health check instead of Prisma
        const { supabase } = await import("@/lib/supabase")
        const { data, error } = await supabase.from("projects").select("count").limit(1)

        if (error) {
          health.services.database = "error"
          health.status = "degraded"
        } else {
          health.services.database = "connected"
        }
      } catch (error) {
        health.services.database = "disconnected"
        health.status = "degraded"
      }
    }

    return NextResponse.json(health)
  } catch (error) {
    console.error("Health check failed:", error)

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        services: {
          database: "error",
          auth: "unknown",
          stripe: "unknown",
        },
      },
      { status: 500 },
    )
  }
}
