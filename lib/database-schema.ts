// Database schema types for ReviveStack

export type User = {
  id: string
  email: string
  username: string
  github_id?: string
  avatar_url?: string
  bio?: string
  reputation_score: number
  stripe_account_id?: string
  created_at: Date
  updated_at: Date
}

export type Project = {
  id: string
  seller_id: string
  title: string
  description: string
  github_url: string
  demo_url?: string
  price: number
  status: "active" | "sold" | "withdrawn"
  tech_stack: string[]
  last_commit_date?: Date
  stars: number
  forks: number
  ai_valuation?: Record<string, any>
  health_score?: number
  created_at: Date
  updated_at: Date
}

export type Transaction = {
  id: string
  project_id: string
  buyer_id: string
  seller_id: string
  amount: number
  commission: number
  status: "pending" | "escrowed" | "completed" | "disputed"
  stripe_payment_intent_id?: string
  escrow_release_date?: Date
  created_at: Date
  updated_at: Date
}

export type Review = {
  id: string
  transaction_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment?: string
  created_at: Date
}
