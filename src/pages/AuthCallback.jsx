import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Loader2 } from "lucide-react"

/**
 * AuthCallback handles the OAuth redirect from Supabase.
 * After Google signs the user in, Supabase redirects here with tokens in the URL hash.
 * We exchange them for a session, then redirect to the marketplace.
 */
export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error

        if (session) {
          navigate('/marketplace', { replace: true })
        } else {
          navigate('/login', { replace: true })
        }
      } catch (err) {
        console.error('OAuth callback error:', err)
        navigate('/login', { replace: true })
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center bg-[#060911]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 size={36} className="text-cyan-400 animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">Signing you in...</p>
      </div>
    </div>
  )
}
