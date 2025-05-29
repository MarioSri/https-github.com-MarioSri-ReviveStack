import Stripe from "stripe"

// Initialize Stripe with the secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16", // Use the latest API version
})

// Format price for Stripe (convert to cents)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100)
}
