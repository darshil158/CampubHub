import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Download, FileText, Upload, Sparkles, BookOpen, ArrowDownToLine, Eye, Bookmark, Star, CheckCircle2, X, FileCheck, Layers } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card3D } from "../components/ui/Card3D"
import { Badge } from "../components/ui/Badge"
import { api } from "../services/api"
import { useAuthStore } from "../store/useAuthStore"

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const { user } = useAuthStore()

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    subject: 'Computer Science',
    course_code: 'CS-301',
    semester: 'Semester 5',
    pages: 28,
    file_type: 'PDF'
  })

  // Download toast state
  const [downloadSuccessNote, setDownloadSuccessNote] = useState(null)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    setIsLoading(true)
    try {
      const res = await api.notes.getAll()
      if (res.success) {
        setNotes(res.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (note) => {
    try {
      await api.notes.download(note.id)
      setNotes(prev => prev.map(n => n.id === note.id ? { ...n, downloads: (n.downloads || 0) + 1 } : n))
      setDownloadSuccessNote(note)
      setTimeout(() => {
        setDownloadSuccessNote(null)
      }, 2500)
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!uploadFormData.title || !uploadFormData.subject) return
    setIsSubmitting(true)
    try {
      const res = await api.notes.create({
        ...uploadFormData,
        contributor_id: user?.id || 'usr_priya',
        rating: 5.0,
        downloads: 0,
        profiles: {
          full_name: user?.user_metadata?.full_name || 'Campus Scholar',
          college: 'IIT Delhi'
        }
      })
      if (res.success) {
        setNotes(prev => [res.data, ...prev])
        setIsUploadModalOpen(false)
        setUploadFormData({
          title: '',
          subject: 'Computer Science',
          course_code: 'CS-301',
          semester: 'Semester 5',
          pages: 28,
          file_type: 'PDF'
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const subjects = [
    'all',
    'Computer Science',
    'Mathematics',
    'Economics',
    'Chemistry',
    'Electronics'
  ]

  const filteredNotes = notes.filter(n => {
    const matchesSearch = !searchQuery || (
      n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.course_code?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const matchesSubject = selectedSubject === 'all' || n.subject === selectedSubject
    return matchesSearch && matchesSubject
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
    <div className="container mx-auto px-4 py-8 max-w-7xl relative">
      {/* Ambient Backlights */}
      <div className="ambient-aurora w-[500px] h-[300px] bg-cyan-500/10 top-10 left-10 pointer-events-none" />
      <div className="ambient-aurora w-[600px] h-[350px] bg-blue-600/15 top-1/3 right-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="verified" size="xs" className="border-cyan-400/30 text-cyan-300">
              Study Guides & Cheat Sheets
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">• Open Course Summaries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Notes & Study Guides</h1>
          <p className="text-muted-foreground text-sm mt-1">Crowdsourced lecture summaries, formula sheets, midterm outlines, and exam review notes.</p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-2.5">
          <div className="relative w-full md:w-72">
            <Input 
              placeholder="Search subject or course code..." 
              leftIcon={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0B0F1C]/90 border-white/10 focus-visible:border-cyan-400 focus-visible:ring-cyan-400/20"
            />
          </div>
          <Button 
            variant="glow" 
            onClick={() => setIsUploadModalOpen(true)}
            className="shrink-0 gap-1.5 shadow-[0_0_20px_rgba(0,240,255,0.35)]"
          >
            <Upload size={16} />
            <span>Upload Notes</span>
          </Button>
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 relative z-10 scrollbar-none">
        {subjects.map(sub => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedSubject === sub
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,240,255,0.4)] border border-cyan-400/40'
                : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10'
            }`}
          >
            {sub === 'all' ? 'All Subjects' : sub}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="h-52 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
          ))}
        </div>
      ) : filteredNotes.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
        >
          {filteredNotes.map(note => (
            <motion.div key={note.id} variants={item} className="h-full">
              <Card3D neonGlow="cyan" maxTilt={8} className="h-full p-6 flex flex-col justify-between group">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div className="bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-300 p-2.5 rounded-xl shadow-xs group-hover:scale-110 transition-transform">
                      <FileText size={22} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-white/80 border border-white/10">
                        {note.course_code || 'GEN-101'}
                      </span>
                      <Badge variant="outline" size="xs" className="border-cyan-400/30 text-cyan-300">
                        {note.subject}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-white line-clamp-2 leading-snug group-hover:text-cyan-300 transition-colors mb-2">
                    {note.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span>{note.semester || 'All Semesters'}</span>
                    <span>•</span>
                    <span>{note.pages || 20} Pages</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star size={12} className="fill-amber-400" />
                      {note.rating || 4.9}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="truncate min-w-0 pr-2">
                    <span className="text-white/60 block text-[10px]">Contributed by</span>
                    <span className="text-foreground/90 font-medium truncate block">
                      {note.profiles?.full_name || 'Campus Student'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-white/50 font-mono">
                      {note.downloads || 0} dl
                    </span>
                    <Button 
                      variant="glow" 
                      size="xs" 
                      onClick={() => handleDownload(note)}
                      className="gap-1 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                    >
                      <ArrowDownToLine size={13} />
                      <span>Download</span>
                    </Button>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-white/15 bg-white/5 backdrop-blur-xl flex flex-col items-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-400/30 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <FileText size={30} />
          </div>
          <h3 className="text-xl font-bold mb-1.5 text-white">No study guides found</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
            Be the campus legend and upload high-yield lecture summaries or test prep guides for your peers!
          </p>
          <Button variant="glow" onClick={() => setIsUploadModalOpen(true)} className="gap-2">
            <Upload size={16} />
            <span>Upload Notes to Campus</span>
          </Button>
        </div>
      )}

      {/* Download Success Banner */}
      <AnimatePresence>
        {downloadSuccessNote && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 bg-[#0B0F1C] border border-cyan-400/40 rounded-2xl p-4 shadow-2xl flex items-center gap-3 max-w-md"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-400/30 shrink-0">
              <FileCheck size={20} />
            </div>
            <div className="text-xs">
              <p className="text-white font-bold">Download Started</p>
              <p className="text-muted-foreground truncate">{downloadSuccessNote.title}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Notes Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0B0F1C] border border-cyan-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsUploadModalOpen(false)} 
                className="absolute top-5 right-5 text-muted-foreground hover:text-white"
              >
                <X size={18} />
              </button>

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <Badge variant="verified" size="xs" className="border-cyan-400/30 text-cyan-300 mb-2">
                    Open Academic Library
                  </Badge>
                  <h3 className="text-xl font-bold text-white">Upload Study Guide / Notes</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Help campus peers master exam concepts and earn peer reputation.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1.5">Document Title</label>
                  <Input 
                    placeholder="e.g. Data Structures & Algorithms High-Yield Cheatsheet"
                    value={uploadFormData.title}
                    onChange={(e) => setUploadFormData(p => ({ ...p, title: e.target.value }))}
                    required
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-white/80 block mb-1.5">Subject</label>
                    <select
                      value={uploadFormData.subject}
                      onChange={(e) => setUploadFormData(p => ({ ...p, subject: e.target.value }))}
                      className="w-full bg-[#13192B] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-hidden focus:border-cyan-400"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Economics">Economics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Physics">Physics</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/80 block mb-1.5">Course Code</label>
                    <Input 
                      placeholder="e.g. CS-301"
                      value={uploadFormData.course_code}
                      onChange={(e) => setUploadFormData(p => ({ ...p, course_code: e.target.value }))}
                      required
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-white/80 block mb-1.5">Target Semester</label>
                    <select
                      value={uploadFormData.semester}
                      onChange={(e) => setUploadFormData(p => ({ ...p, semester: e.target.value }))}
                      className="w-full bg-[#13192B] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-hidden focus:border-cyan-400"
                    >
                      <option value="Semester 1">Semester 1</option>
                      <option value="Semester 2">Semester 2</option>
                      <option value="Semester 3">Semester 3</option>
                      <option value="Semester 4">Semester 4</option>
                      <option value="Semester 5">Semester 5</option>
                      <option value="Semester 6">Semester 6</option>
                      <option value="Semester 7-8">Semester 7-8</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/80 block mb-1.5">Page Count</label>
                    <Input 
                      type="number"
                      min="1"
                      max="500"
                      value={uploadFormData.pages}
                      onChange={(e) => setUploadFormData(p => ({ ...p, pages: Number(e.target.value) }))}
                      required
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>

                {/* Simulated file drop zone */}
                <div className="border border-dashed border-cyan-400/30 rounded-2xl p-4 text-center bg-cyan-500/5">
                  <Upload size={24} className="mx-auto text-cyan-300 mb-1" />
                  <p className="text-xs font-medium text-white">Attached: {uploadFormData.title ? `${uploadFormData.title.slice(0, 20)}.pdf` : 'lecture_notes_v1.pdf'}</p>
                  <p className="text-[10px] text-muted-foreground">PDF, DOCX or EPUB up to 25MB</p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsUploadModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="glow" 
                    isLoading={isSubmitting}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                  >
                    Upload Guide
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
