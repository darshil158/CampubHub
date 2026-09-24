import { useState, useEffect } from "react"
import { Search, Star, BookOpen } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardContent } from "../components/ui/Card"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "../store/useAuthStore"

export default function Tutoring() {
  const [tutors, setTutors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tutoring Hub</h1>
          <p className="text-muted-foreground mt-1">Find expert peers to help you ace your classes.</p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input placeholder="Search subject or tutor..." className="pl-9" />
          </div>
          {user && <Button>Become a Tutor</Button>}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-48 rounded-xl bg-muted animate-pulse border border-border"></div>
          ))}
        </div>
      ) : tutors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((tutor) => (
            <Card key={tutor.id} className="hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-secondary overflow-hidden shrink-0 border border-border">
                    {tutor.profiles?.avatar_url ? (
                      <img src={tutor.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                        {tutor.profiles?.full_name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{tutor.profiles?.full_name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{tutor.profiles?.university || 'Campus Student'}</p>
                    <div className="flex items-center gap-1 text-sm font-medium text-amber-500 mb-3">
                      <Star size={14} className="fill-current" />
                      <span>4.9 (12 reviews)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-lg">${tutor.hourly_rate}</span>
                    <span className="text-xs text-muted-foreground block">/ hr</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Subjects</div>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects?.map(sub => (
                      <span key={sub} className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-md font-medium">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex gap-2">
                  <Button className="flex-1">Book Session</Button>
                  <Button variant="outline" className="flex-1">Message</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card border border-dashed rounded-xl">
          <BookOpen className="mx-auto text-muted-foreground mb-4" size={40} opacity={0.5} />
          <h3 className="text-xl font-semibold mb-2">No tutors found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            There are currently no active tutors available.
          </p>
          {user && <Button>Become the first Tutor</Button>}
        </div>
      )}
    </div>
  )
}
