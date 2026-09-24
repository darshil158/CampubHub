import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Loader2, AlertCircle, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { Badge } from "../components/ui/Badge"
import { BrandLogo, BrandSymbol } from "../components/ui/BrandLogo"
import { supabase } from "../lib/supabase"

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      // Successfully logged in
      navigate('/marketplace')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-to-b from-primary/5 via-background to-background relative overflow-hidden">
      {/* Ambient Backdrop Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-primary/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-card/85 backdrop-blur-xl border border-border/80 shadow-2xl rounded-3xl p-8 sm:p-10 flex flex-col items-center">
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

          <div className="mt-8 text-center text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-semibold">
              Create an account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
