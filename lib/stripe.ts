import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

/**
 * Formats an amount in cents for Stripe
 * @param amount Amount in dollars
 * @returns Amount in cents for Stripe
 */
export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100)
}

export async function createConnectedAccount(userId: string, email: string) {
  try {
    const account = await stripe.accounts.create({
      type: "express",
      email,
      metadata: { userId },
    })

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/settings`,
      return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/settings?connected=true`,
      type: "account_onboarding",
    })

    return { account, accountLink }
  } catch (error) {
    console.error("Error creating Stripe connected account:", error)
    throw new Error("Failed to create Stripe connected account")
  }
}

export async function createEscrowPayment(amount: number, sellerId: string, metadata: Record<string, string>) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(amount), // Use the formatAmountForStripe function here
      currency: "usd",
      transfer_data: {
        destination: sellerId,
        amount: formatAmountForStripe(amount * 0.9), // 90% to seller after 10% commission
      },
      metadata,
      capture_method: "manual", // Hold funds in escrow
    })

    return paymentIntent
  } catch (error) {
    console.error("Error creating escrow payment:", error)
    throw new Error("Failed to create escrow payment")
  }
}

export async function captureEscrowPayment(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId)
    return paymentIntent
  } catch (error) {
    console.error("Error capturing escrow payment:", error)
    throw new Error("Failed to capture escrow payment")
  }
}
