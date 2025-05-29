const fs = require("fs")
const path = require("path")

console.log("🚀 Setting up ReviveStack development environment...\n")

// Check if .env.local exists
const envPath = path.join(process.cwd(), ".env.local")
if (!fs.existsSync(envPath)) {
  console.log("📝 Creating .env.local template...")

  const envTemplate = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/revivestack"

# NextAuth.js
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GITHUB_TOKEN="your-github-personal-access-token"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OpenAI
OPENAI_API_KEY="sk-..."

# App Configuration
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_URL="http://localhost:3000"
`

  fs.writeFileSync(envPath, envTemplate)
  console.log("✅ .env.local template created")
  console.log("📋 Please fill in your actual environment variables\n")
} else {
  console.log("✅ .env.local already exists\n")
}

// Check if node_modules exists
if (!fs.existsSync(path.join(process.cwd(), "node_modules"))) {
  console.log("📦 Installing dependencies...")
  console.log("Run: npm install\n")
} else {
  console.log("✅ Dependencies already installed\n")
}

console.log("🎯 Next steps:")
console.log("1. Fill in your environment variables in .env.local")
console.log("2. Set up your database (PostgreSQL or Supabase)")
console.log("3. Run: npx prisma db push")
console.log("4. Run: npx prisma generate")
console.log("5. Run: npm run dev")
console.log("\n🔗 Useful links:")
console.log("- GitHub OAuth: https://github.com/settings/developers")
console.log("- Stripe Dashboard: https://dashboard.stripe.com")
console.log("- OpenAI API: https://platform.openai.com/api-keys")
console.log("- Supabase: https://supabase.com/dashboard")
