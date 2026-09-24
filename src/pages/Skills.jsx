import { useState, useEffect } from "react"
import { Search, Plus, Wrench, HandHeart } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "../store/useAuthStore"

export default function Skills() {
  const [skills, setSkills] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuthStore()
  const [filterType, setFilterType] = useState('all')

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills Exchange</h1>
          <p className="text-muted-foreground mt-1">Trade your skills or find someone who can help you.</p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input placeholder="Search skills..." className="pl-9" />
          </div>
          {user && <Button className="gap-2"><Plus size={18} /><span className="hidden sm:inline">Post Skill</span></Button>}
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <Button variant={filterType === 'all' ? 'default' : 'secondary'} onClick={() => setFilterType('all')} className="rounded-full">All</Button>
        <Button variant={filterType === 'offer' ? 'default' : 'secondary'} onClick={() => setFilterType('offer')} className="rounded-full">Offers</Button>
        <Button variant={filterType === 'request' ? 'default' : 'secondary'} onClick={() => setFilterType('request')} className="rounded-full">Requests</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => <div key={n} className="h-48 rounded-xl bg-muted animate-pulse border"></div>)}
        </div>
      ) : skills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map(skill => (
            <Card key={skill.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 ${skill.type === 'offer' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {skill.type === 'offer' ? <HandHeart size={14} /> : <Wrench size={14} />}
                    {skill.type === 'offer' ? 'Offering' : 'Requesting'}
                  </span>
                  <span className="text-xs text-muted-foreground">{skill.category}</span>
                </div>
                <CardTitle className="text-xl">{skill.title}</CardTitle>
                <CardDescription className="line-clamp-2">{skill.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/50">
                  <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
                    {skill.profiles?.avatar_url ? (
                      <img src={skill.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                        {skill.profiles?.full_name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-medium flex-1">{skill.profiles?.full_name}</div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-card rounded-xl border border-dashed">
          <Wrench className="mx-auto text-muted-foreground mb-4" size={40} opacity={0.5} />
          <h3 className="text-xl font-semibold mb-2">No skills found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            There are currently no skills posted in this category.
          </p>
          {user && <Button>Post the first Skill</Button>}
        </div>
      )}
    </div>
  )
}
