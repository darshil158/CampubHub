import { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Search, LogIn, LogOut, User as UserIcon,
  Menu, X, Briefcase, Home as HomeIcon, ShoppingBag,
  GraduationCap, Zap, FileText, ArrowRight, Sparkles, CheckCircle2,
  ShieldCheck, Users, Building, ChevronRight
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

const NAV_LINKS = [
  { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
  { name: 'Jobs', path: '/jobs', icon: Briefcase },
  { name: 'Roommates', path: '/roommates', icon: HomeIcon },
  { name: 'Tutoring', path: '/tutoring', icon: GraduationCap },
  { name: 'Skills', path: '/skills', icon: Zap },
  { name: 'Notes', path: '/notes', icon: FileText },
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
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 shadow-xs">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="bg-primary text-primary-foreground p-2 rounded-xl shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
                <BookOpen size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Campus Hub
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium">
              {NAV_LINKS.map(link => {
                const active = isActive(link.path)
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-lg transition-all ${
                      active
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    {link.name}
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
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-border/60 hover:bg-muted/60 text-sm font-medium transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-semibold">
                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline text-xs font-medium max-w-[120px] truncate">
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Profile'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium px-3.5 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center space-x-1.5 bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                >
                  <LogIn size={16} />
                  <span>Get Started</span>
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
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
              className="lg:hidden border-b border-border/80 bg-background/95 backdrop-blur-md px-4 py-4 space-y-2 overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2">
                {NAV_LINKS.map(link => {
                  const Icon = link.icon
                  const active = isActive(link.path)
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{link.name}</span>
                    </Link>
                  )
                })}
              </div>

              {user && (
                <div className="pt-2 border-t border-border/50">
                  <Link
                    to="/profile"
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted/60"
                  >
                    <span className="flex items-center gap-2">
                      <UserIcon size={16} /> My Profile & Activity
                    </span>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </Link>
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

      {/* Footer */}
      <footer className="border-t border-border/60 bg-muted/20 py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="bg-primary/10 text-primary p-1 rounded-md">
              <BookOpen size={16} />
            </div>
            <span className="font-semibold text-foreground">Campus Hub</span>
            <span className="text-xs text-muted-foreground">— Built for student life</span>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <Link to="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link>
            <Link to="/jobs" className="hover:text-foreground transition-colors">Jobs</Link>
            <Link to="/roommates" className="hover:text-foreground transition-colors">Roommates</Link>
            <Link to="/tutoring" className="hover:text-foreground transition-colors">Tutoring</Link>
            <Link to="/notes" className="hover:text-foreground transition-colors">Notes</Link>
          </div>

          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Campus Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

function HomeView({ user }) {
  const modules = [
    {
      title: 'Marketplace',
      desc: 'Buy & sell textbooks, electronics, dorm furniture safely on campus.',
      icon: ShoppingBag,
      link: '/marketplace',
      tag: 'Trade',
      gradient: 'from-blue-500/10 to-indigo-500/10 hover:border-blue-400/30',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Campus Jobs',
      desc: 'Find flexible student roles, on-campus employment, and freelance gigs.',
      icon: Briefcase,
      link: '/jobs',
      tag: 'Earn',
      gradient: 'from-purple-500/10 to-pink-500/10 hover:border-purple-400/30',
      iconColor: 'text-purple-500',
    },
    {
      title: 'Roommates & Housing',
      desc: 'Connect with verified student roommates, open rooms, and subleases.',
      icon: HomeIcon,
      link: '/roommates',
      tag: 'Live',
      gradient: 'from-emerald-500/10 to-teal-500/10 hover:border-emerald-400/30',
      iconColor: 'text-emerald-500',
    },
    {
      title: 'Peer Tutoring',
      desc: 'Learn from high-achieving classmates in STEM, humanities, and business.',
      icon: GraduationCap,
      link: '/tutoring',
      tag: 'Learn',
      gradient: 'from-amber-500/10 to-orange-500/10 hover:border-amber-400/30',
      iconColor: 'text-amber-500',
    },
    {
      title: 'Skill Exchange',
      desc: 'Swap talents: code reviews, language practice, graphic design, and music.',
      icon: Zap,
      link: '/skills',
      tag: 'Collaborate',
      gradient: 'from-rose-500/10 to-red-500/10 hover:border-rose-400/30',
      iconColor: 'text-rose-500',
    },
    {
      title: 'Study Notes',
      desc: 'Access crowdsourced lecture summaries, cheat sheets, and exam study guides.',
      icon: FileText,
      link: '/notes',
      tag: 'Succeed',
      gradient: 'from-cyan-500/10 to-blue-500/10 hover:border-cyan-400/30',
      iconColor: 'text-cyan-500',
    },
  ]

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-primary/5 via-background to-background border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,hsl(var(--primary)/0.12),transparent_70%)]" />

        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6 shadow-xs"
          >
            <Sparkles size={14} />
            <span>The All-In-One Campus Community Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15]"
          >
            Your College Life,{' '}
            <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-500 bg-clip-text text-transparent">
              All In One Place.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Buy & sell campus goods, discover part-time jobs, find trusted roommates, exchange skills, and share lecture notes within your verified university network.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            <Link
              to="/marketplace"
              className="bg-primary text-primary-foreground px-6 sm:px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center gap-2 group text-sm sm:text-base"
            >
              <span>Explore Marketplace</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/jobs"
              className="bg-card text-card-foreground border border-border px-6 sm:px-8 py-3 rounded-xl font-semibold hover:bg-muted/80 transition-all shadow-xs flex items-center gap-2 text-sm sm:text-base"
            >
              <Briefcase size={16} className="text-primary" />
              <span>Campus Jobs</span>
            </Link>

            <Link
              to="/roommates"
              className="bg-card text-card-foreground border border-border px-6 sm:px-8 py-3 rounded-xl font-semibold hover:bg-muted/80 transition-all shadow-xs flex items-center gap-2 text-sm sm:text-base"
            >
              <HomeIcon size={16} className="text-emerald-500" />
              <span>Find Housing</span>
            </Link>
          </motion.div>

          {/* Social Proof Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-14 pt-8 border-t border-border/50 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            <div>
              <div className="text-2xl font-bold text-foreground">1,200+</div>
              <div className="text-xs text-muted-foreground mt-0.5">Active Students</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">450+</div>
              <div className="text-xs text-muted-foreground mt-0.5">Campus Listings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">85+</div>
              <div className="text-xs text-muted-foreground mt-0.5">Flexible Jobs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600 flex items-center justify-center gap-1">
                <ShieldCheck size={18} /> Verified
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Student Community</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-16 md:py-20 container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Everything You Need To Thrive In College</h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Integrated modules tailored specifically for university campus ecosystems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m, idx) => {
            const Icon = m.icon
            return (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link
                  to={m.link}
                  className={`block h-full p-6 rounded-2xl border border-border/60 bg-gradient-to-br ${m.gradient} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-background/80 shadow-xs ${m.iconColor}`}>
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-background/80 border border-border/40 text-muted-foreground">
                      {m.tag}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg mb-1.5 flex items-center justify-between text-foreground group-hover:text-primary transition-colors">
                    <span>{m.title}</span>
                    <ChevronRight size={18} className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {m.desc}
                  </p>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      {!user && (
        <section className="py-14 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/5 border-t border-border/60">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h3 className="text-2xl font-bold">Ready to connect with your campus?</h3>
            <p className="text-muted-foreground text-sm mt-2 mb-6">
              Create an account using your student email to unlock jobs, housing, marketplace, and peer study tools.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
            >
              <span>Join Campus Hub Free</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
