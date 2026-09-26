import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Plus, Sparkles, ChevronDown, ShoppingBag, Layers,
  Briefcase, Home as HomeIcon, Users, GraduationCap, Zap,
  FileText, LayoutDashboard, MessageSquare, Bell, Shield,
  LogOut, User as UserIcon, Check, ArrowRight, Compass,
  Flame, ExternalLink, Menu, X, ShieldCheck
} from "lucide-react"
import { useAuthStore } from "../../store/useAuthStore"
import { api } from "../../services/api"
import { BrandLogo } from "../ui/BrandLogo"
import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"
import { handleImageError, FALLBACK_AVATAR_DATA_URI } from "../../lib/utils"

// Primary direct links that appear in the navbar
const PRIMARY_LINKS = [
  {
    name: "Marketplace",
    path: "/marketplace",
    icon: ShoppingBag,
    badge: "Trade",
    badgeColor: "text-cyan-300 border-cyan-400/40 bg-cyan-500/20",
    desc: "Textbooks, electronics & dorm essentials"
  },
  {
    name: "Rentals",
    path: "/rentals",
    icon: Layers,
    badge: "Gear",
    badgeColor: "text-purple-300 border-purple-400/40 bg-purple-500/20",
    desc: "Cameras, consoles, lab tools & calculators"
  },
  {
    name: "Jobs & Gigs",
    path: "/jobs",
    icon: Briefcase,
    badge: "Earn",
    badgeColor: "text-emerald-300 border-emerald-400/40 bg-emerald-500/20",
    desc: "On-campus roles, research labs & student gigs"
  },
  {
    name: "Roommates",
    path: "/roommates",
    icon: HomeIcon,
    badge: "Housing",
    badgeColor: "text-amber-300 border-amber-400/40 bg-amber-500/20",
    desc: "Dorm sublets, flatmates & verified peer living"
  },
]

// Secondary grouped links under the "Academics & Life" 3D mega dropdown
const ACADEMIC_COMMUNITY_LINKS = [
  {
    name: "Study Circles",
    path: "/study-groups",
    icon: Users,
    tag: "Collab",
    gradient: "from-cyan-500 to-blue-600",
    shadow: "rgba(0, 240, 255, 0.35)",
    desc: "Join exam study groups, coding sprints & book circles"
  },
  {
    name: "Peer Tutoring",
    path: "/tutoring",
    icon: GraduationCap,
    tag: "Learn",
    gradient: "from-blue-600 to-indigo-600",
    shadow: "rgba(59, 130, 246, 0.35)",
    desc: "Book 1-on-1 tutoring sessions with top campus peers"
  },
  {
    name: "Skill Swaps",
    path: "/skills",
    icon: Zap,
    tag: "Swap",
    gradient: "from-pink-500 to-purple-600",
    shadow: "rgba(236, 72, 153, 0.35)",
    desc: "Barter programming, UI design, music & languages"
  },
  {
    name: "Course Notes",
    path: "/notes",
    icon: FileText,
    tag: "Guides",
    gradient: "from-emerald-500 to-teal-600",
    shadow: "rgba(16, 185, 129, 0.35)",
    desc: "Download high-yield semester decks & solved past papers"
  },
]

// Multi-category Quick Creator Options for + Post button
const POST_OPTIONS = [
  {
    title: "Marketplace Listing",
    subtitle: "Sell textbooks, electronics & gear",
    path: "/create-listing",
    icon: ShoppingBag,
    color: "from-cyan-500 to-blue-600"
  },
  {
    title: "Rental Equipment",
    subtitle: "List cameras, calculators & tools",
    path: "/rentals",
    icon: Layers,
    color: "from-purple-500 to-indigo-600"
  },
  {
    title: "Roommate / Sublet",
    subtitle: "Post dorm room or flat vacancy",
    path: "/roommates",
    icon: HomeIcon,
    color: "from-amber-500 to-orange-600"
  },
  {
    title: "Skill Swap Offer",
    subtitle: "Trade coding, tutoring or art",
    path: "/skills",
    icon: Zap,
    color: "from-pink-500 to-purple-600"
  },
  {
    title: "Share Study Notes",
    subtitle: "Upload exam guides & lecture decks",
    path: "/notes",
    icon: FileText,
    color: "from-emerald-500 to-teal-600"
  }
]

export function Navbar({ onOpenCommandPalette }) {
  const { user, signOut, switchStudent } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  // Dropdown visibility states
  const [academicsOpen, setAcademicsOpen] = useState(false)
  const [postOpen, setPostOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)
  const [unreadCount, setUnreadCount] = useState(2)
  const [students, setStudents] = useState([])

  const academicsRef = useRef(null)
  const postRef = useRef(null)
  const profileRef = useRef(null)

  // Fetch unread notifications count and demo personas
  useEffect(() => {
    let mounted = true
    const loadCountsAndStudents = async () => {
      try {
        const count = await api.notifications.getUnreadCount()
        if (mounted) setUnreadCount(count)
        const demoStudents = await api.auth.getDemoStudents()
        if (mounted && demoStudents) setStudents(demoStudents.slice(0, 4))
      } catch {
        // fallback
      }
    }
    loadCountsAndStudents()
    return () => { mounted = false }
  }, [user])

  // Close menus on route change
  useEffect(() => {
    setAcademicsOpen(false)
    setPostOpen(false)
    setProfileMenuOpen(false)
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (academicsRef.current && !academicsRef.current.contains(e.target)) {
        setAcademicsOpen(false)
      }
      if (postRef.current && !postRef.current.contains(e.target)) {
        setPostOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setProfileMenuOpen(false)
    navigate("/")
  }

  const isRouteActive = (path) => {
    if (path === "/") return location.pathname === "/"
    return location.pathname.startsWith(path)
  }

  const isAcademicsActive = ACADEMIC_COMMUNITY_LINKS.some(link => isRouteActive(link.path))

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#070A14]/90 backdrop-blur-2xl shadow-[0_4px_35px_rgba(0,0,0,0.65)]">
      <div className="container mx-auto px-4 sm:px-6 h-17 flex items-center justify-between gap-3">
        
        {/* Left: Brand Identity & Primary Nav Links */}
        <div className="flex items-center gap-5 xl:gap-7">
          <BrandLogo size="md" showWordmark={true} showBadge={true} badgeText="3D OS" />

          {/* Desktop Navigation Row */}
          <nav
            className="hidden lg:flex items-center space-x-1 relative text-sm font-medium"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {PRIMARY_LINKS.map(link => {
              const active = isRouteActive(link.path)
              const Icon = link.icon
              const isHovered = hoveredLink === link.path

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onMouseEnter={() => setHoveredLink(link.path)}
                  className={`relative px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 text-xs font-semibold ${
                    active
                      ? "text-cyan-300 font-bold"
                      : "text-muted-foreground hover:text-white"
                  }`}
                  style={{ perspective: 600 }}
                >
                  {/* Smooth 3D Motion Container */}
                  <motion.div
                    whileHover={{ y: -2, rotateX: 6, scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    className="flex items-center gap-1.5 z-10"
                  >
                    <Icon
                      size={15}
                      className={
                        active
                          ? "text-cyan-400 drop-shadow-[0_0_8px_#00F0FF]"
                          : isHovered
                          ? "text-cyan-300"
                          : "text-muted-foreground"
                      }
                    />
                    <span>{link.name}</span>
                    <span
                      className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded-md border ${
                        active
                          ? link.badgeColor
                          : "bg-white/5 border-white/10 text-white/50"
                      }`}
                    >
                      {link.badge}
                    </span>
                  </motion.div>

                  {/* Active Neon Line Indicator */}
                  {active && (
                    <motion.div
                      layoutId="navbarActiveIndicator"
                      className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-gradient-to-r from-cyan-400 via-primary to-purple-500 rounded-full shadow-[0_0_10px_#00F0FF]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  {/* Gliding Hover Backdrop Pill */}
                  {isHovered && !active && (
                    <motion.div
                      layoutId="navbarHoverPill"
                      className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </Link>
              )
            })}

            {/* Academics & Life 3D Mega Dropdown Trigger */}
            <div
              ref={academicsRef}
              className="relative"
              onMouseEnter={() => setAcademicsOpen(true)}
              onMouseLeave={() => setAcademicsOpen(false)}
            >
              <button
                onClick={() => setAcademicsOpen(prev => !prev)}
                className={`relative px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                  isAcademicsActive || academicsOpen
                    ? "text-purple-300 font-bold bg-purple-500/10 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
                style={{ perspective: 600 }}
              >
                <motion.div
                  whileHover={{ y: -2, rotateX: 6, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  className="flex items-center gap-1.5"
                >
                  <Sparkles size={14} className={isAcademicsActive || academicsOpen ? "text-purple-400" : "text-purple-400/80"} />
                  <span>Academics & Life</span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-300 ${academicsOpen ? "rotate-180 text-purple-300" : "text-muted-foreground"}`}
                  />
                </motion.div>

                {isAcademicsActive && (
                  <motion.div
                    layoutId="navbarActiveIndicator"
                    className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-gradient-to-r from-purple-400 to-pink-500 rounded-full shadow-[0_0_10px_#a855f7]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>

              {/* 3D Floating Mega-Menu Popover with Invisible Bridge Container */}
              <AnimatePresence>
                {academicsOpen && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96, rotateX: -6 }}
                      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96, rotateX: -6 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className="w-[470px] p-3.5 rounded-2xl bg-[#090D1A]/98 border border-purple-500/30 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(168,85,247,0.22)] overflow-hidden"
                      style={{ transformOrigin: "top left" }}
                    >
                      {/* Header */}
                      <div className="px-3 pt-1 pb-2.5 flex items-center justify-between border-b border-white/10">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-purple-300">
                          <Compass size={14} className="text-purple-400" />
                          <span>Campus Academic & Peer Hub</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">4 verified modules</span>
                      </div>

                      {/* 2x2 Grid of Feature Cards with 3D Tilt */}
                      <div className="grid grid-cols-2 gap-2 mt-2.5">
                        {ACADEMIC_COMMUNITY_LINKS.map(item => {
                          const Icon = item.icon
                          const active = isRouteActive(item.path)
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setAcademicsOpen(false)}
                              className={`p-3 rounded-xl border transition-all flex flex-col justify-between group cursor-pointer ${
                                active
                                  ? "bg-white/10 border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                                  : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div
                                  className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${item.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                                  style={{ boxShadow: `0 0 15px ${item.shadow}` }}
                                >
                                  <Icon size={16} />
                                </div>
                                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10">
                                  {item.tag}
                                </span>
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                                  {item.name}
                                </h4>
                                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug">
                                  {item.desc}
                                </p>
                              </div>
                            </Link>
                          )
                        })}
                      </div>

                      {/* Dropdown Quick Footer */}
                      <div className="mt-2.5 pt-2.5 border-t border-white/10 px-2 flex items-center justify-between text-xs">
                        <Link
                          to="/create-listing"
                          onClick={() => setAcademicsOpen(false)}
                          className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                        >
                          <Plus size={14} />
                          <span>Post New Listing / Skill</span>
                        </Link>
                        <button
                          onClick={() => {
                            setAcademicsOpen(false)
                            onOpenCommandPalette?.()
                          }}
                          className="text-[11px] text-muted-foreground hover:text-white flex items-center gap-1 cursor-pointer font-medium"
                        >
                          Search All <kbd className="font-mono text-[9px] bg-white/10 px-1 py-0.2 rounded border border-white/15">⌘K</kbd>
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>

        {/* Right Section: Command Palette, + Post Dropdown, Quick Docks & Profile Hub */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          
          {/* Quick Search ⌘K Pill Button */}
          <motion.button
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-400/40 text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-xs group"
            title="Quick Search (Cmd+K)"
          >
            <Search size={14} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            <span className="hidden xl:inline text-xs font-medium">Quick Search...</span>
            <kbd className="hidden sm:inline-block font-mono text-[10px] bg-black/50 px-1.5 py-0.5 rounded border border-white/15 text-muted-foreground group-hover:border-cyan-400/30">
              ⌘K
            </kbd>
          </motion.button>

          {/* Multi-Category "+ Post" Dropdown */}
          <div
            ref={postRef}
            className="relative hidden sm:block"
            onMouseEnter={() => setPostOpen(true)}
            onMouseLeave={() => setPostOpen(false)}
          >
            <button
              onClick={() => setPostOpen(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-primary text-white font-bold text-xs shadow-[0_0_18px_rgba(0,240,255,0.35)] hover:shadow-[0_0_24px_rgba(0,240,255,0.5)] transition-all hover:scale-104 border border-cyan-300/40 cursor-pointer"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Post</span>
              <ChevronDown size={11} className={`transition-transform duration-200 ${postOpen ? "rotate-180" : ""}`} />
            </button>

            {/* 3D Post Popover with Invisible Bridge */}
            <AnimatePresence>
              {postOpen && (
                <div className="absolute top-full right-0 pt-2 z-50">
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 420, damping: 28 }}
                    className="w-64 p-2.5 rounded-2xl bg-[#090D1A]/98 border border-cyan-500/30 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(0,240,255,0.15)] space-y-1"
                  >
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300 border-b border-white/10 mb-1 flex items-center justify-between">
                      <span>Create New</span>
                      <span className="text-[9px] font-mono text-muted-foreground">Select type</span>
                    </div>

                    {POST_OPTIONS.map(opt => {
                      const Icon = opt.icon
                      return (
                        <Link
                          key={opt.path}
                          to={opt.path}
                          onClick={() => setPostOpen(false)}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer"
                        >
                          <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${opt.color} text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-108 transition-transform`}>
                            <Icon size={14} />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                              {opt.title}
                            </h5>
                            <p className="text-[10px] text-muted-foreground truncate">
                              {opt.subtitle}
                            </p>
                          </div>
                        </Link>
                      )
                    })}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Access Utility Docks */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 pl-1 border-l border-white/10">
            {/* Dashboard Icon */}
            <Link
              to="/dashboard"
              className={`p-2 rounded-xl border transition-all text-xs font-semibold flex items-center gap-1.5 ${
                isRouteActive("/dashboard")
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                  : "border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white"
              }`}
              title="Student Dashboard"
            >
              <LayoutDashboard size={15} className="text-cyan-400" />
            </Link>

            {/* Chat / Messages Dock with Live Green Ping */}
            <Link
              to="/messages"
              className={`relative p-2 rounded-xl border transition-all ${
                isRouteActive("/messages")
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  : "border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white"
              }`}
              title="Campus Messenger"
            >
              <MessageSquare size={15} className="text-emerald-400" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
            </Link>

            {/* Notifications Dock with Unread Badge */}
            <Link
              to="/notifications"
              className={`relative p-2 rounded-xl border transition-all ${
                isRouteActive("/notifications")
                  ? "bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  : "border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white"
              }`}
              title="Notification Feed"
            >
              <Bell size={15} className="text-amber-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-black font-black text-[9px] flex items-center justify-center shadow-[0_0_8px_#f59e0b]">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Admin Moderation Shield */}
            <Link
              to="/admin"
              className={`p-2 rounded-xl border transition-all ${
                isRouteActive("/admin")
                  ? "bg-rose-500/20 text-rose-300 border-rose-400/40 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                  : "border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white"
              }`}
              title="Admin Matrix & Content Moderation"
            >
              <Shield size={15} className="text-rose-400" />
            </Link>
          </div>

          {/* Student Profile Hub & 3D Persona Switcher */}
          <div
            ref={profileRef}
            className="relative pl-1"
            onMouseEnter={() => setProfileMenuOpen(true)}
            onMouseLeave={() => setProfileMenuOpen(false)}
          >
            {user ? (
              <div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setProfileMenuOpen(prev => !prev)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all cursor-pointer shadow-xs"
                >
                  <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-xs overflow-hidden shrink-0">
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt=""
                        onError={(e) => handleImageError(e, FALLBACK_AVATAR_DATA_URI)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.user_metadata?.full_name?.charAt(0) || "U"
                    )}
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-bold text-white max-w-[100px] truncate leading-tight">
                      {user.user_metadata?.full_name?.split(" ")[0] || "Student"}
                    </span>
                    <span className="text-[10px] text-cyan-300 font-medium leading-tight">
                      Verified
                    </span>
                  </div>
                  <ChevronDown size={13} className={`hidden md:block transition-transform duration-200 text-muted-foreground ${profileMenuOpen ? "rotate-180 text-white" : ""}`} />
                </motion.button>

                {/* 3D Glass Profile & Persona Switcher Popover with Invisible Bridge */}
                <AnimatePresence>
                  {profileMenuOpen && (
                    <div className="absolute top-full right-0 pt-2 z-50">
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95, rotateX: -6 }}
                        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                        exit={{ opacity: 0, y: 6, scale: 0.95, rotateX: -6 }}
                        transition={{ type: "spring", stiffness: 420, damping: 28 }}
                        className="w-76 rounded-2xl bg-[#090D1A]/98 border border-cyan-500/30 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_25px_rgba(0,240,255,0.18)] p-4 space-y-3"
                        style={{ transformOrigin: "top right" }}
                      >
                        {/* Active User Card */}
                        <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold shadow-md overflow-hidden shrink-0">
                            {user.user_metadata?.avatar_url ? (
                              <img
                                src={user.user_metadata.avatar_url}
                                alt=""
                                onError={(e) => handleImageError(e, FALLBACK_AVATAR_DATA_URI)}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              user.user_metadata?.full_name?.charAt(0) || "U"
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-sm text-white truncate">
                                {user.user_metadata?.full_name || "Campus Student"}
                              </h4>
                              <ShieldCheck size={14} className="text-cyan-400 shrink-0" />
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {user.user_metadata?.university || user.email}
                            </p>
                            <div className="mt-1 flex items-center gap-1.5">
                              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded-full border border-cyan-400/30">
                                98% Trust Score
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Demo Persona Switcher */}
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between">
                            <span>Switch Demo Student</span>
                            <span className="text-cyan-400 font-mono text-[9px]">Instant</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            {students.map(std => {
                              const isCurrent = std.id === user.id
                              return (
                                <button
                                  key={std.id}
                                  onClick={() => {
                                    switchStudent(std.id)
                                    setProfileMenuOpen(false)
                                  }}
                                  className={`p-2 rounded-xl border text-left text-xs transition-all flex items-center gap-2 cursor-pointer ${
                                    isCurrent
                                      ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-300 font-bold shadow-xs"
                                      : "bg-white/5 border-white/5 hover:border-white/15 hover:bg-white/10 text-muted-foreground hover:text-white"
                                  }`}
                                >
                                  <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 bg-white/10">
                                    <img
                                      src={std.avatar_url}
                                      alt=""
                                      onError={(e) => handleImageError(e, FALLBACK_AVATAR_DATA_URI)}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <span className="truncate text-[11px]">{std.full_name.split(" ")[0]}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Navigation Actions */}
                        <div className="pt-2 border-t border-white/10 space-y-1 text-xs">
                          <Link
                            to="/profile"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition-colors"
                          >
                            <UserIcon size={14} className="text-cyan-400" />
                            <span>View Full Profile</span>
                          </Link>
                          <Link
                            to="/dashboard"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition-colors"
                          >
                            <LayoutDashboard size={14} className="text-purple-400" />
                            <span>Student OS Dashboard</span>
                          </Link>
                          <Link
                            to="/create-listing"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition-colors"
                          >
                            <Plus size={14} className="text-emerald-400" />
                            <span>Create New Listing</span>
                          </Link>
                        </div>

                        {/* Sign Out Action */}
                        <div className="pt-2 border-t border-white/10">
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
                          >
                            <span>Sign Out</span>
                            <LogOut size={13} />
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="text-xs font-semibold px-2.5 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Log in
                </Link>
                <Button asChild variant="glow" size="xs">
                  <Link to="/signup" className="flex items-center gap-1">
                    <Sparkles size={13} />
                    <span>Join</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Drawer Trigger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile 3D Navigation Glass Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="lg:hidden border-b border-white/10 bg-[#070A14]/98 backdrop-blur-3xl px-4 py-5 space-y-4 overflow-hidden shadow-2xl"
          >
            {/* Mobile Search Bar */}
            <div
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenCommandPalette?.()
              }}
              className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-muted-foreground cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search size={15} className="text-cyan-400" />
                <span>Search campus items, tutors, jobs...</span>
              </div>
              <kbd className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded border border-white/15">⌘K</kbd>
            </div>

            {/* Core Destinations Grid */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-2">Campus Ecosystem</div>
              <div className="grid grid-cols-2 gap-2">
                {PRIMARY_LINKS.map(link => {
                  const Icon = link.icon
                  const active = isRouteActive(link.path)
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold transition-all ${
                        active
                          ? "bg-gradient-to-r from-cyan-500/20 to-purple-600/20 text-cyan-300 border border-cyan-400/40 shadow-sm"
                          : "bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white border border-white/5"
                      }`}
                    >
                      <Icon size={16} className={active ? "text-cyan-400" : "text-white/60"} />
                      <span>{link.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Academics & Circles Section */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-purple-400 mb-2">Academics & Study Circles</div>
              <div className="grid grid-cols-2 gap-2">
                {ACADEMIC_COMMUNITY_LINKS.map(item => {
                  const Icon = item.icon
                  const active = isRouteActive(item.path)
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold transition-all ${
                        active
                          ? "bg-purple-500/20 text-purple-300 border border-purple-400/40"
                          : "bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white border border-white/5"
                      }`}
                    >
                      <Icon size={16} className={active ? "text-purple-400" : "text-white/60"} />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Quick Mobile Docks */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/10">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] text-muted-foreground hover:text-white"
              >
                <LayoutDashboard size={16} className="text-cyan-400 mb-1" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/messages"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] text-muted-foreground hover:text-white"
              >
                <MessageSquare size={16} className="text-emerald-400 mb-1" />
                <span>Chat</span>
              </Link>
              <Link
                to="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] text-muted-foreground hover:text-white"
              >
                <Bell size={16} className="text-amber-400 mb-1" />
                <span>Alerts</span>
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] text-muted-foreground hover:text-white"
              >
                <Shield size={16} className="text-rose-400 mb-1" />
                <span>Admin</span>
              </Link>
            </div>

            {/* Mobile Create Listing Button */}
            <Link
              to="/create-listing"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-primary text-white font-bold text-sm shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            >
              <Plus size={16} />
              <span>Create New Listing or Post</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
