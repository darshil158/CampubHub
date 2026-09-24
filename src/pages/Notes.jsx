import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Download, FileText, Upload, Sparkles, BookOpen, ArrowDownToLine, Eye } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardContent } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "../store/useAuthStore"

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuthStore()

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false })

      if (error && error.code !== '42P01') throw error
      setNotes(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredNotes = notes.filter(n => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      n.title?.toLowerCase().includes(q) ||
      n.subject?.toLowerCase().includes(q) ||
      n.course_code?.toLowerCase().includes(q)
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
            <Badge variant="verified" size="xs">Quadly Study</Badge>
            <span className="text-xs text-muted-foreground font-medium">• Open Course Summaries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Notes & Study Guides</h1>
          <p className="text-muted-foreground text-sm mt-1">Crowdsourced lecture cheat sheets, midterm outlines, and exam review notes.</p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-2.5">
          <div className="relative w-full md:w-72">
            <Input 
              placeholder="Search subject or course code..." 
              leftIcon={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {user && (
            <Button variant="glow" className="shrink-0 gap-1.5">
              <Upload size={16} />
              <span>Upload Notes</span>
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="h-44 rounded-2xl bg-muted/50 animate-pulse border border-border/60"></div>
          ))}
        </div>
      ) : filteredNotes.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {filteredNotes.map(note => (
            <motion.div key={note.id} variants={item}>
              <Card interactive={true} className="h-full group">
                <CardContent className="p-5 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="bg-primary/10 text-primary p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                        <FileText size={22} />
                      </div>
                      <Badge variant="outline" size="xs">
                        {note.subject || 'Course Guide'}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-base line-clamp-2 leading-snug group-hover:text-primary transition-colors mb-1">
                      {note.title}
                    </h3>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-border/50 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground truncate font-medium max-w-[120px]">
                      By {note.profiles?.full_name || 'Classmate'}
                    </span>
                    <Button variant="ghost" size="icon-sm" className="text-primary hover:bg-primary/10 rounded-lg">
                      <ArrowDownToLine size={16} />
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
            <FileText size={28} />
          </div>
          <h3 className="text-xl font-bold mb-1.5">No study notes found</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
            Be the campus legend and upload high-yield lecture summaries or test prep guides for your peers!
          </p>
          {user && (
            <Button variant="glow" className="gap-2">
              <Upload size={16} />
              <span>Upload Notes to Campus</span>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
