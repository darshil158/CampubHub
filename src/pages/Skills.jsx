import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Wrench, HandHeart, Sparkles, MessageCircle, ArrowRight } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "../store/useAuthStore"

export default function Skills() {
  const [skills, setSkills] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuthStore()
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchSkills()
  }, [filterType])

  const fetchSkills = async () => {
    setIsLoading(true)
    try {
      let query = supabase
        .from('skills')
        .select('*, profiles(full_name, avatar_url)')
        .order('created_at', { ascending: false })

      if (filterType !== 'all') {
        query = query.eq('type', filterType)
      }

      const { data, error } = await query
      if (error && error.code !== '42P01') throw error
      setSkills(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredSkills = skills.filter(s => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      s.title?.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q) ||
      s.category?.toLowerCase().includes(q)
    )
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
            <Badge variant="verified" size="xs">Quadly Swap</Badge>
            <span className="text-xs text-muted-foreground font-medium">• Campus Talent Exchange</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Skills Exchange</h1>
          <p className="text-muted-foreground text-sm mt-1">Swap creative and technical talents: coding, languages, video editing, design & more.</p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-2.5">
          <div className="relative w-full md:w-72">
            <Input 
              placeholder="Search skills, talents..." 
              leftIcon={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {user && (
            <Button variant="glow" className="shrink-0 gap-1.5">
              <Plus size={16} />
              <span>Post Skill</span>
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { id: 'all', label: 'All Talents' },
          { id: 'offer', label: 'Offering Skill' },
          { id: 'request', label: 'Seeking Help' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === tab.id
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                : 'bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => <div key={n} className="h-48 rounded-2xl bg-muted/50 animate-pulse border border-border/60"></div>)}
        </div>
      ) : filteredSkills.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSkills.map(skill => (
            <motion.div key={skill.id} variants={item}>
              <Card interactive={true} className="h-full flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2.5">
                    <Badge
                      variant={skill.type === 'offer' ? 'verified' : 'default'}
                      size="sm"
                      icon={skill.type === 'offer' ? <HandHeart size={13} /> : <Wrench size={13} />}
                    >
                      {skill.type === 'offer' ? 'Offering Talent' : 'Looking for Talent'}
                    </Badge>
                    {skill.category && (
                      <span className="text-xs text-muted-foreground font-medium">{skill.category}</span>
                    )}
                  </div>
                  <CardTitle className="text-xl leading-snug">{skill.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">{skill.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/50">
                    <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center overflow-hidden font-bold text-xs shrink-0">
                      {skill.profiles?.avatar_url ? (
                        <img src={skill.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        skill.profiles?.full_name?.charAt(0) || 'S'
                      )}
                    </div>
                    <div className="text-xs font-semibold flex-1 truncate text-foreground/90">{skill.profiles?.full_name || 'Campus Student'}</div>
                    <Button variant="outline" size="xs" className="gap-1">
                      <MessageCircle size={12} />
                      <span>Swap</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-border/80 bg-card/30 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Wrench size={28} />
          </div>
          <h3 className="text-xl font-bold mb-1.5">No skill trades found</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
            Have a talent or want to learn something new without paying expensive tutor fees? Barter skills with a classmate.
          </p>
          {user && (
            <Button variant="glow" className="gap-2">
              <Plus size={16} />
              <span>Post a Skill Offer or Request</span>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
