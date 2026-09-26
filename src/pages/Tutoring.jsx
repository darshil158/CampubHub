import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Star, BookOpen, GraduationCap, Plus, MessageSquare,
  Calendar, ShieldCheck, Check, Clock, Sparkles, X
} from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { Card3D } from "../components/ui/Card3D"
import { Badge, VerifiedBadge } from "../components/ui/Badge"
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from "../components/ui/Modal"
import { api } from "../services/api"
import { useAuthStore } from "../store/useAuthStore"
import { useNavigate } from "react-router-dom"
import { handleImageError } from "../lib/utils"

export default function Tutoring() {
  const [tutors, setTutors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTutor, setSelectedTutor] = useState(null)
  
  // Booking Form State
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split("T")[0])
  const [bookingTime, setBookingTime] = useState("17:00")
  const [bookingTopic, setBookingTopic] = useState("")
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchTutors()
  }, [])

  const fetchTutors = async () => {
    setIsLoading(true)
    try {
      const data = await api.tutors.getAll({ search: searchQuery })
      setTutors(data)
    } catch (err) {
      console.error("Error fetching tutors:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchTutors()
  }

  const handleBookSession = async (e) => {
    e.preventDefault()
    if (!selectedTutor) return
    setIsSubmitting(true)
    try {
      await api.tutors.bookSession({
        tutorId: selectedTutor.id,
        subject: bookingTopic || selectedTutor.subjects?.[0] || "General Tutoring",
        date: bookingDate,
        time: bookingTime,
        notes: "Requested via 3D Campus Hub"
      })
      setBookingSuccess(true)
      setTimeout(() => {
        setBookingSuccess(false)
        setSelectedTutor(null)
      }, 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  }

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl relative">
      {/* Ambient Backlights */}
      <div className="ambient-aurora w-[500px] h-[300px] bg-blue-500/10 top-10 left-10 pointer-events-none" />
      <div className="ambient-aurora w-[600px] h-[350px] bg-purple-600/15 top-1/3 right-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="verified" size="xs" className="border-blue-400/30 text-blue-300">
              Peer Tutoring 3D
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">• Verified Mentorship Network</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Peer Tutoring Hub</h1>
          <p className="text-muted-foreground text-sm mt-1">Connect with verified high-achieving classmates to ace midterms, finals, and tough coursework.</p>
        </div>

        <div className="flex w-full md:w-auto items-center gap-2.5">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
            <Input 
              placeholder="Search subject or tutor..." 
              leftIcon={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0B0F1C]/90 border-white/10 focus-visible:border-blue-400"
            />
          </form>

          {user && (
            <Button
              onClick={() => alert("Your tutor profile request has been sent to university moderators!")}
              variant="glow"
              className="shrink-0 gap-1.5 shadow-[0_0_20px_rgba(59,130,246,0.35)]"
            >
              <Plus size={16} />
              <span>Become Tutor</span>
            </Button>
          )}
        </div>
      </div>

      {/* Grid of Tutors */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="h-64 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
          ))}
        </div>
      ) : tutors.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
        >
          {tutors.map((tutor) => (
            <motion.div key={tutor.id} variants={item} className="h-full">
              <Card3D neonGlow="blue" maxTilt={10} className="h-full flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 overflow-hidden shrink-0 border border-white/15 relative shadow-md">
                      {tutor.profiles?.avatar_url ? (
                        <img src={tutor.profiles.avatar_url} alt="" onError={handleImageError} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                          {tutor.profiles?.full_name?.charAt(0) || "T"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-white truncate">{tutor.profiles?.full_name}</h3>
                        <ShieldCheck size={14} className="text-cyan-400 shrink-0" />
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{tutor.profiles?.university || "Campus Peer"}</p>
                      <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 mt-1.5">
                        <Star size={13} className="fill-current" />
                        <span>{tutor.rating || 4.9} ({tutor.reviews_count || 24} student reviews)</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-2xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                        ${tutor.hourly_rate}
                      </span>
                      <span className="text-[11px] text-muted-foreground block font-medium">/ hr</span>
                    </div>
                  </div>
                  
                  <div className="mt-5">
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-2">Subject Mastery</div>
                    <div className="flex flex-wrap gap-1.5">
                      {tutor.subjects?.map(sub => (
                        <span key={sub} className="bg-white/5 border border-white/10 text-xs px-2.5 py-0.5 rounded-lg text-white/80 font-medium">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-4 line-clamp-2 leading-relaxed">
                    {tutor.bio || tutor.experience}
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
                  <Button
                    variant="glow"
                    size="sm"
                    className="w-full gap-1.5"
                    onClick={() => {
                      setSelectedTutor(tutor)
                      setBookingTopic(tutor.subjects?.[0] || "")
                    }}
                  >
                    <Calendar size={14} />
                    <span>Book Session</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5 border-white/15 hover:border-cyan-400/40"
                    onClick={() => navigate("/messages")}
                  >
                    <MessageSquare size={14} />
                    <span>Message</span>
                  </Button>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-white/15 bg-white/5 backdrop-blur-xl flex flex-col items-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center mb-4 border border-blue-400/30">
            <GraduationCap size={30} />
          </div>
          <h3 className="text-xl font-bold mb-1.5 text-white">No tutors listed for this query</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
            Have you mastered a course with top marks? Share your mastery with peers and earn competitive hourly rates.
          </p>
        </div>
      )}

      {/* Booking Modal */}
      <Modal isOpen={!!selectedTutor} onClose={() => setSelectedTutor(null)} size="md">
        {selectedTutor && (
          <div>
            <ModalHeader>
              <ModalTitle className="text-white flex items-center gap-2">
                <Sparkles size={18} className="text-cyan-400" /> Book Tutoring Session
              </ModalTitle>
            </ModalHeader>
            <form onSubmit={handleBookSession}>
              <ModalContent className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-[#070A14] border border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {selectedTutor.profiles?.full_name?.charAt(0) || "T"}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{selectedTutor.profiles?.full_name}</h4>
                    <p className="text-xs text-cyan-300 font-semibold">${selectedTutor.hourly_rate} / hour</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-white/80">Select Topic / Subject</Label>
                  <select
                    value={bookingTopic}
                    onChange={(e) => setBookingTopic(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#0B0F1C] border border-white/10 text-white text-xs"
                  >
                    {selectedTutor.subjects?.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-white/80">Date</Label>
                    <Input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="bg-[#0B0F1C]/90 border-white/10 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-white/80">Preferred Time</Label>
                    <Input
                      type="time"
                      required
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="bg-[#0B0F1C]/90 border-white/10 text-xs"
                    />
                  </div>
                </div>

                {bookingSuccess && (
                  <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                    <Check size={16} /> Tutoring session confirmed! Added to your schedule.
                  </div>
                )}
              </ModalContent>
              <ModalFooter>
                <Button type="button" variant="outline" onClick={() => setSelectedTutor(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="glow" loading={isSubmitting} disabled={bookingSuccess}>
                  Confirm 1-on-1 Booking
                </Button>
              </ModalFooter>
            </form>
          </div>
        )}
      </Modal>
    </div>
  )
}
