// Environment configuration and validation

export const env = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,

  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,

  // GitHub
  GITHUB_TOKEN: process.env.GITHUB_TOKEN!,

  // Application
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
}

// Validate required environment variables
export function validateEnv() {
  const requiredEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "GITHUB_TOKEN",
  ]

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`)
  }

  return true
}

// Helper to check if we're in production
export const isProduction = env.NODE_ENV === "production"
export const isDevelopment = env.NODE_ENV === "development"
