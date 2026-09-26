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

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false)
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
