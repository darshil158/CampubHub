import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session, user: session?.user || null }),
  setLoading: (isLoading) => set({ isLoading }),
  
  initialize: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      set({ session, user: session?.user || null, isLoading: false })
      
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user || null })
      })
    } catch (error) {
      console.error('Error fetching session:', error)
      set({ isLoading: false })
    }
  },
  
  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null })
  }
}))
