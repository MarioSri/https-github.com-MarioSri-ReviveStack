import { z } from "zod"

export const createProjectSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(10).max(2000),
  github_url: z.string().url().includes("github.com"),
  demo_url: z.string().url().optional(),
  price: z.number().min(0).max(100000),
  tech_stack: z.array(z.string()).max(20),
})

export const validateGitHubUrl = (url: string) => {
  const githubPattern = /^https:\/\/github\.com\/[\w\-.]+\/[\w\-.]+\/?$/
  return githubPattern.test(url)
}

export const searchProjectsSchema = z.object({
  q: z.string().optional(),
  tech: z.array(z.string()).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  minStars: z.number().min(0).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(50).optional(),
})
