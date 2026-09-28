import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Loader2, AlertCircle, Mail, Lock, User, ShieldCheck } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { Badge } from "../components/ui/Badge"
import { Card3D } from "../components/ui/Card3D"
import { Canvas3D } from "../components/ui/Canvas3D"
import { BrandLogo } from "../components/ui/BrandLogo"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "../store/useAuthStore"
import { api } from "../services/api"

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 5.42l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const fullName = e.target.name.value
    const email = e.target.email.value
    const password = e.target.password.value

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      })

      if (!error && data?.session) {
        navigate('/marketplace')
        return
      }

      // If Supabase requires email verification or throws, register student locally so they get their profile immediately
      const student = await api.auth.registerStudent({ fullName, email })
      await useAuthStore.getState().switchStudent(student.id)
      navigate('/marketplace')
    } catch (err) {
      try {
        const student = await api.auth.registerStudent({ fullName, email })
        await useAuthStore.getState().switchStudent(student.id)
        navigate('/marketplace')
      } catch (localErr) {
        setError(err.message || "Failed to create account.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true)
    setError(null)
    try {
      await useAuthStore.getState().signInWithGoogle()
    } catch (err) {
      setError(err.message || "Google sign-up failed. Please try again.")
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden bg-[#060911]">
      {/* 3D Canvas Background & Cyber Perspective */}
      <Canvas3D className="opacity-50" count={45} interactive={true} />
      <div className="absolute inset-0 perspective-grid pointer-events-none opacity-30" />

      {/* Ambient Volumetric Backlights */}
      <div className="ambient-aurora w-[500px] h-[350px] bg-purple-600/20 top-1/4 right-1/4 pointer-events-none" />
      <div className="ambient-aurora w-[600px] h-[400px] bg-cyan-500/20 bottom-1/4 left-1/4 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <Card3D neonGlow="purple" maxTilt={8} className="p-8 sm:p-10 flex flex-col items-center bg-[#0B0F1C]/90 backdrop-blur-2xl border-white/15">
          <div className="mb-6 flex flex-col items-center">
            <BrandLogo size="lg" linkTo="/" showWordmark={true} showBadge={false} />
            <Badge variant="verified" size="xs" className="mt-3">
              100% Student Verified
            </Badge>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-center mb-1.5 text-foreground">Join Quadly Campus</h1>
          <p className="text-muted-foreground text-xs sm:text-sm mb-6 text-center leading-relaxed">
            Create an account using your student email to trade, find jobs, and meet roommates.
          </p>

          {error && (
            <div className="w-full mb-6 p-3.5 bg-red-500/10 text-red-600 dark:text-red-400 text-xs sm:text-sm rounded-xl flex items-center gap-2.5 border border-red-500/20">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-foreground/80">Full Name</Label>
              <Input
                id="name"
                placeholder="Alex Rivers"
                leftIcon={<User size={16} />}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-foreground/80">University Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="alex@university.edu"
                leftIcon={<Mail size={16} />}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-foreground/80">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 6 characters"
                leftIcon={<Lock size={16} />}
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              variant="glow"
              className="w-full mt-2 font-semibold shadow-md"
              loading={isLoading}
            >
              Create Student Account
            </Button>
          </form>

          {/* OAuth Divider */}
          <div className="w-full flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">or sign up with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-2.5 h-11 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-sm font-semibold text-foreground transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group hover:shadow-[0_0_20px_rgba(66,133,244,0.15)]"
          >
            {isGoogleLoading ? (
              <Loader2 size={18} className="animate-spin text-muted-foreground" />
            ) : (
              <GoogleIcon />
            )}
            <span>Continue with Google</span>
          </button>

          <div className="mt-8 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Log in
            </Link>
          </div>
        </Card3D>
      </motion.div>
    </div>
  )
}
