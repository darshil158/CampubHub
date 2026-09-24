import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Users, Calendar, MapPin, Plus, Check,
  Sparkles, BookOpen, Clock, Tag, ChevronRight, X
} from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { Card3D } from "../components/ui/Card3D"
import { Badge, VerifiedBadge } from "../components/ui/Badge"
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from "../components/ui/Modal"
import { api } from "../services/api"
import { useAuthStore } from "../store/useAuthStore"

export default function StudyGroups() {
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [campusFilter, setCampusFilter] = useState("All")
  const [joinedGroups, setJoinedGroups] = useState(new Set())

  // Create Group Modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [semester, setSemester] = useState("Semester 4-6")
  const [campus, setCampus] = useState("Central Library Pergola")
  const [schedule, setSchedule] = useState("Tue & Thu 6:00 PM")
  const [maxCapacity, setMaxCapacity] = useState(15)
  const [description, setDescription] = useState("")
  const [tagsInput, setTagsInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { user } = useAuthStore()

  useEffect(() => {
    fetchGroups()
  }, [campusFilter])

  const fetchGroups = async () => {
    setIsLoading(true)
    try {
      const data = await api.studyGroups.getAll({
        search: searchQuery,
        campus: campusFilter
      })
      setGroups(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchGroups()
  }

  const handleJoin = async (groupId) => {
    try {
      const res = await api.studyGroups.join(groupId)
      setJoinedGroups(prev => new Set(prev).add(groupId))
      setGroups(prev => prev.map(g => g.id === groupId ? { ...g, members_count: res.members_count } : g))
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateGroup = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean)
      await api.studyGroups.create({
        title,
        subject,
        semester,
        campus,
        meeting_schedule: schedule,
        max_capacity: parseInt(maxCapacity),
        description,
        tags: tags.length ? tags : ["Study Group", subject]
      })
      setShowCreateModal(false)
      fetchGroups()
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
      {/* Ambient Auroras */}
      <div className="ambient-aurora w-[500px] h-[300px] bg-purple-500/10 top-10 left-10 pointer-events-none" />
      <div className="ambient-aurora w-[600px] h-[350px] bg-cyan-600/15 top-1/3 right-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="verified" size="xs" className="border-purple-400/30 text-purple-300">
              Collaborative Sprints 3D
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">• Peer Study Circles</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Study Groups & Circles</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Form study squads for midterm crunch, competitive coding, hackathons, and GRE/CAT exam prep.
          </p>
        </div>

        <div className="flex w-full md:w-auto items-center gap-2.5">
          <form onSubmit={handleSearch} className="relative w-full md:w-72">
            <Input
              placeholder="Search group topic, subject..."
              leftIcon={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0B0F1C]/90 border-white/10 focus-visible:border-purple-400"
            />
          </form>

          {user && (
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="glow"
              className="shrink-0 gap-1.5 shadow-[0_0_20px_rgba(139,92,246,0.35)]"
            >
              <Plus size={16} />
              <span>Create Circle</span>
            </Button>
          )}
        </div>
      </div>

      {/* Grid of Study Groups */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-64 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
          ))}
        </div>
      ) : groups.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
        >
          {groups.map(group => {
            const isFull = group.members_count >= group.max_capacity
            const isJoined = joinedGroups.has(group.id)
            const capacityPercent = Math.min(100, Math.round((group.members_count / group.max_capacity) * 100))

            return (
              <motion.div key={group.id} variants={item} className="h-full">
                <Card3D neonGlow="purple" maxTilt={8} className="h-full p-6 flex flex-col justify-between">
                  <div>
                    {/* Top Row: Subject & Capacity */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                          {group.subject}
                        </span>
                        <h3 className="text-xl font-bold text-white mt-1 group-hover:text-purple-300 transition-colors">
                          {group.title}
                        </h3>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-white">
                          {group.members_count} / {group.max_capacity}
                        </span>
                        <span className="text-[10px] text-muted-foreground block">members</span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                      {group.description}
                    </p>

                    {/* Progress Bar of Capacity */}
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-4">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                        style={{ width: `${capacityPercent}%` }}
                      />
                    </div>

                    {/* Schedule & Location */}
                    <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Clock size={13} className="text-purple-400 shrink-0" />
                        <span className="text-white/80">{group.meeting_schedule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-cyan-400 shrink-0" />
                        <span>{group.campus}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {group.tags && group.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {group.tags.map(t => (
                          <span key={t} className="text-[10px] font-medium bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-white/70">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        {group.creator?.full_name?.charAt(0) || "C"}
                      </div>
                      <div className="text-xs">
                        <span className="font-semibold text-white/90 block leading-tight">{group.creator?.full_name || "Lead"}</span>
                        <span className="text-[10px] text-muted-foreground">Organizer</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={isJoined ? "outline" : "glow"}
                      disabled={isFull && !isJoined}
                      onClick={() => handleJoin(group.id)}
                      className="gap-1.5"
                    >
                      {isJoined ? (
                        <>
                          <Check size={14} className="text-emerald-400" />
                          <span>Joined Circle</span>
                        </>
                      ) : isFull ? (
                        <span>Circle Full</span>
                      ) : (
                        <>
                          <Users size={14} />
                          <span>Join Squad</span>
                        </>
                      )}
                    </Button>
                  </div>
                </Card3D>
              </motion.div>
            )
          })}
        </motion.div>
      ) : (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-white/15 bg-white/5 backdrop-blur-xl flex flex-col items-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center mb-4 border border-purple-400/30">
            <BookOpen size={30} />
          </div>
          <h3 className="text-xl font-bold mb-1.5 text-white">No study circles found</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
            Create a squad for your specific course or entrance exams and invite peers!
          </p>
          {user && (
            <Button onClick={() => setShowCreateModal(true)} variant="glow" className="gap-2">
              <Plus size={16} />
              <span>Create New Circle</span>
            </Button>
          )}
        </div>
      )}

      {/* Create Group Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} size="lg">
        <div>
          <ModalHeader>
            <ModalTitle className="text-white flex items-center gap-2">
              <Plus size={18} className="text-purple-400" /> Start a Study Circle
            </ModalTitle>
          </ModalHeader>
          <form onSubmit={handleCreateGroup}>
            <ModalContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-white/80">Group Title</Label>
                <Input
                  required
                  placeholder="e.g. LeetCode Medium/Hard Problem Solvers"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-[#0B0F1C]/90 border-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-white/80">Subject / Course</Label>
                  <Input
                    required
                    placeholder="e.g. Computer Science CS201"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-[#0B0F1C]/90 border-white/10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-white/80">Max Capacity</Label>
                  <Input
                    type="number"
                    min="2"
                    max="50"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    className="bg-[#0B0F1C]/90 border-white/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-white/80">Meeting Schedule</Label>
                  <Input
                    required
                    placeholder="e.g. Mon & Wed 7:00 PM"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    className="bg-[#0B0F1C]/90 border-white/10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-white/80">Location / Platform</Label>
                  <Input
                    required
                    placeholder="e.g. Central Library 2nd Floor / Google Meet"
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="bg-[#0B0F1C]/90 border-white/10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-white/80">Tags (comma separated)</Label>
                <Input
                  placeholder="Algorithms, FAANG, Python, Mock"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="bg-[#0B0F1C]/90 border-white/10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-white/80">Group Goals & Structure</Label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain how often you meet, homework/problem commitments, and what members gain..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#0B0F1C] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>
            </ModalContent>
            <ModalFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="glow" loading={isSubmitting}>
                Launch Study Circle
              </Button>
            </ModalFooter>
          </form>
        </div>
      </Modal>
    </div>
  )
}
