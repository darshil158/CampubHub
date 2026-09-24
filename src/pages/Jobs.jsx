import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Plus, Briefcase, MapPin, Clock, DollarSign,
  Filter, X, Loader2, AlertCircle, ExternalLink,
  Wifi, Building2, GraduationCap, Zap, Users, Phone, Check, Eye
} from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { Textarea } from "../components/ui/Textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Card3D } from "../components/ui/Card3D"
import { Badge, RemoteBadge, VerifiedBadge } from "../components/ui/Badge"
import { api } from "../services/api"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "../store/useAuthStore"

const JOB_TYPES = [
  { value: "all", label: "All Jobs", icon: Briefcase },
  { value: "part-time", label: "Part-Time", icon: Clock },
  { value: "on-campus", label: "On-Campus", icon: Building2 },
  { value: "internship", label: "Internship", icon: GraduationCap },
  { value: "freelance", label: "Freelance", icon: Zap },
  { value: "full-time", label: "Full-Time", icon: Users },
]

const PAY_PERIODS = [
  { value: "hourly", label: "/hr" },
  { value: "weekly", label: "/wk" },
  { value: "monthly", label: "/mo" },
  { value: "fixed", label: " total" },
]

const TYPE_COLORS = {
  "part-time": "bg-blue-500/10 text-blue-400 border-blue-500/30",
  "full-time": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  "internship": "bg-violet-500/10 text-violet-400 border-violet-500/30",
  "freelance": "bg-amber-500/10 text-amber-400 border-amber-500/30",
  "on-campus": "bg-rose-500/10 text-rose-400 border-rose-500/30",
}

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeType, setActiveType] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const { user } = useAuthStore()

  useEffect(() => {
    fetchJobs()
  }, [activeType, searchQuery])

  const fetchJobs = async () => {
    setIsLoading(true)
    try {
      const data = await api.jobs.getAll({
        search: searchQuery,
        jobType: activeType === "all" ? "All" : activeType
      })
      setJobs(data)
    } catch (err) {
      console.error("Error fetching jobs:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPay = (job) => {
    if (!job.pay_min && !job.pay_max) return "Stipend TBD"
    const period = PAY_PERIODS.find(p => p.value === job.pay_period)?.label || "/hr"
    if (job.pay_min && job.pay_max) {
      return `$${Number(job.pay_min).toFixed(0)} – $${Number(job.pay_max).toFixed(0)}${period}`
    }
    return `$${Number(job.pay_min || job.pay_max).toFixed(0)}${period}`
  }

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return `${Math.floor(days / 7)}w ago`
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } }
  }
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent border border-border/80 p-8 md:p-10 mb-8 shadow-xs"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--primary)/0.12),transparent_60%)]" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="verified" size="xs">Quadly Careers</Badge>
              <span className="text-xs text-muted-foreground font-medium">• Student-Friendly Schedules</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Campus Jobs & Gigs</h1>
            <p className="text-muted-foreground text-sm mt-1 max-w-lg leading-relaxed">
              Discover part-time positions, on-campus student gigs, research assistantships, and flexible freelance projects.
            </p>
          </div>
          <div className="flex w-full md:w-auto items-center gap-2.5">
            <div className="relative w-full md:w-72">
              <Input
                placeholder="Search student roles..."
                leftIcon={<Search size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {user && (
              <Button variant="glow" className="shrink-0 gap-1.5" onClick={() => setShowCreateModal(true)}>
                <Plus size={16} />
                <span className="hidden sm:inline">Post Job</span>
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Type Filters */}
      <div className="flex overflow-x-auto pb-4 mb-6 gap-2 scrollbar-hide">
        {JOB_TYPES.map(type => {
          const Icon = type.icon
          return (
            <Button
              key={type.value}
              variant={activeType === type.value ? "default" : "secondary"}
              className="rounded-full px-5 gap-2 shrink-0"
              onClick={() => setActiveType(type.value)}
            >
              <Icon size={15} />
              {type.label}
            </Button>
          )
        })}
      </div>

      {/* Jobs Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="h-56 rounded-xl bg-muted animate-pulse border border-border" />
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {jobs.map(job => (
            <motion.div key={job.id} variants={item} className="h-full">
              <Card3D
                neonGlow="purple"
                maxTilt={10}
                className="h-full p-5 flex flex-col justify-between"
                onClick={() => setSelectedJob(job)}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${TYPE_COLORS[job.job_type] || "bg-muted"}`}>
                      {job.job_type.replace("-", " ").replace(/^\w/, c => c.toUpperCase())}
                    </span>
                    <span className="text-xs text-muted-foreground">{timeAgo(job.created_at)}</span>
                  </div>
                  <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {job.title}
                  </h3>
                  {job.company && (
                    <p className="text-sm text-cyan-300/80 font-medium mt-1">{job.company}</p>
                  )}
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-3 mb-4 leading-relaxed">{job.description}</p>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign size={14} className="text-emerald-400 shrink-0" />
                      <span className="font-bold text-emerald-400">{formatPay(job)}</span>
                    </div>
                    {job.location && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin size={13} className="shrink-0 text-cyan-400" />
                        <span className="truncate">{job.location}</span>
                        {job.is_remote && (
                          <RemoteBadge className="ml-1" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Skills Tags */}
                  {job.skills_required && job.skills_required.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.skills_required.slice(0, 4).map(skill => (
                        <span key={skill} className="bg-white/5 border border-white/10 text-[11px] px-2 py-0.5 rounded-md text-white/70 font-medium">
                          {skill}
                        </span>
                      ))}
                      {job.skills_required.length > 4 && (
                        <span className="text-[11px] text-muted-foreground font-medium">+{job.skills_required.length - 4} more</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 overflow-hidden flex items-center justify-center font-bold text-white text-xs shadow-xs">
                      {job.profiles?.avatar_url ? (
                        <img src={job.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        job.profiles?.full_name?.charAt(0) || "?"
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {job.profiles?.full_name || "Campus Poster"}
                    </span>
                  </div>
                  <Button
                    size="xs"
                    variant="outline"
                    className="gap-1 text-xs border-white/15 hover:border-cyan-400/40"
                    onClick={() => setSelectedJob(job)}
                  >
                    <Eye size={12} /> View Role
                  </Button>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 bg-card rounded-2xl border border-dashed border-border"
        >
          <div className="bg-primary/10 p-4 rounded-2xl inline-block mb-4">
            <Briefcase className="text-primary" size={36} />
          </div>
          <h3 className="text-xl font-semibold mb-2">No jobs posted yet</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            Be the first to post a job opportunity for your campus community.
          </p>
          {user && (
            <Button onClick={() => setShowCreateModal(true)} className="gap-2">
              <Plus size={18} /> Post the First Job
            </Button>
          )}
        </motion.div>
      )}

      {/* Job Details Modal */}
      <AnimatePresence>
        {selectedJob && (
          <JobDetailModal
            job={selectedJob}
            formatPay={formatPay}
            onClose={() => setSelectedJob(null)}
          />
        )}
      </AnimatePresence>

      {/* Create Job Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateJobModal
            onClose={() => setShowCreateModal(false)}
            onCreated={() => { setShowCreateModal(false); fetchJobs(); }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Job Detail Modal ───────────────────────────────────────────────
function JobDetailModal({ job, formatPay, onClose }) {
  const [copiedPhone, setCopiedPhone] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const phone = job.profiles?.phone

  const copyPhone = () => {
    if (phone) {
      navigator.clipboard.writeText(phone)
      setCopiedPhone(true)
      setTimeout(() => setCopiedPhone(false), 2500)
    }
  }

  const handleApply = async () => {
    setIsApplying(true)
    try {
      await api.jobs.apply(job.id, { pitch: "Enthusiastic applicant ready to contribute immediately!" })
      setHasApplied(true)
    } catch (err) {
      console.error(err)
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: "spring", damping: 26, stiffness: 350 }}
        className="bg-[#0B0F1C]/95 border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] rounded-3xl w-full max-w-xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${TYPE_COLORS[job.job_type] || "bg-muted"}`}>
                  {job.job_type.replace("-", " ").replace(/^\w/, c => c.toUpperCase())}
                </span>
                {job.is_remote && (
                  <span className="flex items-center gap-1 text-xs bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200/50 px-2.5 py-0.5 rounded-full font-medium">
                    <Wifi size={11} /> Remote Allowed
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold">{job.title}</h2>
              {job.company && (
                <p className="text-base text-muted-foreground font-medium mt-0.5">{job.company}</p>
              )}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors shrink-0">
              <X size={20} />
            </button>
          </div>

          {/* Pay & Quick Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6 bg-muted/40 p-4 rounded-xl border border-border/50">
            <div>
              <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <DollarSign size={13} className="text-emerald-500" /> Compensation
              </div>
              <div className="text-lg font-bold text-emerald-600">{formatPay(job)}</div>
            </div>
            {job.location && (
              <div>
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <MapPin size={13} /> Location
                </div>
                <div className="text-sm font-medium">{job.location}</div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Role Overview & Responsibilities</h4>
            <div className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed bg-muted/20 p-3.5 rounded-xl border border-border/30">
              {job.description}
            </div>
          </div>

          {/* Skills Required */}
          {job.skills_required && job.skills_required.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Required Skills & Tools</h4>
              <div className="flex flex-wrap gap-2">
                {job.skills_required.map(s => (
                  <span key={s} className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-lg font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Poster Profile & Contact Section */}
          <div className="border-t border-border pt-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center font-bold text-primary">
                {job.profiles?.avatar_url ? (
                  <img src={job.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  job.profiles?.full_name?.charAt(0) || "?"
                )}
              </div>
              <div>
                <div className="font-semibold text-sm">{job.profiles?.full_name || "Campus Community"}</div>
                <div className="text-xs text-muted-foreground">{job.profiles?.university || "University Member"}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {job.application_url ? (
                <a href={job.application_url} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2 shadow-sm">
                    Apply Now <ExternalLink size={14} />
                  </Button>
                </a>
              ) : phone ? (
                <Button onClick={copyPhone} variant={copiedPhone ? "secondary" : "default"} className="gap-1.5 text-xs">
                  {copiedPhone ? (
                    <>
                      <Check size={14} className="text-emerald-500" /> Phone Copied
                    </>
                  ) : (
                    <>
                      <Phone size={14} /> Contact: {phone}
                    </>
                  )}
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="text-xs" onClick={() => alert("Please check campus student directory or message the poster on campus.")}>
                  Contact Student
                </Button>
              )}

              <Button
                variant="glow"
                size="sm"
                className="gap-1.5 text-xs shadow-md"
                onClick={handleApply}
                disabled={hasApplied || isApplying}
                loading={isApplying}
              >
                {hasApplied ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    <span>Applied!</span>
                  </>
                ) : (
                  <>
                    <Briefcase size={14} />
                    <span>Apply via Campus ID</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Create Job Modal ────────────────────────────────────────────────
function CreateJobModal({ onClose, onCreated }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [skillInput, setSkillInput] = useState("")
  const [skills, setSkills] = useState([])
  const { user } = useAuthStore()

  const addSkill = () => {
    const trimmed = skillInput.trim()
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed])
      setSkillInput("")
    }
  }

  const removeSkill = (skill) => {
    setSkills(prev => prev.filter(s => s !== skill))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const fd = new FormData(e.target)

    try {
      await api.jobs.create({
        title: fd.get("title"),
        company: fd.get("company") || "Campus Department",
        description: fd.get("description"),
        job_type: fd.get("job_type") || "part-time",
        location: fd.get("location") || "On-Campus",
        is_remote: fd.get("is_remote") === "on",
        pay_min: fd.get("pay_min") ? parseFloat(fd.get("pay_min")) : 18,
        pay_max: fd.get("pay_max") ? parseFloat(fd.get("pay_max")) : 25,
        pay_period: fd.get("pay_period") || "hourly",
        skills_required: skills.length > 0 ? skills : ["Communication"],
        application_url: fd.get("application_url") || null,
        status: "active",
      })

      onCreated()
    } catch (err) {
      console.error("Error creating job:", err)
      setError(err.message || "Failed to create job posting.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: "spring", damping: 26, stiffness: 350 }}
        className="bg-[#0B0F1C]/95 border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-black text-white">Post a Campus Job</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Share an opportunity with fellow university peers</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-muted-foreground hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm bg-red-500/10 text-red-600 rounded-lg border border-red-200">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input id="title" name="title" placeholder="e.g. Lab Assistant, Barista, Frontend Tutor" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Department / Organization</Label>
            <Input id="company" name="company" placeholder="e.g. Computer Science Dept, Campus Cafe" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="job_type">Job Type *</Label>
              <select
                id="job_type"
                name="job_type"
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                required
              >
                <option value="">Select type</option>
                <option value="part-time">Part-Time</option>
                <option value="full-time">Full-Time</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
                <option value="on-campus">On-Campus</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="e.g. Library, Building A" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="is_remote" name="is_remote" className="rounded border-border" />
            <Label htmlFor="is_remote" className="cursor-pointer flex items-center gap-2">
              <Wifi size={14} className="text-green-600" /> This job can be done remotely
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label htmlFor="pay_min">Min Pay ($)</Label>
              <Input id="pay_min" name="pay_min" type="number" step="0.01" min="0" placeholder="12.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pay_max">Max Pay ($)</Label>
              <Input id="pay_max" name="pay_max" type="number" step="0.01" min="0" placeholder="18.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pay_period">Pay Period</Label>
              <select
                id="pay_period"
                name="pay_period"
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <option value="hourly">Hourly</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="fixed">Fixed Price</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Skills Required</Label>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                placeholder="Type a skill and press Enter"
              />
              <Button type="button" variant="secondary" onClick={addSkill}>Add</Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map(skill => (
                  <span key={skill} className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the role, responsibilities, requirements, and any perks..."
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="application_url">Application Link (optional)</Label>
            <Input id="application_url" name="application_url" type="url" placeholder="https://..." />
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-border">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Post Job"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
