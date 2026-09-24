import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { BookOpen, Loader2, AlertCircle } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { supabase } from "../lib/supabase"

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

      if (error) throw error
      
      // Successfully signed up. Assuming email confirmation is off for now, redirect.
      // If email confirmation is ON in Supabase, they will need to check their email.
      if (data.session) {
        navigate('/marketplace')
      } else {
        // If require email confirmation is enabled in Supabase project:
        setError("Account created! Please check your email to verify your account.")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center p-4 bg-muted/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border shadow-sm rounded-2xl p-8 flex flex-col items-center">
          <div className="bg-primary/10 p-3 rounded-xl mb-4">
            <BookOpen className="text-primary" size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Create an account</h1>
          <p className="text-muted-foreground text-sm mb-8 text-center">
            Join your college community today. Use your student email for faster verification.
          </p>

          {error && (
            <div className={`w-full mb-6 p-3 text-sm rounded-md flex items-start gap-2 border ${error.includes('check your email') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-100'}`}>
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                name="name"
                type="text" 
                placeholder="John Doe" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">College Email</Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                placeholder="you@college.edu" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password"
                type="password" 
                placeholder="Create a strong password" 
                required 
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
