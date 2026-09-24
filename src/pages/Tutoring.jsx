import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Star, BookOpen, GraduationCap, Plus, MessageSquare, Calendar, ShieldCheck } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardContent } from "../components/ui/Card"
import { Badge, VerifiedBadge } from "../components/ui/Badge"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "../store/useAuthStore"

export default function Tutoring() {
  const [tutors, setTutors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuthStore()

  useEffect(() => {
    fetchTutors()
  }, [])

  const fetchTutors = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('tutors')
        .select('*, profiles(full_name, avatar_url, university)')
      
      if (error && error.code !== '42P01') throw error
      setTutors(data || [])
    } catch (err) {
      console.error("Error fetching tutors:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTutors = tutors.filter(t => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    const nameMatch = t.profiles?.full_name?.toLowerCase().includes(q)
    const subjectMatch = t.subjects?.some(s => s.toLowerCase().includes(q))
    return nameMatch || subjectMatch
  })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="verified" size="xs">Quadly Academics</Badge>
            <span className="text-xs text-muted-foreground font-medium">• Verified Peer Mentors</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Peer Tutoring Network</h1>
          <p className="text-muted-foreground text-sm mt-1">Connect with verified high-achieving classmates to ace exams and master tough coursework.</p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-2.5">
          <div className="relative w-full md:w-72">
            <Input 
              placeholder="Search subject or tutor..." 
              leftIcon={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {user && (
            <Button variant="glow" className="shrink-0 gap-1.5">
              <Plus size={16} />
              <span>Become Tutor</span>
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-56 rounded-2xl bg-muted/50 animate-pulse border border-border/60"></div>
          ))}
        </div>
      ) : filteredTutors.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTutors.map((tutor) => (
            <motion.div key={tutor.id} variants={item}>
              <Card interactive={true} className="h-full">
                <CardContent className="p-6 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-secondary overflow-hidden shrink-0 border border-border/80 relative">
                        {tutor.profiles?.avatar_url ? (
                          <img src={tutor.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                            {tutor.profiles?.full_name?.charAt(0) || 'T'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-base text-foreground truncate">{tutor.profiles?.full_name}</h3>
                          <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{tutor.profiles?.university || 'Campus Peer'}</p>
                        <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 mt-1">
                          <Star size={13} className="fill-current" />
                          <span>4.9 (24 student sessions)</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-black text-xl text-foreground">${tutor.hourly_rate}</span>
                        <span className="text-[11px] text-muted-foreground block font-medium">/ hr</span>
                      </div>
                    </div>
                    
                    <div className="mt-5">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Subject Mastery</div>
                      <div className="flex flex-wrap gap-1.5">
                        {tutor.subjects?.map(sub => (
                          <Badge key={sub} variant="outline" size="xs" className="font-medium">
                            {sub}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-border/50 grid grid-cols-2 gap-2">
                    <Button variant="default" size="sm" className="w-full gap-1.5">
                      <Calendar size={14} />
                      <span>Book Session</span>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full gap-1.5">
                      <MessageSquare size={14} />
                      <span>Message</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-border/80 bg-card/30 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
            <GraduationCap size={28} />
          </div>
          <h3 className="text-xl font-bold mb-1.5">No tutors listed currently</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
            Have you mastered a subject with an A/A+? Share your knowledge and earn flexible hourly pay right on campus.
          </p>
          {user && (
            <Button variant="glow" className="gap-2">
              <Plus size={16} />
              <span>Apply as a Campus Tutor</span>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
