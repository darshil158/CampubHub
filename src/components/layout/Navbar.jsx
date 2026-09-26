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

// Campus Life & Living ecosystem links
const CAMPUS_LIFE_LINKS = [
  {
    name: "Gear & Tech Rentals",
    path: "/rentals",
    icon: Layers,
    badge: "Gear",
    gradient: "from-purple-500 to-indigo-600",
    shadow: "rgba(168, 85, 247, 0.35)",
    desc: "Cameras, lab tools, consoles, bikes & graphing calculators"
  },
  {
    name: "Jobs & Gigs",
    path: "/jobs",
    icon: Briefcase,
    badge: "Earn",
    gradient: "from-emerald-500 to-teal-600",
    shadow: "rgba(16, 185, 129, 0.35)",
    desc: "On-campus positions, research assistantships & student gigs"
  },
  {
    name: "Roommates & Housing",
    path: "/roommates",
    icon: HomeIcon,
    badge: "Housing",
    gradient: "from-amber-500 to-orange-600",
    shadow: "rgba(245, 158, 11, 0.35)",
    desc: "Dorm sublets, verified flatmates & peer housing matches"
  }
]

// Academics & Learning ecosystem links
const ACADEMIC_LINKS = [
  {
    name: "Study Circles",
    path: "/study-groups",
    icon: Users,
    badge: "Collab",
    gradient: "from-cyan-500 to-blue-600",
    shadow: "rgba(0, 240, 255, 0.35)",
    desc: "Exam study groups, coding sprints & subject circles"
  },
  {
    name: "Peer Tutoring",
    path: "/tutoring",
    icon: GraduationCap,
    badge: "Learn",
    gradient: "from-blue-600 to-indigo-600",
    shadow: "rgba(59, 130, 246, 0.35)",
    desc: "1-on-1 tutoring sessions with top-ranked campus peers"
  },
  {
    name: "Skill Swaps",
    path: "/skills",
    icon: Zap,
    badge: "Swap",
    gradient: "from-pink-500 to-purple-600",
    shadow: "rgba(236, 72, 153, 0.35)",
    desc: "Barter coding, UI/UX design, music & foreign languages"
  },
  {
    name: "Course Notes",
    path: "/notes",
    icon: FileText,
    badge: "Guides",
    gradient: "from-emerald-500 to-teal-600",
    shadow: "rgba(16, 185, 129, 0.35)",
    desc: "High-yield semester summary decks & solved past exams"
  }
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

  // Dropdown states
  const [campusLifeOpen, setCampusLifeOpen] = useState(false)
  const [academicsOpen, setAcademicsOpen] = useState(false)
  const [postOpen, setPostOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [students, setStudents] = useState([])

  const campusLifeRef = useRef(null)
  const academicsRef = useRef(null)
  const postRef = useRef(null)
  const profileRef = useRef(null)

  // Fetch unread notifications count and demo personas
  useEffect(() => {
    let mounted = true
    const loadCountsAndStudents = async () => {
      try {
        if (user) {
          const count = await api.notifications.getUnreadCount()
          if (mounted) setUnreadCount(count)
        } else {
          if (mounted) setUnreadCount(0)
        }
        const demoStudents = await api.auth.getDemoStudents()
        if (mounted && demoStudents) setStudents(demoStudents.slice(0, 4))
      } catch {
        // graceful fallback
      }
    }
    loadCountsAndStudents()
    return () => { mounted = false }
  }, [user])

  // Close menus on route change
  useEffect(() => {
    setCampusLifeOpen(false)
    setAcademicsOpen(false)
    setPostOpen(false)
    setProfileMenuOpen(false)
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (campusLifeRef.current && !campusLifeRef.current.contains(e.target)) {
        setCampusLifeOpen(false)
      }
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

  const isCampusLifeActive = CAMPUS_LIFE_LINKS.some(link => isRouteActive(link.path))
  const isAcademicsActive = ACADEMIC_LINKS.some(link => isRouteActive(link.path))
  const isMarketplaceActive = isRouteActive("/marketplace")

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#070A14]/90 backdrop-blur-2xl shadow-[0_4px_35px_rgba(0,0,0,0.65)]">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Streamlined Nav Dropdowns */}
        <div className="flex items-center gap-6 xl:gap-8">
          <BrandLogo size="md" showWordmark={true} showBadge={true} badgeText="3D OS" />

          {/* Desktop Navigation Row (Direct Marketplace + 2 Grouped Dropdowns) */}
          <nav
            className="hidden lg:flex items-center space-x-1.5 relative text-sm font-medium"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {/* 1. Direct Link: Marketplace */}
            <Link
              to="/marketplace"
              onMouseEnter={() => setHoveredLink("/marketplace")}
              className={`relative px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 text-xs font-semibold ${
                isMarketplaceActive
                  ? "text-cyan-300 font-bold"
                  : "text-muted-foreground hover:text-white"
              }`}
              style={{ perspective: 600 }}
            >
              <motion.div
                whileHover={{ y: -2, rotateX: 6, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                className="flex items-center gap-1.5 z-10"
              >
                <ShoppingBag
                  size={15}
                  className={
                    isMarketplaceActive
                      ? "text-cyan-400 drop-shadow-[0_0_8px_#00F0FF]"
                      : hoveredLink === "/marketplace"
                      ? "text-cyan-300"
                      : "text-muted-foreground"
                  }
                />
                <span>Marketplace</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md font-mono border text-cyan-300 border-cyan-400/40 bg-cyan-500/20">
                  Trade
                </span>
              </motion.div>

              {/* Gliding Active / Hover Indicator Pill */}
              {isMarketplaceActive && (
                <motion.div
                  layoutId="navbarHoverPill"
                  className="absolute inset-0 bg-white/5 border border-cyan-400/30 rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.15)] pointer-events-none"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>

            {/* 2. Dropdown: Campus Life (Rentals, Jobs, Housing) */}
            <div
              ref={campusLifeRef}
              className="relative"
              onMouseEnter={() => setCampusLifeOpen(true)}
              onMouseLeave={() => setCampusLifeOpen(false)}
            >
              <button
                type="button"
                onClick={() => setCampusLifeOpen(prev => !prev)}
                className={`relative px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                  isCampusLifeActive || campusLifeOpen
                    ? "text-purple-300 font-bold"
                    : "text-muted-foreground hover:text-white"
                }`}
                style={{ perspective: 600 }}
              >
                <motion.div
                  whileHover={{ y: -2, rotateX: 6, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  className="flex items-center gap-1.5 z-10"
                >
                  <Compass
                    size={15}
                    className={
                      isCampusLifeActive || campusLifeOpen
                        ? "text-purple-400 drop-shadow-[0_0_8px_#A855F7]"
                        : "text-muted-foreground"
                    }
                  />
                  <span>Campus Life</span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${campusLifeOpen ? "rotate-180 text-purple-400" : "opacity-60"}`}
                  />
                </motion.div>

                {isCampusLifeActive && (
                  <motion.div
                    layoutId="navbarHoverPill"
                    className="absolute inset-0 bg-white/5 border border-purple-400/30 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.15)] pointer-events-none"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>

              {/* Campus Life 3D Popover */}
              <AnimatePresence>
                {campusLifeOpen && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="w-84 rounded-2xl bg-[#0B0F1E]/95 border border-white/15 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(168,85,247,0.15)] backdrop-blur-2xl space-y-1.5"
                    >
                      <div className="px-2 py-1 flex items-center justify-between border-b border-white/10 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Campus Living & Gigs</span>
                        <span className="text-[10px] font-mono text-purple-400">3 Verified Services</span>
                      </div>

                      {CAMPUS_LIFE_LINKS.map(item => {
                        const Icon = item.icon
                        const active = isRouteActive(item.path)
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setCampusLifeOpen(false)}
                            className={`group flex items-start gap-3 p-2.5 rounded-xl border transition-all duration-200 ${
                              active
                                ? "bg-white/10 border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                                : "bg-white/5 border-transparent hover:border-white/15 hover:bg-white/10"
                            }`}
                          >
                            <div className={`p-2 rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-md shrink-0 group-hover:scale-105 group-hover:rotate-3 transition-transform`}>
                              <Icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                                  {item.name}
                                </span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-white/10 text-white/80">
                                  {item.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                {item.desc}
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

            {/* 3. Dropdown: Academics (Circles, Tutors, Swaps, Notes) */}
            <div
              ref={academicsRef}
              className="relative"
              onMouseEnter={() => setAcademicsOpen(true)}
              onMouseLeave={() => setAcademicsOpen(false)}
            >
              <button
                type="button"
                onClick={() => setAcademicsOpen(prev => !prev)}
                className={`relative px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                  isAcademicsActive || academicsOpen
                    ? "text-cyan-300 font-bold"
                    : "text-muted-foreground hover:text-white"
                }`}
                style={{ perspective: 600 }}
              >
                <motion.div
                  whileHover={{ y: -2, rotateX: 6, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  className="flex items-center gap-1.5 z-10"
                >
                  <GraduationCap
                    size={15}
                    className={
                      isAcademicsActive || academicsOpen
                        ? "text-cyan-400 drop-shadow-[0_0_8px_#00F0FF]"
                        : "text-muted-foreground"
                    }
                  />
                  <span>Academics</span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${academicsOpen ? "rotate-180 text-cyan-400" : "opacity-60"}`}
                  />
                </motion.div>

                {isAcademicsActive && (
                  <motion.div
                    layoutId="navbarHoverPill"
                    className="absolute inset-0 bg-white/5 border border-cyan-400/30 rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.15)] pointer-events-none"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>

              {/* Academics 3D Popover Grid */}
              <AnimatePresence>
                {academicsOpen && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="w-[430px] rounded-2xl bg-[#0B0F1E]/95 border border-white/15 p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(0,240,255,0.15)] backdrop-blur-2xl"
                    >
                      <div className="px-2 py-1 flex items-center justify-between border-b border-white/10 mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <Sparkles size={12} className="text-cyan-400" />
                          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Peer Academic Hub</span>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400">4 Active Programs</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {ACADEMIC_LINKS.map(item => {
                          const Icon = item.icon
                          const active = isRouteActive(item.path)
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setAcademicsOpen(false)}
                              className={`group p-2.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                                active
                                  ? "bg-white/10 border-cyan-400/50 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                                  : "bg-white/5 border-transparent hover:border-white/15 hover:bg-white/10"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className={`p-2 rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-md group-hover:scale-105 group-hover:rotate-3 transition-transform`}>
                                  <Icon size={15} />
                                </div>
                                <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-white/10 text-white/80">
                                  {item.badge}
                                </span>
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                                  {item.name}
                                </h4>
                                <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug">
                                  {item.desc}
                                </p>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>

        {/* Right: Quick Action Controls, + Post Button, and Auth/Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Quick Command Search Trigger Capsule */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 text-muted-foreground hover:text-white transition-all text-xs cursor-pointer group shadow-xs"
            title="Search campus items, tutors, roommates (⌘K)"
          >
            <Search size={14} className="text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline text-[11px] font-medium text-muted-foreground">Search</span>
            <kbd className="hidden sm:inline-block font-mono text-[9px] bg-white/10 px-1.5 py-0.2 rounded border border-white/15 text-white/70">⌘K</kbd>
          </button>

          {/* + Post Multi-Category Dropdown */}
          <div
            ref={postRef}
            className="relative"
            onMouseEnter={() => setPostOpen(true)}
            onMouseLeave={() => setPostOpen(false)}
          >
            <button
              onClick={() => setPostOpen(prev => !prev)}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-primary to-purple-600 text-white text-xs font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:scale-103 active:scale-98 transition-all cursor-pointer border border-white/20"
            >
              <Plus size={14} className={`transition-transform duration-200 ${postOpen ? "rotate-45" : ""}`} />
              <span className="hidden sm:inline">Post</span>
              <ChevronDown size={11} className={`opacity-80 transition-transform duration-200 ${postOpen ? "rotate-180" : ""}`} />
            </button>

            {/* 3D Post Dropdown Menu */}
            <AnimatePresence>
              {postOpen && (
                <div className="absolute top-full right-0 pt-2 z-50">
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="w-72 rounded-2xl bg-[#0B0F1E]/95 border border-white/15 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.2)] backdrop-blur-2xl space-y-1"
                  >
                    <div className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground border-b border-white/10 mb-1 flex items-center justify-between">
                      <span>Create New Campus Entry</span>
                      <Sparkles size={11} className="text-cyan-400" />
                    </div>

                    {POST_OPTIONS.map(opt => {
                      const Icon = opt.icon
                      return (
                        <Link
                          key={opt.path}
                          to={opt.path}
                          onClick={() => setPostOpen(false)}
                          className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all group"
                        >
                          <div className={`p-1.5 rounded-lg bg-gradient-to-br ${opt.color} text-white shadow-xs group-hover:scale-110 transition-transform`}>
                            <Icon size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {opt.title}
                            </div>
                            <div className="text-[10px] text-muted-foreground truncate">
                              {opt.subtitle}
                            </div>
                          </div>
                          <ArrowRight size={12} className="text-muted-foreground group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                        </Link>
                      )
                    })}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Conditional Auth Section: Logged In vs. Logged Out */}
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* Chat / Messages Link with Live Ping */}
              <Link
                to="/messages"
                className={`relative p-2 rounded-xl border transition-all ${
                  isRouteActive("/messages")
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                    : "border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white"
                }`}
                title="Direct Campus Messages"
              >
                <MessageSquare size={15} className="text-emerald-400" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
              </Link>

              {/* Notifications Alert Bell with Unread Badge */}
              <Link
                to="/notifications"
                className={`relative p-2 rounded-xl border transition-all ${
                  isRouteActive("/notifications")
                    ? "bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                    : "border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white"
                }`}
                title="Notification Feed"
              >
                <Bell size={15} className="text-amber-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-black text-[9px] font-black flex items-center justify-center shadow-[0_0_8px_#f59e0b]">
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* Student Persona Profile Button & Popover */}
              <div
                ref={profileRef}
                className="relative"
                onMouseEnter={() => setProfileMenuOpen(true)}
                onMouseLeave={() => setProfileMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen(prev => !prev)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group shadow-xs"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-cyan-400/40 relative bg-cyan-950">
                    <img
                      src={user.user_metadata?.avatar_url || FALLBACK_AVATAR_DATA_URI}
                      alt={user.user_metadata?.full_name || "Profile"}
                      onError={(e) => handleImageError(e, FALLBACK_AVATAR_DATA_URI)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold max-w-[85px] truncate text-white">
                    {user.user_metadata?.full_name?.split(" ")[0] || "Student"}
                  </span>
                  <ChevronDown size={12} className={`text-muted-foreground transition-transform duration-200 ${profileMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* 3D Student Dashboard & Persona Switcher Popover */}
                <AnimatePresence>
                  {profileMenuOpen && (
                    <div className="absolute top-full right-0 pt-2 z-50">
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="w-80 rounded-2xl bg-[#0B0F1E]/95 border border-white/15 p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(0,240,255,0.15)] backdrop-blur-2xl space-y-3"
                      >
                        {/* Current Student Profile Header */}
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent border border-white/10">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-400/50 shadow-sm shrink-0">
                            <img
                              src={user.user_metadata?.avatar_url || FALLBACK_AVATAR_DATA_URI}
                              alt=""
                              onError={(e) => handleImageError(e, FALLBACK_AVATAR_DATA_URI)}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white truncate">
                                {user.user_metadata?.full_name || "Campus Student"}
                              </span>
                              <ShieldCheck size={13} className="text-cyan-400 shrink-0" />
                            </div>
                            <div className="text-[10px] text-muted-foreground truncate">
                              {user.user_metadata?.university || "Campus University"}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                                99% Trust
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-400/20">
                                Verified
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Switch Demo Student Persona (1-Click) */}
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground px-1 mb-1.5 flex items-center justify-between">
                            <span>Switch Student Persona</span>
                            <span className="text-cyan-400 font-mono text-[9px]">1-Click Demo</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            {students.map(std => {
                              const isCurrent = std.id === user.id
                              return (
                                <button
                                  key={std.id}
                                  onClick={async () => {
                                    await switchStudent(std.id)
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
                            to="/dashboard"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition-colors"
                          >
                            <LayoutDashboard size={14} className="text-purple-400" />
                            <span>Student Command Dashboard</span>
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition-colors"
                          >
                            <UserIcon size={14} className="text-cyan-400" />
                            <span>View Full Profile</span>
                          </Link>
                          <Link
                            to="/admin"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition-colors"
                          >
                            <Shield size={14} className="text-rose-400" />
                            <span>Admin Matrix & Audit</span>
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
            </div>
          ) : (
            /* Logged Out View for Fresh Visitors */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold px-3 py-1.5 text-muted-foreground hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                Log in
              </Link>
              <Button asChild variant="glow" size="xs">
                <Link to="/signup" className="flex items-center gap-1 font-bold">
                  <Sparkles size={13} />
                  <span>Join Free</span>
                </Link>
              </Button>
            </div>
          )}

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

            {/* Core Destinations */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-cyan-400 mb-2">Campus Marketplace & Trade</div>
              <Link
                to="/marketplace"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold transition-all ${
                  isMarketplaceActive
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
                    : "bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white border border-white/5"
                }`}
              >
                <ShoppingBag size={16} className="text-cyan-400" />
                <span>Student Marketplace</span>
              </Link>
            </div>

            {/* Campus Life Section */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-purple-400 mb-2">Campus Life & Living</div>
              <div className="grid grid-cols-2 gap-2">
                {CAMPUS_LIFE_LINKS.map(link => {
                  const Icon = link.icon
                  const active = isRouteActive(link.path)
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                        active
                          ? "bg-purple-500/20 text-purple-300 border border-purple-400/40"
                          : "bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white border border-white/5"
                      }`}
                    >
                      <Icon size={15} className={active ? "text-purple-400" : "text-white/60"} />
                      <span className="truncate">{link.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Academics Section */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-400 mb-2">Academics & Study Circles</div>
              <div className="grid grid-cols-2 gap-2">
                {ACADEMIC_LINKS.map(item => {
                  const Icon = item.icon
                  const active = isRouteActive(item.path)
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                        active
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                          : "bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white border border-white/5"
                      }`}
                    >
                      <Icon size={15} className={active ? "text-emerald-400" : "text-white/60"} />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Quick Access Docks & Profile */}
            {user ? (
              <div className="pt-2 border-t border-white/10 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 text-[10px] text-muted-foreground hover:text-white"
                  >
                    <LayoutDashboard size={15} className="text-purple-400 mb-1" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/messages"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 text-[10px] text-muted-foreground hover:text-white"
                  >
                    <MessageSquare size={15} className="text-emerald-400 mb-1" />
                    <span>Messages</span>
                  </Link>
                  <Link
                    to="/notifications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 text-[10px] text-muted-foreground hover:text-white"
                  >
                    <Bell size={15} className="text-amber-400 mb-1" />
                    <span>Alerts</span>
                  </Link>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-semibold text-white"
                  >
                    <UserIcon size={15} className="text-cyan-400" />
                    <span>{user.user_metadata?.full_name || "Profile"}</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-xs text-rose-400 font-semibold px-2 py-1 rounded hover:bg-rose-500/10 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
                <Button asChild variant="outline" size="sm" onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild variant="glow" size="sm" onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/signup">Join Free</Link>
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
