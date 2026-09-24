import { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, LogIn, LogOut, User as UserIcon,
  Menu, X, Briefcase, Home as HomeIcon, ShoppingBag,
  GraduationCap, Zap, FileText, ArrowRight, Sparkles, CheckCircle2,
  ShieldCheck, Users, Building, ChevronRight, Star, Heart,
  Flame, Bell, ArrowUpRight
} from 'lucide-react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Marketplace from './pages/Marketplace'
import CreateListing from './pages/CreateListing'
import Tutoring from './pages/Tutoring'
import Skills from './pages/Skills'
import Notes from './pages/Notes'
import Jobs from './pages/Jobs'
import Roommates from './pages/Roommates'
import Profile from './pages/Profile'
import { useAuthStore } from './store/useAuthStore'
import { BrandLogo, BrandSymbol } from './components/ui/BrandLogo'
import { Button } from './components/ui/Button'
import { Badge, VerifiedBadge } from './components/ui/Badge'
import { Card, CardContent } from './components/ui/Card'

const NAV_LINKS = [
  { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag, tag: 'Trade' },
  { name: 'Jobs', path: '/jobs', icon: Briefcase, tag: 'Earn' },
  { name: 'Roommates', path: '/roommates', icon: HomeIcon, tag: 'Live' },
  { name: 'Tutoring', path: '/tutoring', icon: GraduationCap, tag: 'Learn' },
  { name: 'Skills', path: '/skills', icon: Zap, tag: 'Swap' },
  { name: 'Notes', path: '/notes', icon: FileText, tag: 'Study' },
]

export default function App() {
  const { initialize, user, signOut } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    initialize()
  }, [initialize])

  // Close mobile menu upon navigation
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path))

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* Top Startup Announcement Bar */}
      <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-b border-border/40 text-xs py-1.5 px-4 text-center">
        <div className="container mx-auto flex items-center justify-center gap-2 font-medium">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-foreground/90 font-semibold">Quadly 2.0:</span>
          <span className="text-muted-foreground hidden sm:inline">The verified student ecosystem for campus jobs, roommates, textbook trading & study tools.</span>
          <span className="text-muted-foreground sm:hidden">Campus ecosystem live for Spring 2026.</span>
          <Link to="/marketplace" className="inline-flex items-center gap-0.5 text-primary hover:underline font-semibold ml-1">
            Explore now <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75 shadow-2xs">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <BrandLogo size="md" showWordmark={true} showBadge={true} badgeText="CAMPUS" />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium">
              {NAV_LINKS.map(link => {
                const active = isActive(link.path)
                const Icon = link.icon
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                      active
                        ? 'text-primary font-semibold bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    <Icon size={16} className={active ? 'text-primary' : 'text-muted-foreground'} />
                    <span>{link.name}</span>
                    {active && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-border/80 bg-background/60 hover:bg-muted/70 text-sm font-medium transition-all shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold ring-1 ring-primary/30">
                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold max-w-[120px] truncate text-foreground">
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Profile'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-colors cursor-pointer"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="text-sm font-medium px-3.5 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Log in
                </Link>
                <Button asChild variant="glow" size="sm">
                  <Link to="/signup" className="flex items-center gap-1.5">
                    <LogIn size={15} />
                    <span>Get Started</span>
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
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
              className="lg:hidden border-b border-border/80 bg-background/95 backdrop-blur-xl px-4 py-4 space-y-3 overflow-hidden shadow-xl"
            >
              <div className="grid grid-cols-2 gap-2">
                {NAV_LINKS.map(link => {
                  const Icon = link.icon
                  const active = isActive(link.path)
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                          : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon size={18} />
                      <div className="flex flex-col">
                        <span>{link.name}</span>
                        <span className="text-[10px] opacity-75">{link.tag}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {user ? (
                <div className="pt-2 border-t border-border/50">
                  <Link
                    to="/profile"
                    className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-muted/60"
                  >
                    <span className="flex items-center gap-2">
                      <UserIcon size={16} className="text-primary" /> My Profile & Activity
                    </span>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </Link>
                </div>
              ) : (
                <div className="pt-3 border-t border-border/50 grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/login">Log in</Link>
                  </Button>
                  <Button asChild variant="default" size="sm">
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
          <Route path="/" element={<HomeView user={user} />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/create" element={<CreateListing />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/roommates" element={<Roommates />} />
          <Route path="/tutoring" element={<Tutoring />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/profile" element={user ? <Profile /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>

      {/* Modern High-End Startup Footer */}
      <footer className="border-t border-border/70 bg-card/40 backdrop-blur-md py-12 text-sm text-muted-foreground mt-auto">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-border/50">
            {/* Column 1: Brand Info */}
            <div className="md:col-span-1 space-y-3">
              <BrandLogo size="md" showWordmark={true} showBadge={false} />
              <p className="text-xs text-muted-foreground leading-relaxed">
                The all-in-one student platform unifying campus commerce, flexible jobs, peer housing, and collaborative academics.
              </p>
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">All Campus Networks Active</span>
              </div>
            </div>

            {/* Column 2: Ecosystem */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Ecosystem</h4>
              <ul className="space-y-1.5 text-xs">
                <li><Link to="/marketplace" className="hover:text-primary transition-colors">Campus Marketplace</Link></li>
                <li><Link to="/jobs" className="hover:text-primary transition-colors">Student Job Board</Link></li>
                <li><Link to="/roommates" className="hover:text-primary transition-colors">Housing & Roommates</Link></li>
                <li><Link to="/tutoring" className="hover:text-primary transition-colors">Peer Tutoring Network</Link></li>
              </ul>
            </div>

            {/* Column 3: Academics & Tools */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Academics</h4>
              <ul className="space-y-1.5 text-xs">
                <li><Link to="/notes" className="hover:text-primary transition-colors">Study Guides & Notes</Link></li>
                <li><Link to="/skills" className="hover:text-primary transition-colors">Skill Exchange Hub</Link></li>
                <li><Link to="/marketplace/create" className="hover:text-primary transition-colors">List a Textbook</Link></li>
                <li><Link to="/profile" className="hover:text-primary transition-colors">Student Profile</Link></li>
              </ul>
            </div>

            {/* Column 4: Trust & Verification */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Campus Trust</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every member is authenticated with university-level security. 100% student-focused, zero scam tolerance.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <Badge variant="verified" size="xs">.edu Verified</Badge>
                <Badge variant="secondary" size="xs">Zero Fees</Badge>
                <Badge variant="remote" size="xs">Peer-to-Peer</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>
              © {new Date().getFullYear()} Quadly (Campus Hub). Built with precision for student life.
            </div>
            <div className="flex items-center gap-6">
              <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span>
              <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Campus Guidelines</span>
              <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Contact Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function HomeView({ user }) {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All')

  const stats = [
    { value: '1,480+', label: 'Active Students', icon: Users, change: '+18% this month' },
    { value: '520+', label: 'Campus Items', icon: ShoppingBag, change: '100% Peer trades' },
    { value: '95+', label: 'Flexible Jobs', icon: Briefcase, change: '$18-$35/hr avg' },
    { value: '100%', label: 'Verified Community', icon: ShieldCheck, change: '.edu email check' },
  ]

  const modules = [
    {
      id: 'marketplace',
      title: 'Marketplace',
      badge: 'Trade',
      desc: 'Buy & sell textbooks, electronics, dorm furniture safely on campus with verified peers.',
      icon: ShoppingBag,
      link: '/marketplace',
      accent: 'from-blue-500/10 via-indigo-500/10 to-blue-500/5',
      iconColor: 'text-blue-500',
      tagline: 'Zero seller fees',
    },
    {
      id: 'jobs',
      title: 'Campus Jobs',
      badge: 'Earn',
      desc: 'Find flexible student roles, research assistantships, dining gigs, and freelance campus projects.',
      icon: Briefcase,
      link: '/jobs',
      accent: 'from-purple-500/10 via-pink-500/10 to-purple-500/5',
      iconColor: 'text-purple-500',
      tagline: 'Direct student hiring',
    },
    {
      id: 'roommates',
      title: 'Housing & Roommates',
      badge: 'Live',
      desc: 'Connect with verified student roommates, browse available rooms, subleases, and off-campus housing.',
      icon: HomeIcon,
      link: '/roommates',
      accent: 'from-emerald-500/10 via-teal-500/10 to-emerald-500/5',
      iconColor: 'text-emerald-500',
      tagline: 'Roommate compatibility',
    },
    {
      id: 'tutoring',
      title: 'Peer Tutoring',
      badge: 'Learn',
      desc: 'Connect with top-performing classmates in STEM, economics, computer science, and humanities.',
      icon: GraduationCap,
      link: '/tutoring',
      accent: 'from-amber-500/10 via-orange-500/10 to-amber-500/5',
      iconColor: 'text-amber-500',
      tagline: 'Course-specific help',
    },
    {
      id: 'skills',
      title: 'Skill Exchange',
      badge: 'Collaborate',
      desc: 'Trade talents: pair programming, language practice, graphic design, photography, and music production.',
      icon: Zap,
      link: '/skills',
      accent: 'from-rose-500/10 via-pink-500/10 to-rose-500/5',
      iconColor: 'text-rose-500',
      tagline: 'Free talent barter',
    },
    {
      id: 'notes',
      title: 'Study Notes & Guides',
      badge: 'Succeed',
      desc: 'Access crowdsourced lecture summaries, practice midterm exams, cheat sheets, and formula decks.',
      icon: FileText,
      link: '/notes',
      accent: 'from-cyan-500/10 via-blue-500/10 to-cyan-500/5',
      iconColor: 'text-cyan-500',
      tagline: 'Verified course summaries',
    },
  ]

  const filteredModules = activeCategoryFilter === 'All'
    ? modules
    : modules.filter(m => m.title.toLowerCase().includes(activeCategoryFilter.toLowerCase()) || m.badge.toLowerCase().includes(activeCategoryFilter.toLowerCase()))

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-border/50">
        {/* Ambient Radial Lighting & Grid Matrix */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-primary/20 via-purple-500/15 to-pink-500/20 rounded-full blur-3xl pointer-events-none opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.08),transparent_60%)]" />

        {/* Floating Interactive Micro-Badges */}
        <div className="hidden lg:block absolute inset-0 max-w-6xl mx-auto pointer-events-none">
          {/* Micro-badge 1: Top Left */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-12 left-6 pointer-events-auto bg-card/85 backdrop-blur-md border border-border/80 shadow-lg rounded-2xl p-3 flex items-center gap-2.5 max-w-[240px]"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 flex items-center justify-center shrink-0">
              <ShoppingBag size={16} />
            </div>
            <div className="text-left leading-tight">
              <p className="text-xs font-bold text-foreground truncate">MacBook Air M2</p>
              <p className="text-[11px] text-emerald-600 font-semibold">$620 • Just listed</p>
            </div>
          </motion.div>

          {/* Micro-badge 2: Top Right */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-16 right-6 pointer-events-auto bg-card/85 backdrop-blur-md border border-border/80 shadow-lg rounded-2xl p-3 flex items-center gap-2.5 max-w-[250px]"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center shrink-0">
              <Briefcase size={16} />
            </div>
            <div className="text-left leading-tight">
              <p className="text-xs font-bold text-foreground truncate">CS Lab Assistant</p>
              <p className="text-[11px] text-purple-600 font-semibold">$22/hr • On-Campus</p>
            </div>
          </motion.div>

          {/* Micro-badge 3: Bottom Left */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: [0, -7, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 left-12 pointer-events-auto bg-card/85 backdrop-blur-md border border-border/80 shadow-lg rounded-2xl p-3 flex items-center gap-2.5 max-w-[240px]"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
              <HomeIcon size={16} />
            </div>
            <div className="text-left leading-tight">
              <p className="text-xs font-bold text-foreground truncate">North Quad Suite</p>
              <p className="text-[11px] text-muted-foreground font-medium">Roommate matched!</p>
            </div>
          </motion.div>

          {/* Micro-badge 4: Bottom Right */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: [0, 6, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-12 right-12 pointer-events-auto bg-card/85 backdrop-blur-md border border-border/80 shadow-lg rounded-2xl p-3 flex items-center gap-2.5 max-w-[230px]"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
              <GraduationCap size={16} />
            </div>
            <div className="text-left leading-tight">
              <p className="text-xs font-bold text-foreground truncate">Organic Chem Review</p>
              <p className="text-[11px] text-amber-600 font-semibold">5.0 ★ (42 sessions)</p>
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          {/* Top Tag Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold mb-6 shadow-2xs hover:bg-primary/15 transition-colors cursor-pointer"
          >
            <Sparkles size={14} className="text-primary animate-pulse" />
            <span>The University Operating System for Student Life</span>
            <span className="h-1 w-1 rounded-full bg-primary" />
            <span className="font-semibold text-foreground/80">Quadly Campus</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08]"
          >
            College Life,{' '}
            <span className="text-gradient">
              Upgraded & Unified.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Trade textbooks and gear, discover student-friendly jobs, connect with trusted roommates, and share study notes within your verified university network.
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
                <span>Explore Marketplace</span>
                <ArrowRight size={18} />
              </Link>
            </Button>

            <Button asChild variant="secondary" size="lg">
              <Link to="/jobs" className="gap-2">
                <Briefcase size={18} className="text-primary" />
                <span>Student Jobs</span>
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg">
              <Link to="/roommates" className="gap-2">
                <HomeIcon size={18} className="text-emerald-500" />
                <span>Find Roommates</span>
              </Link>
            </Button>
          </motion.div>

          {/* Live Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-14 pt-8 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-1.5">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-foreground/80 mt-0.5">{stat.label}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{stat.change}</div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Interactive Category Filter Pills */}
      <section className="py-6 bg-muted/20 border-b border-border/40">
        <div className="container mx-auto px-4 max-w-6xl flex items-center justify-center gap-2 overflow-x-auto scrollbar-hide py-1">
          {['All', 'Marketplace', 'Jobs', 'Roommates', 'Tutoring', 'Skills', 'Notes'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeCategoryFilter === cat
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25 scale-105'
                  : 'bg-background/80 border border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Feature Grid Section with Staggered Animations */}
      <section className="py-16 md:py-24 container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-14">
          <Badge variant="gradient" size="sm" className="mb-3">Everything in One Place</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">The Six Pillars of Student Life</h2>
          <p className="text-muted-foreground mt-2.5 text-sm sm:text-base max-w-xl mx-auto">
            Engineered specifically to solve the real frictions college students face every single semester.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((m, idx) => {
            const Icon = m.icon
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
              >
                <Link
                  to={m.link}
                  className="block h-full group"
                >
                  <Card
                    interactive={true}
                    className="h-full p-6 bg-gradient-to-br from-card via-card to-background border-border/80 group-hover:border-primary/40 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-2xl bg-muted/60 ${m.iconColor} group-hover:scale-110 transition-transform`}>
                          <Icon size={24} />
                        </div>
                        <Badge variant="outline" size="sm" className="font-semibold">
                          {m.badge}
                        </Badge>
                      </div>

                      <h3 className="font-bold text-xl mb-2 text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                        <span>{m.title}</span>
                        <ArrowUpRight size={18} className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </h3>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {m.desc}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium text-foreground/75">{m.tagline}</span>
                      <span className="text-primary font-semibold group-hover:underline">Open module →</span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Trust & Campus Verification Bento Banner */}
      <section className="py-14 bg-gradient-to-b from-muted/30 to-background border-t border-border/60">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center mb-3">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-bold text-base text-foreground">Verified Student Network</h4>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Connect and transact solely with peers registered via authorized institutional credentials. Say goodbye to anonymous Craigslist scams.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-3">
                <Zap size={20} />
              </div>
              <h4 className="font-bold text-base text-foreground">0% Platform Surcharges</h4>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Keep 100% of your textbook sales and job earnings. We do not clip your hard-earned student budget with fee markups.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-pink-500/15 text-pink-600 flex items-center justify-center mb-3">
                <Sparkles size={20} />
              </div>
              <h4 className="font-bold text-base text-foreground">Unified Campus Graph</h4>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                One single login handles everything: finding an engineering roommate, subletting your dorm room, or hiring a math tutor for finals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      {!user && (
        <section className="py-16 md:py-20 relative overflow-hidden bg-gradient-to-r from-primary/10 via-purple-600/10 to-pink-500/10 border-t border-border/60">
          <div className="container mx-auto px-4 text-center max-w-2xl relative z-10">
            <BrandSymbol size="md" className="mx-auto mb-4" />
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to unlock your campus?</h3>
            <p className="text-muted-foreground text-sm sm:text-base mt-3 mb-8 leading-relaxed">
              Create an account with your university email to access the verified marketplace, on-campus jobs, housing, and study materials immediately.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild variant="glow" size="lg">
                <Link to="/signup" className="gap-2">
                  <span>Join Quadly Free</span>
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Sign in with Existing Account</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
