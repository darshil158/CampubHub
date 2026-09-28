import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { api } from '../services/api'

export const useAuthStore = create((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session, user: session?.user || null }),
  setLoading: (isLoading) => set({ isLoading }),
  
  initialize: async () => {
    try {
      // 1. Try Supabase Auth
      const { data: { session }, error } = await supabase.auth.getSession()
      if (!error && session?.user) {
        set({ session, user: session.user, isLoading: false })
        
        supabase.auth.onAuthStateChange((_event, session) => {
          set({ session, user: session?.user || null })
        })
        return
      }

      // 2. Check local authenticated user (only if explicitly logged in)
      const localUser = await api.auth.getCurrentUser()
      if (localUser) {
        set({
          session: null,
          user: {
            id: localUser.id,
            email: localUser.email,
            user_metadata: {
              full_name: localUser.full_name,
              university: localUser.university,
              avatar_url: localUser.avatar_url,
              bio: localUser.bio
            },
            created_at: localUser.joined_date || "2024-08-15"
          },
          isLoading: false
        })
        return
      }

      // Default: user is logged out when first visiting the site
      set({ session: null, user: null, isLoading: false })
    } catch (error) {
      console.warn('Session init:', error)
      set({ session: null, user: null, isLoading: false })
    }
  },
  
  signInWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut()
    } catch {
      // ignore
    }
    await api.auth.setCurrentUser(null)
    set({ user: null, session: null })
  },

  switchStudent: async (studentId) => {
    if (!studentId) {
      await api.auth.setCurrentUser(null)
      set({ user: null, session: null })
      return
    }
    const profile = await api.auth.setCurrentUser(studentId)
    if (!profile) {
      set({ user: null, session: null })
      return
    }
    set({
      user: {
        id: profile.id,
        email: profile.email,
        user_metadata: {
          full_name: profile.full_name,
          university: profile.university,
          avatar_url: profile.avatar_url,
          bio: profile.bio
        },
        created_at: profile.joined_date || "2024-08-15"
      }
    })
  }
}))
