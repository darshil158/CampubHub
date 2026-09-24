import { useState, useEffect } from "react"
import { Search, Download, FileText, Upload } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardContent } from "../components/ui/Card"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "../store/useAuthStore"

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notes & Resources</h1>
          <p className="text-muted-foreground mt-1">Share and download study materials for your courses.</p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input placeholder="Search subject or course..." className="pl-9" />
          </div>
          {user && <Button className="gap-2"><Upload size={18} /><span className="hidden sm:inline">Upload Notes</span></Button>}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(n => <div key={n} className="h-40 rounded-xl bg-muted animate-pulse border"></div>)}
        </div>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {notes.map(note => (
            <Card key={note.id} className="hover:shadow-md transition-shadow group cursor-pointer">
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold line-clamp-2 leading-tight">{note.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{note.subject}</p>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between border-t pt-4">
                  <div className="text-xs text-muted-foreground">
                    By {note.profiles?.full_name || 'Anonymous'}
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <Download size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-card rounded-xl border border-dashed">
          <FileText className="mx-auto text-muted-foreground mb-4" size={40} opacity={0.5} />
          <h3 className="text-xl font-semibold mb-2">No resources found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            Be a hero and upload the first set of notes for your peers!
          </p>
          {user && <Button>Upload Notes</Button>}
        </div>
      )}
    </div>
  )
}
