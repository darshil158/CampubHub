import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Loader2, AlertCircle, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { Badge } from "../components/ui/Badge"
import { Card3D } from "../components/ui/Card3D"
import { Canvas3D } from "../components/ui/Canvas3D"
import { BrandLogo, BrandSymbol } from "../components/ui/BrandLogo"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "../store/useAuthStore"
import { api } from "../services/api"

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const email = e.target.email.value
    const password = e.target.password.value

    try {
      // 1. Try Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (!error && data?.session) {
        navigate('/marketplace')
        return
      }

      // 2. Try Local / Demo Student Accounts
      const localProfile = await api.auth.loginWithEmail(email, password)
      if (localProfile) {
        await useAuthStore.getState().switchStudent(localProfile.id)
        navigate('/marketplace')
        return
      }

      if (error) throw error
    } catch (err) {
      // Check if email matches any demo student profile
      const demoMatch = await api.auth.findProfileByEmail(email)
      if (demoMatch) {
        await useAuthStore.getState().switchStudent(demoMatch.id)
        navigate('/marketplace')
        return
      }
      setError(err.message || "Failed to sign in. Please verify your credentials or use 1-click Demo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden bg-[#060911]">
      {/* 3D Canvas Background & Cyber Perspective */}
      <Canvas3D className="opacity-50" count={45} interactive={true} />
      <div className="absolute inset-0 perspective-grid pointer-events-none opacity-30" />

      {/* Ambient Volumetric Backlights */}
      <div className="ambient-aurora w-[500px] h-[350px] bg-cyan-500/20 top-1/4 left-1/4 pointer-events-none" />
      <div className="ambient-aurora w-[600px] h-[400px] bg-purple-600/20 bottom-1/4 right-1/4 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <Card3D neonGlow="cyan" maxTilt={8} className="p-8 sm:p-10 flex flex-col items-center bg-[#0B0F1C]/90 backdrop-blur-2xl border-white/15">
          <div className="mb-6 flex flex-col items-center">
            <BrandLogo size="lg" linkTo="/" showWordmark={true} showBadge={false} />
            <Badge variant="verified" size="xs" className="mt-3">
              Institutional Sign-In
            </Badge>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-center mb-1.5 text-foreground">Welcome back</h1>
          <p className="text-muted-foreground text-xs sm:text-sm mb-6 text-center leading-relaxed">
            Enter your credentials to access your Quadly campus account.
          </p>

          {error && (
            <div className="w-full mb-6 p-3.5 bg-red-500/10 text-red-600 dark:text-red-400 text-xs sm:text-sm rounded-xl flex items-center gap-2.5 border border-red-500/20">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-foreground/80">University Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@university.edu"
                leftIcon={<Mail size={16} />}
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-foreground/80">Password</Label>
                <a href="#forgot" className="text-xs text-primary hover:underline font-medium">Forgot?</a>
              </div>
              <Input
                id="password"
                type="password"
                leftIcon={<Lock size={16} />}
                required
              />
            </div>

            <Button
              type="submit"
              variant="glow"
              className="w-full mt-2 font-semibold shadow-md"
              loading={isLoading}
            >
              Sign In to Campus
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-semibold">
              Create an account
            </Link>
          </div>

          {/* Quick 1-Click Demo Login Panel */}
          <div className="w-full mt-6 pt-5 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Instant Demo Student Sign-In
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/20 font-semibold">
                1-Click
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "usr_aarav", name: "Aarav Patel", role: "Seller & CS '26", badge: "Trader" },
                { id: "usr_priya", name: "Priya Sharma", role: "Tutor & EE '25", badge: "Tutor" },
                { id: "usr_rohan", name: "Rohan Gupta", role: "Renter & ME '27", badge: "Renter" },
                { id: "usr_ananya", name: "Ananya Iyer", role: "Roommate & Design", badge: "Sublet" }
              ].map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={async () => {
                    setIsLoading(true)
                    await useAuthStore.getState().switchStudent(p.id)
                    navigate('/marketplace')
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{p.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">{p.badge}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 truncate">{p.role}</div>
                </button>
              ))}
            </div>
          </div>
        </Card3D>
      </motion.div>
    </div>
  )
}
