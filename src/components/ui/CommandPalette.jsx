import * as React from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, ShoppingBag, Briefcase, Home, GraduationCap,
  Zap, FileText, Plus, User, ArrowRight, CornerDownLeft, X, Sparkles,
  Layers, Users, LayoutDashboard, MessageSquare, Bell, Shield
} from "lucide-react"

const COMMAND_ITEMS = [
  { id: "dashboard", title: "Student OS Dashboard", category: "Overview", icon: LayoutDashboard, path: "/dashboard", color: "text-cyan-400" },
  { id: "marketplace", title: "Campus Marketplace", category: "Commerce", icon: ShoppingBag, path: "/marketplace", color: "text-blue-400" },
  { id: "rentals", title: "Short-Term Gear Rentals", category: "Commerce", icon: Layers, path: "/rentals", color: "text-amber-400" },
  { id: "sell", title: "List an Item for Sale", category: "Actions", icon: Plus, path: "/marketplace/create", color: "text-emerald-400" },
  { id: "jobs", title: "Find Student Jobs & Gigs", category: "Career", icon: Briefcase, path: "/jobs", color: "text-purple-400" },
  { id: "roommates", title: "Find Roommates & Housing", category: "Housing", icon: Home, path: "/roommates", color: "text-teal-400" },
  { id: "study-groups", title: "Active Study Circles", category: "Academics", icon: Users, path: "/study-groups", color: "text-indigo-400" },
  { id: "tutoring", title: "Book a Peer Tutor", category: "Academics", icon: GraduationCap, path: "/tutoring", color: "text-yellow-400" },
  { id: "skills", title: "Skill Barter Exchange", category: "Community", icon: Zap, path: "/skills", color: "text-pink-400" },
  { id: "notes", title: "Download Course Notes & Guides", category: "Academics", icon: FileText, path: "/notes", color: "text-cyan-400" },
  { id: "messages", title: "Campus Messenger & Inquiries", category: "Communication", icon: MessageSquare, path: "/messages", color: "text-emerald-400" },
  { id: "notifications", title: "Notification Feed", category: "Updates", icon: Bell, path: "/notifications", color: "text-orange-400" },
  { id: "admin", title: "Admin Console & Moderation", category: "System", icon: Shield, path: "/admin", color: "text-rose-400" },
  { id: "profile", title: "My Profile & Activity", category: "Account", icon: User, path: "/profile", color: "text-indigo-400" },
]

export function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const navigate = useNavigate()
  const inputRef = React.useRef(null)

  // Focus input when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setSelectedIndex(0)
      setQuery("")
    }
  }, [isOpen])

  const filteredItems = React.useMemo(() => {
    if (!query) return COMMAND_ITEMS
    const q = query.toLowerCase()
    return COMMAND_ITEMS.filter(
      item => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    )
  }, [query])

  const handleSelect = (item) => {
    if (item && item.path) {
      navigate(item.path)
      onClose()
    }
  }

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1))
      } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
        e.preventDefault()
        handleSelect(filteredItems[selectedIndex])
      } else if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, filteredItems, selectedIndex])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Palette Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#0B0F1C]/95 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
              <Search className="text-cyan-400 shrink-0" size={18} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSelectedIndex(0)
                }}
                placeholder="Search campus modules, jobs, listings, notes..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white/10 text-muted-foreground">
                ESC
              </span>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => {
                  const Icon = item.icon
                  const isSelected = index === selectedIndex
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? "bg-gradient-to-r from-primary/20 via-purple-500/15 to-transparent text-foreground border border-primary/30 shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-white/5 ${item.color}`}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground leading-tight">{item.title}</div>
                          <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{item.category}</div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-1 text-xs text-primary font-medium animate-pulse">
                          <span>Open</span>
                          <CornerDownLeft size={12} />
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No matching results for "{query}"
                </div>
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="px-4 py-2.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="px-1 py-0.5 rounded bg-white/10 font-mono text-[9px]">↑</span>
                  <span className="px-1 py-0.5 rounded bg-white/10 font-mono text-[9px]">↓</span>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[9px]">↵</span>
                  <span>Select</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <Sparkles size={11} />
                <span>Quadly Quick Actions</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CommandPalette
