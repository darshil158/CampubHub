import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  User, Mail, GraduationCap, Phone, Camera, Save,
  Briefcase, Home, ShoppingBag, BookOpen, Wrench,
  FileText, Loader2, AlertCircle, Check, Trash2,
  Edit3, X, ChevronRight, Settings, LogOut, Shield
} from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { Textarea } from "../components/ui/Textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Card3D } from "../components/ui/Card3D"
import { Badge, VerifiedBadge } from "../components/ui/Badge"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "../store/useAuthStore"

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "listings", label: "Marketplace", icon: ShoppingBag },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "roommates", label: "Roommates", icon: Home },
  { id: "settings", label: "Settings", icon: Settings },
]

export default function Profile() {
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("profile")

  if (!user) {
    navigate("/login")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Profile Hero */}
      <ProfileHero user={user} />

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-1.5 mb-8 bg-[#0B0F1C]/90 border border-white/10 backdrop-blur-2xl rounded-2xl p-1.5 scrollbar-hide shadow-xl">
        {TABS.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_18px_rgba(0,240,255,0.35)] border border-white/20"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} className={isActive ? "text-white" : "text-muted-foreground"} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "profile" && <ProfileTab user={user} />}
          {activeTab === "listings" && <ListingsTab user={user} />}
          {activeTab === "jobs" && <JobsTab user={user} />}
          {activeTab === "roommates" && <RoommatesTab user={user} />}
          {activeTab === "settings" && <SettingsTab user={user} signOut={signOut} navigate={navigate} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─── Profile Hero ────────────────────────────────────────────────────
function ProfileHero({ user }) {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
      setProfile(data)
    }
    fetchProfile()
  }, [user.id])

  const displayName = profile?.full_name || user.user_metadata?.full_name || "Campus User"
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <div className="mb-8">
      <Card3D neonGlow="purple" maxTilt={8} className="p-8 border-white/15 bg-gradient-to-br from-[#12182B]/95 via-[#0C101F]/95 to-[#070A14]/95 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar with Neon Hologram Ring */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-500 via-primary to-pink-500 p-0.5 shadow-[0_0_20px_rgba(124,102,255,0.4)]">
              <div className="w-full h-full rounded-2xl bg-[#0B0F1C] overflow-hidden flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-2xl font-black">{initials}</span>
                )}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-black p-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera size={12} />
            </div>
          </div>

          {/* Info */}
          <div className="text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{displayName}</h1>
              <VerifiedBadge size="xs" />
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm flex items-center gap-1.5 justify-center sm:justify-start mt-1">
              <Mail size={13} className="text-cyan-400" />
              {user.email}
            </p>
            {profile?.university && (
              <p className="text-muted-foreground text-xs sm:text-sm flex items-center gap-1.5 justify-center sm:justify-start mt-0.5">
                <GraduationCap size={13} className="text-purple-400" />
                {profile.university}
              </p>
            )}
            {profile?.bio && (
              <p className="text-xs sm:text-sm text-white/70 mt-2 max-w-lg leading-relaxed">{profile.bio}</p>
            )}
          </div>

          {/* Member badge with 3D Holographic Border */}
          <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 text-center shrink-0 shadow-xs">
            <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Campus Matrix</div>
            <div className="font-extrabold text-sm text-cyan-300 mt-0.5">
              Since {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </div>
          </div>
        </div>
      </Card3D>
    </div>
  )
}

// ─── Profile Edit Tab ────────────────────────────────────────────────
function ProfileTab({ user }) {
  const [profile, setProfile] = useState({
    full_name: "", university: "", bio: "", phone: ""
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) // 'success' | 'error'

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
      if (data) {
        setProfile({
          full_name: data.full_name || "",
          university: data.university || "",
          bio: data.bio || "",
          phone: data.phone || "",
        })
      }
      setIsLoading(false)
    }
    fetch()
  }, [user.id])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus(null)
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, ...profile })

      if (error) throw error
      setSaveStatus("success")
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error(err)
      setSaveStatus("error")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="h-16 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <Card className="border-white/10 bg-[#0E1322]/90 backdrop-blur-2xl shadow-2xl rounded-3xl">
      <CardHeader className="border-b border-white/10 pb-4">
        <CardTitle className="flex items-center gap-2 text-white">
          <User size={20} className="text-cyan-400" /> Edit Campus Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-xs font-semibold text-white/80">Full Name</Label>
            <Input
              id="full_name"
              value={profile.full_name}
              onChange={(e) => setProfile(p => ({ ...p, full_name: e.target.value }))}
              placeholder="Your full name"
              className="bg-[#0B0F1C]/90 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="university" className="text-xs font-semibold text-white/80">University</Label>
            <Input
              id="university"
              value={profile.university}
              onChange={(e) => setProfile(p => ({ ...p, university: e.target.value }))}
              placeholder="Your college or university"
              className="bg-[#0B0F1C]/90 border-white/10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-xs font-semibold text-white/80">Phone Number</Label>
          <Input
            id="phone"
            value={profile.phone}
            onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
            placeholder="+1 (555) 000-0000"
            className="bg-[#0B0F1C]/90 border-white/10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-xs font-semibold text-white/80">Bio</Label>
          <Textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
            placeholder="Tell fellow students about yourself..."
            rows={3}
            className="bg-[#0B0F1C]/90 border-white/10"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <AnimatePresence>
            {saveStatus === "success" && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-emerald-400 text-sm font-semibold"
              >
                <Check size={16} /> Profile saved successfully!
              </motion.div>
            )}
            {saveStatus === "error" && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm font-semibold"
              >
                <AlertCircle size={16} /> Failed to save. Try again.
              </motion.div>
            )}
          </AnimatePresence>
          {!saveStatus && <div />}
          <Button onClick={handleSave} disabled={isSaving} variant="glow" className="gap-2">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Generic Listings Manager ────────────────────────────────────────
function ListingsManager({ user, tableName, icon: Icon, emptyTitle, emptyDesc, columns }) {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  const fetchItems = async () => {
    setIsLoading(true)
    try {
      const fkColumn = tableName === "listings" ? "seller_id" : "poster_id"
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq(fkColumn, user.id)
        .order("created_at", { ascending: false })

      if (error && error.code !== "42P01") throw error
      setItems(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [user.id, tableName])

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return
    setDeletingId(id)
    try {
      const { error } = await supabase.from(tableName).delete().eq("id", id)
      if (error) throw error
      setItems(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      console.error(err)
    } finally {
      setDeletingId(null)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { error } = await supabase.from(tableName).update({ status: newStatus }).eq("id", id)
      if (error) throw error
      setItems(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item))
    } catch (err) {
      console.error(err)
    }
  }

  const statusColors = {
    active: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    filled: "bg-amber-500/10 text-amber-600 border-amber-200",
    taken: "bg-amber-500/10 text-amber-600 border-amber-200",
    closed: "bg-red-500/10 text-red-500 border-red-200",
    sold: "bg-red-500/10 text-red-500 border-red-200",
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(n => (
          <div key={n} className="h-20 rounded-xl bg-muted animate-pulse border border-border" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-[#0E1322]/80 backdrop-blur-xl rounded-3xl border border-dashed border-white/15">
        <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl inline-block mb-4 text-cyan-400 shadow-xs">
          <Icon size={32} />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">{emptyTitle}</h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">{emptyDesc}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map(item => (
        <motion.div
          key={item.id}
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="border-white/10 bg-[#0E1322]/90 backdrop-blur-xl hover:border-cyan-400/40 transition-all rounded-2xl shadow-md">
            <CardContent className="p-4 flex items-center gap-4">
              {/* Icon */}
              <div className="bg-white/5 border border-white/10 p-3 rounded-xl shrink-0 hidden sm:flex text-cyan-300">
                <Icon size={20} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white truncate">{item.title}</h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  {columns.map(col => col.render(item)).filter(Boolean).map((content, i) => (
                    <span key={i} className="text-white/70">{content}</span>
                  ))}
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Status */}
              <span className={`text-xs px-3 py-1 rounded-full font-semibold border shrink-0 ${statusColors[item.status] || "bg-muted"}`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                {item.status === "active" && (
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className="text-xs border border-white/15 rounded-lg px-2.5 py-1.5 bg-[#0B0F1C] text-white"
                  >
                    <option value="active">Active</option>
                    {tableName === "jobs" && <option value="filled">Filled</option>}
                    {tableName === "roommates" && <option value="taken">Taken</option>}
                    {tableName === "listings" && <option value="sold">Sold</option>}
                    <option value="closed">Closed</option>
                  </select>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="p-2 hover:bg-red-500/15 text-red-400 rounded-lg transition-colors cursor-pointer"
                  title="Delete"
                >
                  {deletingId === item.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Listings Tab ────────────────────────────────────────────────────
function ListingsTab({ user }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShoppingBag size={20} className="text-primary" /> My Marketplace Listings
        </h2>
      </div>
      <ListingsManager
        user={user}
        tableName="listings"
        icon={ShoppingBag}
        emptyTitle="No marketplace listings"
        emptyDesc="Items you list for sale on the marketplace will appear here."
        columns={[
          { render: (item) => item.price ? `$${Number(item.price).toFixed(2)}` : null },
          { render: (item) => item.category || null },
        ]}
      />
    </div>
  )
}

// ─── Jobs Tab ────────────────────────────────────────────────────────
function JobsTab({ user }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Briefcase size={20} className="text-primary" /> My Job Postings
        </h2>
      </div>
      <ListingsManager
        user={user}
        tableName="jobs"
        icon={Briefcase}
        emptyTitle="No job postings"
        emptyDesc="Jobs you post will appear here for you to manage."
        columns={[
          { render: (item) => item.job_type ? item.job_type.replace("-", " ") : null },
          { render: (item) => item.company || null },
        ]}
      />
    </div>
  )
}

// ─── Roommates Tab ───────────────────────────────────────────────────
function RoommatesTab({ user }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Home size={20} className="text-primary" /> My Roommate Listings
        </h2>
      </div>
      <ListingsManager
        user={user}
        tableName="roommates"
        icon={Home}
        emptyTitle="No roommate listings"
        emptyDesc="Roommate listings you create will appear here."
        columns={[
          { render: (item) => item.rent ? `$${Number(item.rent).toFixed(0)}/mo` : null },
          { render: (item) => item.listing_type === "offering" ? "Offering" : "Looking" },
        ]}
      />
    </div>
  )
}

// ─── Settings Tab ────────────────────────────────────────────────────
function SettingsTab({ user, signOut, navigate }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate("/")
  }

  return (
    <div className="space-y-6">
      {/* Account Info */}
      <Card className="border-white/10 bg-[#0E1322]/90 backdrop-blur-2xl shadow-2xl rounded-3xl">
        <CardHeader className="border-b border-white/10 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <Shield size={18} className="text-cyan-400" /> Account Security & Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div>
              <div className="text-sm font-semibold text-white">Email Address</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{user.email}</div>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-semibold">Verified</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div>
              <div className="text-sm font-semibold text-white">Campus Matrix ID</div>
              <div className="text-xs text-muted-foreground font-mono">{user.id.slice(0, 16)}...</div>
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-sm font-semibold text-white">Account Created</div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {new Date(user.created_at).toLocaleDateString("en-US", {
                  weekday: "long", year: "numeric", month: "long", day: "numeric"
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="border-white/10 bg-[#0E1322]/90 backdrop-blur-2xl shadow-2xl rounded-3xl">
        <CardHeader className="border-b border-white/10 pb-4">
          <CardTitle className="text-lg text-white">Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/15 border border-amber-500/30 p-2.5 rounded-xl text-amber-400">
                <LogOut size={16} />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white">Sign Out</div>
                <div className="text-xs text-muted-foreground">Log out of your campus account</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="bg-red-500/15 border border-red-500/30 p-2.5 rounded-xl text-red-400">
                <Trash2 size={16} />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-red-400">Delete Account</div>
                <div className="text-xs text-muted-foreground">Permanently delete your data</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </button>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0E1322]/95 border border-white/15 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-red-500/15 border border-red-500/30 p-3 rounded-2xl w-fit mx-auto mb-4 text-red-400 shadow-md">
                <AlertCircle size={26} />
              </div>
              <h3 className="text-xl font-bold text-center text-white mb-2">Delete Account?</h3>
              <p className="text-xs sm:text-sm text-muted-foreground text-center mb-6 leading-relaxed">
                This action is irreversible. All your listings, posts, and data will be permanently removed from the Campus Matrix.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 border-white/15 hover:border-white/30" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                <Button variant="destructive" className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]">Delete</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
