import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create test users
  const hashedPassword = await bcrypt.hash("password123", 12)

  const seller = await prisma.user.upsert({
    where: { email: "seller@example.com" },
    update: {},
    create: {
      email: "seller@example.com",
      name: "John Seller",
      username: "johnseller",
      password: hashedPassword,
      reputation_score: 4.8,
    },
  })

  const buyer = await prisma.user.upsert({
    where: { email: "buyer@example.com" },
    update: {},
    create: {
      email: "buyer@example.com",
      name: "Jane Buyer",
      username: "janebuyer",
      password: hashedPassword,
      reputation_score: 4.5,
    },
  })

  // Create sample projects
  const projects = [
    {
      title: "TaskFlow Pro",
      description:
        "Advanced project management tool with AI-powered insights. Built with React and Node.js. Includes user authentication, real-time collaboration, and analytics dashboard.",
      github_url: "https://github.com/example/taskflow-pro",
      demo_url: "https://demo.taskflowpro.com",
      price: 15000,
      tech_stack: ["React", "Node.js", "MongoDB", "Socket.io"],
      stars: 1247,
      forks: 89,
      health_score: 85,
      last_commit_date: new Date("2023-08-15"),
    },
    {
      title: "EcoTracker",
      description:
        "Carbon footprint tracking app for individuals and businesses. Features include expense tracking, sustainability reports, and goal setting.",
      github_url: "https://github.com/example/ecotracker",
      price: 8500,
      tech_stack: ["Vue.js", "Express", "PostgreSQL"],
      stars: 892,
      forks: 45,
      health_score: 78,
      last_commit_date: new Date("2023-10-22"),
    },
    {
      title: "CodeReview Bot",
      description:
        "Automated code review tool that integrates with GitHub. Uses machine learning to detect code smells and suggest improvements.",
      github_url: "https://github.com/example/codereview-bot",
      price: 25000,
      tech_stack: ["Python", "TensorFlow", "GitHub API"],
      stars: 2156,
      forks: 234,
      health_score: 92,
      last_commit_date: new Date("2023-05-03"),
    },
  ]

  for (const projectData of projects) {
    await prisma.project.upsert({
      where: { github_url: projectData.github_url },
      update: {},
      create: {
        ...projectData,
        seller_id: seller.id,
      },
    })
  }

  console.log("✅ Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
