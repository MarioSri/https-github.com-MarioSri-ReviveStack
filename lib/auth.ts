"use client"

import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"

export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// Sign up with email and password
export async function signUp(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  return { data, error }
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

// Sign in with Google
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  return { data, error }
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// Get user profile with proper error handling
export async function getUserProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()

    if (error) {
      console.error("Error fetching profile:", error)
      return null
    }

    // If no profile exists, create one
    if (!data) {
      const user = await getCurrentUser()
      if (user) {
        const newProfile = await createUserProfile(user.id, user.email, user.user_metadata?.full_name)
        return newProfile
      }
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getUserProfile:", error)
    return null
  }
}

// Create user profile
export async function createUserProfile(
  userId: string,
  email: string | null,
  fullName?: string,
): Promise<Profile | null> {
  try {
    const profileData = {
      id: userId,
      email: email,
      full_name: fullName || null,
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("profiles").insert([profileData]).select().single()

    if (error) {
      console.error("Error creating profile:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in createUserProfile:", error)
    return null
  }
}

// Update user profile
export async function updateUserProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single()

  return { data, error }
}

// Check if user is authenticated
export function useAuth() {
  return supabase.auth.onAuthStateChange((event, session) => {
    return { event, session, user: session?.user || null }
  })
}
