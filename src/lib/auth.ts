import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Database } from '@/types/database'

export type Profile = Database['public']['Tables']['profiles']['Row']

export async function getCurrentUser() {
  const supabase = await createClient()
  
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return null
  }

  return user
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    // In demo mode, return a mock profile
    if (error.message?.includes('Demo mode')) {
      return {
        id: 'demo-user-id',
        full_name: 'Demo User',
        email: 'demo@example.com',
        role: 'student' as const,
        school_id: 'demo-school-id',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }
    console.error('Error fetching profile:', error)
    return null
  }

  return profile
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/auth/login')
  }
  return user
}

export async function requireProfile() {
  const profile = await getCurrentProfile()
  if (!profile) {
    redirect('/auth/login')
  }
  return profile
}

export async function requireTeacher() {
  const profile = await requireProfile()
  if (!['teacher', 'head_teacher'].includes(profile.role)) {
    redirect('/auth/unauthorized')
  }
  return profile
}

export async function requireHeadTeacher() {
  const profile = await requireProfile()
  if (profile.role !== 'head_teacher') {
    redirect('/auth/unauthorized')
  }
  return profile
}