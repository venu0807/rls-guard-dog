import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Check if Supabase credentials are properly configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey || 
      supabaseUrl === 'your_supabase_project_url' || 
      supabaseKey === 'your_supabase_anon_key') {
    // Return a mock client for demo purposes
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
        signInWithPassword: async () => ({ data: null, error: new Error('Demo mode: No Supabase configured') }),
        signUp: async () => ({ data: null, error: new Error('Demo mode: No Supabase configured') })
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: new Error('Demo mode: No Supabase configured') })
          })
        })
      })
    } as any
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  )
}