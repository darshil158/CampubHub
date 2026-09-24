import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, Wrench, HandHeart, Sparkles, MessageCircle, ArrowRight, Zap, CheckCircle2, X, Star, BookOpen, Layers } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card3D } from "../components/ui/Card3D"
import { Badge } from "../components/ui/Badge"
import { api } from "../services/api"
import { useAuthStore } from "../store/useAuthStore"

export default function Skills() {
  const [skills, setSkills] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuthStore()
  const [filterType, setFilterType] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals state
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [selectedSkillForSwap, setSelectedSkillForSwap] = useState(null)
  const [swapOfferedSkill, setSwapOfferedSkill] = useState('')
  const [swapMessage, setSwapMessage] = useState('')
  const [swapSuccess, setSwapSuccess] = useState(false)

  // New skill form
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Tech & Development',
    type: 'offer',
    experience_level: 'Intermediate'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchSkills()
  }, [filterType])

  const fetchSkills = async () => {
    setIsLoading(true)
    try {
      const res = await api.skills.getAll({
        type: filterType === 'all' ? undefined : filterType
      })
      if (res.success) {
        setSkills(res.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSkill = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.description) return
    setIsSubmitting(true)
    try {
      const res = await api.skills.create({
        ...formData,
        user_id: user?.id || 'usr_aarav',
        profiles: {
          full_name: user?.user_metadata?.full_name || 'Campus Student',
          college: 'IIT Delhi',
          avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`
        }
      })
      if (res.success) {
        setSkills(prev => [res.data, ...prev])
        setIsPostModalOpen(false)
        setFormData({
          title: '',
          description: '',
          category: 'Tech & Development',
          type: 'offer',
          experience_level: 'Intermediate'
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleProposeSwap = (e) => {
    e.preventDefault()
    setSwapSuccess(true)
    setTimeout(() => {
      setSwapSuccess(false)
      setSelectedSkillForSwap(null)
      setSwapOfferedSkill('')
      setSwapMessage('')
    }, 1800)
  }

  const categories = [
    'all',
    'Tech & Development',
    'Design & Creative',
    'Music & Arts',
    'Languages',
    'Engineering & CAD',
    'Data Science & AI'
  ]

  const filteredSkills = skills.filter(s => {
    const matchesSearch = !searchQuery || (
      s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory
    return matchesSearch && matchesCategory
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
      <div className="ambient-aurora w-[500px] h-[300px] bg-pink-500/10 top-10 left-10 pointer-events-none" />
      <div className="ambient-aurora w-[600px] h-[350px] bg-purple-600/15 top-1/3 right-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="verified" size="xs" className="border-pink-400/30 text-pink-300">
              Skill Barter Matrix
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">• Zero-Cash Campus Exchange</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Skills Exchange</h1>
          <p className="text-muted-foreground text-sm mt-1">Swap creative, coding, language, and engineering talents with fellow university students.</p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-2.5">
          <div className="relative w-full md:w-72">
            <Input 
              placeholder="Search skills, talents..." 
              leftIcon={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0B0F1C]/90 border-white/10 focus-visible:border-pink-400 focus-visible:ring-pink-400/20"
            />
          </div>
          <Button 
            variant="glow" 
            onClick={() => setIsPostModalOpen(true)}
            className="shrink-0 gap-1.5 shadow-[0_0_20px_rgba(236,72,153,0.35)]"
          >
            <Plus size={16} />
            <span>Post Skill</span>
          </Button>
        </div>
      </div>

      {/* Type Toggle & Category Pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 relative z-10">
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All Talents' },
            { id: 'offer', label: 'Offering Skill' },
            { id: 'request', label: 'Seeking Help' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_18px_rgba(236,72,153,0.4)] border border-pink-400/40'
                  : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white/15 text-pink-300 border border-pink-400/40'
                  : 'bg-white/5 text-muted-foreground hover:text-white border border-transparent'
              }`}
            >
              {cat === 'all' ? 'All Domains' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {[1, 2, 3, 4, 5, 6].map(n => <div key={n} className="h-56 rounded-2xl bg-white/5 animate-pulse border border-white/10" />)}
        </div>
      ) : filteredSkills.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
        >
          {filteredSkills.map(skill => (
            <motion.div key={skill.id} variants={item} className="h-full">
              <Card3D neonGlow={skill.type === 'offer' ? 'pink' : 'cyan'} maxTilt={8} className="h-full flex flex-col justify-between p-6">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <Badge
                      variant={skill.type === 'offer' ? 'verified' : 'default'}
                      size="sm"
                      icon={skill.type === 'offer' ? <HandHeart size={13} /> : <Wrench size={13} />}
                      className={skill.type === 'offer' ? "border-pink-400/40 text-pink-300 bg-pink-500/10" : "border-cyan-400/40 text-cyan-300 bg-cyan-500/10"}
                    >
                      {skill.type === 'offer' ? 'Offering Talent' : 'Looking for Talent'}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                      {skill.category || 'General'}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-white mb-2 leading-snug group-hover:text-pink-300 transition-colors">
                    {skill.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                    {skill.description}
                  </p>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] text-white/50">Level:</span>
                    <Badge variant="outline" size="xs" className="border-pink-400/30 text-pink-300/90 font-mono">
                      {skill.experience_level || 'Intermediate'}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center overflow-hidden font-bold text-xs shrink-0 shadow-xs">
                      {skill.profiles?.avatar_url ? (
                        <img src={skill.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        skill.profiles?.full_name?.charAt(0) || 'S'
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate text-foreground/90">
                        {skill.profiles?.full_name || 'Campus Student'}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {skill.profiles?.college || 'Verified Campus'}
                      </div>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="xs" 
                    onClick={() => setSelectedSkillForSwap(skill)}
                    className="gap-1 border-white/15 hover:border-pink-400/50 hover:bg-pink-500/10 text-pink-300 shrink-0"
                  >
                    <MessageCircle size={12} />
                    <span>Propose Swap</span>
                  </Button>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-white/15 bg-white/5 backdrop-blur-xl flex flex-col items-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-pink-500/15 text-pink-400 flex items-center justify-center mb-4 border border-pink-400/30 shadow-[0_0_20px_rgba(236,72,153,0.2)]">
            <Zap size={30} />
          </div>
          <h3 className="text-xl font-bold mb-1.5 text-white">No skill trades found</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
            Have a talent or want to learn something new without expensive fees? Barter skills with a classmate.
          </p>
          <Button variant="glow" onClick={() => setIsPostModalOpen(true)} className="gap-2">
            <Plus size={16} />
            <span>Post a Skill Offer or Request</span>
          </Button>
        </div>
      )}

      {/* Propose Swap Modal */}
      <AnimatePresence>
        {selectedSkillForSwap && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0B0F1C] border border-pink-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedSkillForSwap(null)} 
                className="absolute top-5 right-5 text-muted-foreground hover:text-white"
              >
                <X size={18} />
              </button>

              {swapSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Skill Swap Proposed!</h3>
                  <p className="text-sm text-muted-foreground">
                    Proposal sent to {selectedSkillForSwap.profiles?.full_name}. You'll be notified when they accept.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleProposeSwap} className="space-y-4">
                  <div>
                    <Badge variant="verified" size="xs" className="border-pink-400/30 text-pink-300 mb-2">
                      Barter Proposal
                    </Badge>
                    <h3 className="text-xl font-bold text-white">Swap with {selectedSkillForSwap.profiles?.full_name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Target skill: <span className="text-pink-300 font-semibold">{selectedSkillForSwap.title}</span>
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white/80 block mb-1.5">What skill will you teach in return?</label>
                    <Input 
                      placeholder="e.g. Python for Data, Guitar Chords, Video Editing" 
                      value={swapOfferedSkill}
                      onChange={(e) => setSwapOfferedSkill(e.target.value)}
                      required
                      className="bg-white/5 border-white/10"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white/80 block mb-1.5">Note to {selectedSkillForSwap.profiles?.full_name?.split(' ')[0]}</label>
                    <textarea 
                      rows={3}
                      placeholder="Hey, I'm free on weekends! Let's swap 2 hours of React for Figma tips..."
                      value={swapMessage}
                      onChange={(e) => setSwapMessage(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-muted-foreground focus:outline-hidden focus:border-pink-400"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => setSelectedSkillForSwap(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="glow" className="bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                      Send Proposal
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Post Skill Modal */}
      <AnimatePresence>
        {isPostModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0B0F1C] border border-pink-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsPostModalOpen(false)} 
                className="absolute top-5 right-5 text-muted-foreground hover:text-white"
              >
                <X size={18} />
              </button>

              <form onSubmit={handleCreateSkill} className="space-y-4">
                <div>
                  <Badge variant="verified" size="xs" className="border-pink-400/30 text-pink-300 mb-2">
                    Campus Talent Directory
                  </Badge>
                  <h3 className="text-xl font-bold text-white">Post Skill Listing</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Share your expertise or request peer tutoring assistance.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, type: 'offer' }))}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      formData.type === 'offer'
                        ? 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                        : 'border-white/10 bg-white/5 text-muted-foreground'
                    }`}
                  >
                    I Can Teach (Offer)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, type: 'request' }))}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      formData.type === 'request'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                        : 'border-white/10 bg-white/5 text-muted-foreground'
                    }`}
                  >
                    I Want to Learn (Request)
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1.5">Skill Title</label>
                  <Input 
                    placeholder="e.g. Next.js & Full-stack Architecture, Acoustic Guitar"
                    value={formData.title}
                    onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                    required
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-white/80 block mb-1.5">Domain</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                      className="w-full bg-[#13192B] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-hidden focus:border-pink-400"
                    >
                      {categories.filter(c => c !== 'all').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/80 block mb-1.5">Experience Level</label>
                    <select
                      value={formData.experience_level}
                      onChange={(e) => setFormData(p => ({ ...p, experience_level: e.target.value }))}
                      className="w-full bg-[#13192B] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-hidden focus:border-pink-400"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1.5">Description & What You Want in Exchange</label>
                  <textarea 
                    rows={3}
                    placeholder="Describe what you will teach, typical hours, or what you're hoping to learn..."
                    value={formData.description}
                    onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-muted-foreground focus:outline-hidden focus:border-pink-400"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsPostModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="glow" 
                    isLoading={isSubmitting}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_0_20px_rgba(236,72,153,0.4)]"
                  >
                    Publish Skill
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
