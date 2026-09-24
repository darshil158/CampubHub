import { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, LogIn, LogOut, User as UserIcon,
  Menu, X, Briefcase, Home as HomeIcon, ShoppingBag,
  GraduationCap, Zap, FileText, ArrowRight, Sparkles, CheckCircle2,
  ShieldCheck, Users, Building, ChevronRight, Star, Heart,
  Flame, Bell, ArrowUpRight, Command, Compass, Cpu,
  Layers, LayoutDashboard, MessageSquare, Shield
} from 'lucide-react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Marketplace from './pages/Marketplace'
import CreateListing from './pages/CreateListing'
import Rentals from './pages/Rentals'
import Jobs from './pages/Jobs'
import Roommates from './pages/Roommates'
import StudyGroups from './pages/StudyGroups'
import Tutoring from './pages/Tutoring'
import Skills from './pages/Skills'
import Notes from './pages/Notes'
import Dashboard from './pages/Dashboard'
import Messages from './pages/Messages'
import Notifications from './pages/Notifications'
import Admin from './pages/Admin'
import Profile from './pages/Profile'
import { useAuthStore } from './store/useAuthStore'
import { BrandLogo, BrandSymbol } from './components/ui/BrandLogo'
import { Button } from './components/ui/Button'
import { Badge, VerifiedBadge } from './components/ui/Badge'
import { Card, CardContent } from './components/ui/Card'
import { Card3D } from './components/ui/Card3D'
import { Canvas3D } from './components/ui/Canvas3D'
import { CommandPalette } from './components/ui/CommandPalette'
import { HeroVisual3D } from './components/ui/HeroVisual3D'

const NAV_LINKS = [
  { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag, tag: 'Trade' },
  { name: 'Rentals', path: '/rentals', icon: Layers, tag: 'Gear' },
  { name: 'Jobs', path: '/jobs', icon: Briefcase, tag: 'Earn' },
  { name: 'Roommates', path: '/roommates', icon: HomeIcon, tag: 'Live' },
  { name: 'Circles', path: '/study-groups', icon: Users, tag: 'Study' },
  { name: 'Tutoring', path: '/tutoring', icon: GraduationCap, tag: 'Learn' },
  { name: 'Skills', path: '/skills', icon: Zap, tag: 'Swap' },
  { name: 'Notes', path: '/notes', icon: FileText, tag: 'Guides' },
]

export default function App() {
  const { initialize, user, signOut } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  useEffect(() => {
    initialize()
  }, [initialize])

  // Close mobile menu upon navigation
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path))

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-cyan-500/20 selection:text-cyan-300 relative overflow-x-hidden">
      {/* 3D Command Palette Modal */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />

      {/* Top Futuristic Announcement Bar */}
      <div className="relative z-40 bg-gradient-to-r from-cyan-500/15 via-purple-600/15 to-pink-500/15 border-b border-white/10 text-xs py-2 px-4 text-center backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-center gap-2 font-medium">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00F0FF]" />
          <span className="text-cyan-300 font-bold tracking-wide uppercase text-[11px]">Quadly 2.0 3D</span>
          <span className="text-white/40 hidden sm:inline">•</span>
          <span className="text-muted-foreground hidden sm:inline">The futuristic dark 3D ecosystem for college life: verified student trades, high-yield gigs & peer housing.</span>
          <span className="text-muted-foreground sm:hidden">Futuristic 3D campus ecosystem live.</span>
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold ml-1 cursor-pointer"
          >
            Quick Search <span className="font-mono text-[10px] bg-white/10 px-1 py-0.2 rounded border border-white/15">⌘K</span>
          </button>
        </div>
      </div>

      {/* 3D Glass Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#070A14]/85 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6 xl:gap-8">
            <BrandLogo size="md" showWordmark={true} showBadge={true} badgeText="3D OS" />

            {/* Desktop Navigation Links with Sliding Pill Indicator */}
            <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium">
              {NAV_LINKS.map(link => {
                const active = isActive(link.path)
                const Icon = link.icon
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${active
                        ? 'text-cyan-300 font-semibold bg-white/5 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                      }`}
                  >
                    <Icon size={16} className={active ? 'text-cyan-400' : 'text-muted-foreground'} />
                    <span>{link.name}</span>
                    {active && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-cyan-400 via-primary to-pink-500 rounded-full shadow-[0_0_8px_#00F0FF]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Quick Command Palette Button */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-xs"
              title="Quick Search (Cmd+K)"
            >
              <Search size={14} className="text-cyan-400" />
              <span className="hidden xl:inline">Search...</span>
              <kbd className="hidden xl:inline-block font-mono text-[10px] bg-black/40 px-1.5 py-0.5 rounded border border-white/10 text-muted-foreground">⌘K</kbd>
            </button>

            {/* Quick Access Dock */}
            <Link
              to="/dashboard"
              className={`p-2 rounded-xl border transition-all text-xs font-semibold flex items-center gap-1.5 ${isActive('/dashboard')
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : 'border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white'
                }`}
              title="Student OS Dashboard"
            >
              <LayoutDashboard size={15} className="text-cyan-400" />
              <span className="hidden 2xl:inline text-xs">Dashboard</span>
            </Link>

            <Link
              to="/messages"
              className={`relative p-2 rounded-xl border transition-all ${isActive('/messages')
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white'
                }`}
              title="Campus Messenger"
            >
              <MessageSquare size={15} className="text-emerald-400" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
            </Link>

            <Link
              to="/notifications"
              className={`relative p-2 rounded-xl border transition-all ${isActive('/notifications')
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white'
                }`}
              title="Notification Feed"
            >
              <Bell size={15} className="text-amber-400" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
            </Link>

            <Link
              to="/admin"
              className={`p-2 rounded-xl border transition-all ${isActive('/admin')
                  ? 'bg-rose-500/20 text-rose-300 border-rose-400/40 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                  : 'border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white'
                }`}
              title="Admin Matrix & Moderation"
            >
              <Shield size={15} className="text-rose-400" />
            </Link>

            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-sm font-medium transition-all shadow-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden md:inline text-xs font-semibold max-w-[100px] truncate text-foreground">
                    {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Profile'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-500/15 text-red-400 rounded-xl transition-colors cursor-pointer"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="text-xs font-medium px-2.5 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Log in
                </Link>
                <Button asChild variant="glow" size="xs">
                  <Link to="/signup" className="flex items-center gap-1">
                    <LogIn size={13} />
                    <span>Join Free</span>
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden border-b border-white/10 bg-[#0B0F1C]/95 backdrop-blur-2xl px-4 py-4 space-y-3 overflow-hidden shadow-2xl"
            >
              <div className="grid grid-cols-2 gap-2">
                {NAV_LINKS.map(link => {
                  const Icon = link.icon
                  const active = isActive(link.path)
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${active
                          ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-md shadow-primary/30 border border-white/20'
                          : 'bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      <Icon size={16} />
                      <div className="flex flex-col">
                        <span>{link.name}</span>
                        <span className="text-[10px] opacity-75">{link.tag}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Quick Mobile Shortcuts */}
              <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-white/10">
                <Link
                  to="/dashboard"
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] text-muted-foreground hover:text-white"
                >
                  <LayoutDashboard size={16} className="text-cyan-400 mb-1" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/messages"
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] text-muted-foreground hover:text-white"
                >
                  <MessageSquare size={16} className="text-emerald-400 mb-1" />
                  <span>Chat</span>
                </Link>
                <Link
                  to="/notifications"
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] text-muted-foreground hover:text-white"
                >
                  <Bell size={16} className="text-amber-400 mb-1" />
                  <span>Alerts</span>
                </Link>
                <Link
                  to="/admin"
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] text-muted-foreground hover:text-white"
                >
                  <Shield size={16} className="text-rose-400 mb-1" />
                  <span>Admin</span>
                </Link>
              </div>

              {user ? (
                <div className="pt-2 border-t border-white/10">
                  <Link
                    to="/profile"
                    className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5"
                  >
                    <span className="flex items-center gap-2">
                      <UserIcon size={16} className="text-cyan-400" /> My Profile & Activity
                    </span>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </Link>
                </div>
              ) : (
                <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/login">Log in</Link>
                  </Button>
                  <Button asChild variant="glow" size="sm">
                    <Link to="/signup">Join Free</Link>
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<HomeView user={user} onOpenCommand={() => setCommandPaletteOpen(true)} />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/create" element={<CreateListing />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/roommates" element={<Roommates />} />
          <Route path="/study-groups" element={<StudyGroups />} />
          <Route path="/tutoring" element={<Tutoring />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={user ? <Profile /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>

      {/* Futuristic 3D Dark Footer */}
      <footer className="border-t border-white/10 bg-[#070A14] backdrop-blur-2xl py-14 text-sm text-muted-foreground mt-auto relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-10 border-b border-white/5">
            {/* Column 1: Brand Info */}
            <div className="md:col-span-1 space-y-3">
              <BrandLogo size="md" showWordmark={true} showBadge={false} />
              <p className="text-xs text-muted-foreground leading-relaxed">
                The futuristic 3D student platform unifying campus commerce, flexible employment, peer housing, and collaborative coursework.
              </p>
              <div className="flex items-center gap-2 pt-2 text-xs">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00F0FF]" />
                <span className="text-cyan-400 font-semibold tracking-wide">3D Campus Grid Online</span>
              </div>
            </div>

            {/* Column 2: Ecosystem */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Campus Commerce & Housing</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/marketplace" className="hover:text-cyan-400 transition-colors">Marketplace 3D</Link></li>
                <li><Link to="/rentals" className="hover:text-cyan-400 transition-colors">Equipment & Gear Rentals</Link></li>
                <li><Link to="/jobs" className="hover:text-cyan-400 transition-colors">Student Job Board</Link></li>
                <li><Link to="/roommates" className="hover:text-cyan-400 transition-colors">Housing & Roommates</Link></li>
              </ul>
            </div>

            {/* Column 3: Academics & Tools */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Academics & Tools</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/study-groups" className="hover:text-cyan-400 transition-colors">Study Circles 3D</Link></li>
                <li><Link to="/tutoring" className="hover:text-cyan-400 transition-colors">Peer Mentorship</Link></li>
                <li><Link to="/notes" className="hover:text-cyan-400 transition-colors">Lecture Notes & Cheatsheets</Link></li>
                <li><Link to="/skills" className="hover:text-cyan-400 transition-colors">Talent Swap Network</Link></li>
                <li><Link to="/dashboard" className="hover:text-cyan-400 transition-colors">Student OS Dashboard</Link></li>
              </ul>
            </div>

            {/* Column 4: Trust & Verification */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Institutional Security</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Protected by verified institutional authentication. Zero scam tolerance, zero platform markups.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <Badge variant="verified" size="xs">.edu Verified</Badge>
                <Badge variant="outline" size="xs">Zero Fees</Badge>
                <Badge variant="remote" size="xs">Peer-to-Peer</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>
              © {new Date().getFullYear()} Quadly Campus Hub. 4K Visual Architecture & 3D Experience.
            </div>
            <div className="flex items-center gap-6">
              <span className="text-muted-foreground hover:text-cyan-400 transition-colors cursor-pointer">Privacy Matrix</span>
              <span className="text-muted-foreground hover:text-cyan-400 transition-colors cursor-pointer">Campus Guidelines</span>
              <span className="text-muted-foreground hover:text-cyan-400 transition-colors cursor-pointer">Security Protocol</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function HomeView({ user, onOpenCommand }) {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All')

  const stats = [
    { value: '1,480+', label: 'Active Students', icon: Users, change: '+18% this semester', glow: 'text-cyan-400' },
    { value: '520+', label: 'Campus Items', icon: ShoppingBag, change: '100% Peer trades', glow: 'text-purple-400' },
    { value: '95+', label: 'Flexible Jobs', icon: Briefcase, change: '$18-$35/hr avg', glow: 'text-emerald-400' },
    { value: '100%', label: 'Verified Community', icon: ShieldCheck, change: '.edu email check', glow: 'text-pink-400' },
  ]

  const modules = [
    {
      id: 'marketplace',
      title: 'Marketplace',
      badge: 'Trade',
      desc: 'Buy & sell textbooks, electronics, dorm furniture safely on campus with verified peers.',
      icon: ShoppingBag,
      link: '/marketplace',
      neon: 'cyan',
      tagline: 'Zero seller fees',
    },
    {
      id: 'rentals',
      title: 'Gear Rentals',
      badge: 'Rent',
      desc: 'Borrow cinema cameras, pocket projectors, gaming consoles, and scientific calculators by day or week.',
      icon: Layers,
      link: '/rentals',
      neon: 'amber',
      tagline: 'Affordable peer gear',
    },
    {
      id: 'groups',
      title: 'Study Circles',
      badge: 'Collaborate',
      desc: 'Join active weekly study sessions for algorithms, calculus, organic chemistry, and economics.',
      icon: Users,
      link: '/study-groups',
      neon: 'blue',
      tagline: 'Live group preparation',
    },
    {
      id: 'jobs',
      title: 'Campus Jobs',
      badge: 'Earn',
      desc: 'Find flexible student roles, research assistantships, dining gigs, and freelance campus projects.',
      icon: Briefcase,
      link: '/jobs',
      neon: 'purple',
      tagline: 'Direct student hiring',
    },
    {
      id: 'roommates',
      title: 'Housing & Roommates',
      badge: 'Live',
      desc: 'Connect with verified student roommates, browse available rooms, subleases, and off-campus housing.',
      icon: HomeIcon,
      link: '/roommates',
      neon: 'emerald',
      tagline: 'Roommate compatibility',
    },
    {
      id: 'tutoring',
      title: 'Peer Tutoring',
      badge: 'Learn',
      desc: 'Connect with top-performing classmates in STEM, economics, computer science, and humanities.',
      icon: GraduationCap,
      link: '/tutoring',
      neon: 'blue',
      tagline: 'Course-specific help',
    },
    {
      id: 'skills',
      title: 'Skill Exchange',
      badge: 'Collaborate',
      desc: 'Trade talents: pair programming, language practice, graphic design, photography, and music production.',
      icon: Zap,
      link: '/skills',
      neon: 'pink',
      tagline: 'Free talent barter',
    },
    {
      id: 'notes',
      title: 'Study Notes & Guides',
      badge: 'Succeed',
      desc: 'Access crowdsourced lecture summaries, practice midterm exams, cheat sheets, and formula decks.',
      icon: FileText,
      link: '/notes',
      neon: 'cyan',
      tagline: 'Verified course summaries',
    },
  ]

  const filteredModules = activeCategoryFilter === 'All'
    ? modules
    : modules.filter(m => m.title.toLowerCase().includes(activeCategoryFilter.toLowerCase()) || m.badge.toLowerCase().includes(activeCategoryFilter.toLowerCase()))

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Hero Section with Interactive 3D Canvas Background */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36 border-b border-white/10">
        {/* WebGL / 3D Canvas Particle Constellation */}
        <Canvas3D className="opacity-70" count={65} interactive={true} />

        {/* Ambient Volumetric Backlights */}
        <div className="ambient-aurora w-[600px] h-[350px] bg-cyan-500/20 -top-20 -left-20" />
        <div className="ambient-aurora w-[700px] h-[400px] bg-purple-600/25 top-1/4 right-0" />
        <div className="ambient-aurora w-[500px] h-[300px] bg-pink-500/15 bottom-0 left-1/3" />

        {/* Perspective Cyber-Grid Overlay */}
        <div className="absolute inset-0 perspective-grid pointer-events-none opacity-40" />

        {/* Floating 3D Micro-Badges */}
        <div className="hidden lg:block absolute inset-0 max-w-6xl mx-auto pointer-events-none">
          {/* Micro-badge 1: Top Left */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-16 left-6 pointer-events-auto bg-[#0E1528]/85 backdrop-blur-xl border border-cyan-400/30 shadow-[0_10px_35px_rgba(0,240,255,0.2)] rounded-2xl p-3.5 flex items-center gap-3 max-w-[250px]"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-400/30 shadow-xs">
              <ShoppingBag size={18} />
            </div>
            <div className="text-left leading-tight">
              <p className="text-xs font-bold text-foreground truncate">MacBook Air M2</p>
              <p className="text-[11px] text-cyan-300 font-semibold">$620 • Just listed</p>
            </div>
          </motion.div>

          {/* Micro-badge 2: Top Right */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-20 right-6 pointer-events-auto bg-[#0E1528]/85 backdrop-blur-xl border border-purple-400/30 shadow-[0_10px_35px_rgba(139,92,246,0.2)] rounded-2xl p-3.5 flex items-center gap-3 max-w-[260px]"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 border border-purple-400/30 shadow-xs">
              <Briefcase size={18} />
            </div>
            <div className="text-left leading-tight">
              <p className="text-xs font-bold text-foreground truncate">CS Teaching Fellow</p>
              <p className="text-[11px] text-purple-300 font-semibold">$24/hr • On-Campus</p>
            </div>
          </motion.div>

          {/* Micro-badge 3: Bottom Left */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: [0, -7, 0] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-12 left-10 pointer-events-auto bg-[#0E1528]/85 backdrop-blur-xl border border-emerald-400/30 shadow-[0_10px_35px_rgba(16,185,129,0.2)] rounded-2xl p-3.5 flex items-center gap-3 max-w-[250px]"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30 shadow-xs">
              <HomeIcon size={18} />
            </div>
            <div className="text-left leading-tight">
              <p className="text-xs font-bold text-foreground truncate">North Quad Suite</p>
              <p className="text-[11px] text-emerald-400 font-semibold">Matched in 48h!</p>
            </div>
          </motion.div>

          {/* Micro-badge 4: Bottom Right */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: [0, 7, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-16 right-10 pointer-events-auto bg-[#0E1528]/85 backdrop-blur-xl border border-pink-400/30 shadow-[0_10px_35px_rgba(236,72,153,0.2)] rounded-2xl p-3.5 flex items-center gap-3 max-w-[250px]"
          >
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center shrink-0 border border-pink-400/30 shadow-xs">
              <GraduationCap size={18} />
            </div>
            <div className="text-left leading-tight">
              <p className="text-xs font-bold text-foreground truncate">Organic Chem Review</p>
              <p className="text-[11px] text-pink-300 font-semibold">5.0 ★ (42 sessions)</p>
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          {/* Top Holographic Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onOpenCommand}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/15 via-purple-500/15 to-pink-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-bold mb-6 shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:border-cyan-400/60 transition-all cursor-pointer select-none"
          >
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            <span>Futuristic Campus Ecosystem</span>
            <span className="h-1 w-1 rounded-full bg-cyan-400" />
            <span className="font-semibold text-white/90">Press ⌘K for Command Palette</span>
          </motion.div>

          {/* Main 4K 3D Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] text-white"
          >
            College Life,{' '}
            <span className="text-gradient-aurora drop-shadow-[0_0_35px_rgba(0,240,255,0.3)]">
              In Full 3D Dimension.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Trade textbooks and gear, discover student-friendly employment, connect with verified roommates, and share study notes in an ultra-fast, holographic college universe.
          </motion.p>

          {/* Action Button Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            <Button asChild variant="glow" size="lg">
              <Link to="/marketplace" className="gap-2">
                <span>Enter 3D Marketplace</span>
                <ArrowRight size={18} />
              </Link>
            </Button>

            <Button asChild variant="secondary" size="lg" className="border-white/10 hover:border-cyan-400/40">
              <Link to="/jobs" className="gap-2">
                <Briefcase size={18} className="text-cyan-400" />
                <span>Student Jobs</span>
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="border-white/10 hover:border-purple-400/40">
              <Link to="/roommates" className="gap-2">
                <HomeIcon size={18} className="text-emerald-400" />
                <span>Find Roommates</span>
              </Link>
            </Button>
          </motion.div>

          {/* Interactive 3D Holographic Core */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="my-10"
          >
            <HeroVisual3D className="mx-auto" />
          </motion.div>

          {/* Live 3D Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`text-2xl sm:text-3xl font-black ${stat.glow} flex items-center gap-1.5`}>
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-foreground/90 mt-1">{stat.label}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{stat.change}</div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Interactive Category Filter Pills */}
      <section className="py-6 bg-[#070A14] border-b border-white/5 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl flex items-center justify-center gap-2 overflow-x-auto scrollbar-hide py-1">
          {['All', 'Marketplace', 'Jobs', 'Roommates', 'Tutoring', 'Skills', 'Notes'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeCategoryFilter === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-primary text-white shadow-[0_0_20px_rgba(0,240,255,0.4)] scale-105 border border-cyan-400/40'
                  : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 3D Tilt Feature Grid Section */}
      <section className="py-20 md:py-28 container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-14">
          <Badge variant="verified" size="sm" className="mb-3 border-cyan-400/30 text-cyan-300">
            Interactive 3D Modules
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">The Six Pillars of Campus Life</h2>
          <p className="text-muted-foreground mt-2.5 text-sm sm:text-base max-w-xl mx-auto">
            Hover over cards to experience realistic 3D perspective tilt and holographic specular depth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((m, idx) => {
            const Icon = m.icon
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="h-full"
              >
                <Link to={m.link} className="block h-full">
                  <Card3D
                    neonGlow={m.neon}
                    maxTilt={12}
                    className="h-full"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-cyan-300 shadow-xs">
                        <Icon size={24} />
                      </div>
                      <Badge variant="outline" size="sm" className="font-semibold border-white/15">
                        {m.badge}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-xl mb-2 text-foreground flex items-center justify-between">
                      <span>{m.title}</span>
                      <ArrowUpRight size={18} className="text-cyan-400" />
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {m.desc}
                    </p>

                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="font-medium text-white/70">{m.tagline}</span>
                      <span className="text-cyan-400 font-semibold">Launch 3D →</span>
                    </div>
                  </Card3D>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Trust & Campus Verification Bento Banner with 3D Depth */}
      <section className="py-16 bg-gradient-to-b from-[#070A14] to-[#0A0F1D] border-t border-white/10 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card3D neonGlow="emerald" maxTilt={8}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 border border-emerald-400/30">
                <ShieldCheck size={22} />
              </div>
              <h4 className="font-bold text-base text-foreground">Verified Student Matrix</h4>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Connect and transact solely with peers authenticated via authorized .edu university credentials. Say goodbye to anonymous scammers.
              </p>
            </Card3D>

            <Card3D neonGlow="cyan" maxTilt={8}>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 border border-cyan-400/30">
                <Zap size={22} />
              </div>
              <h4 className="font-bold text-base text-foreground">0% Platform Surcharges</h4>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Keep 100% of your textbook sale prices and student gig income. We never clip your student budget with transaction fees.
              </p>
            </Card3D>

            <Card3D neonGlow="pink" maxTilt={8}>
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-3 border border-pink-400/30">
                <Cpu size={22} />
              </div>
              <h4 className="font-bold text-base text-foreground">Single Campus Graph</h4>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                One unified sign-in coordinates everything: engineering roommates, textbook trade, or peer review sessions for midterms.
              </p>
            </Card3D>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      {!user && (
        <section className="py-20 relative overflow-hidden bg-gradient-to-r from-cyan-900/20 via-purple-900/20 to-pink-900/20 border-t border-white/10 z-10">
          <div className="container mx-auto px-4 text-center max-w-2xl relative z-10">
            <BrandSymbol size="lg" className="mx-auto mb-4" />
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Ready to enter your campus dimension?</h3>
            <p className="text-muted-foreground text-sm sm:text-base mt-3 mb-8 leading-relaxed">
              Create your account with your university email to access the 3D marketplace, student employment, housing, and coursework materials immediately.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild variant="glow" size="lg">
                <Link to="/signup" className="gap-2">
                  <span>Enter Quadly Free</span>
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/15 hover:border-cyan-400/40">
                <Link to="/login">Sign in with Existing Account</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
