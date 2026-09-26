import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
  TrendingUp, ShoppingBag, Briefcase, Home, GraduationCap,
  Sparkles, Calendar, Clock, ArrowRight, ShieldCheck, Heart,
  Activity, Bell, MessageSquare, ChevronRight, UserCheck, Zap
} from "lucide-react"
import { Button } from "../components/ui/Button"
import { Card3D } from "../components/ui/Card3D"
import { Badge, VerifiedBadge } from "../components/ui/Badge"
import { api } from "../services/api"
import { useAuthStore } from "../store/useAuthStore"
import { handleImageError } from "../lib/utils"

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null)
  const [recentListings, setRecentListings] = useState([])
  const [recentJobs, setRecentJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, switchStudent } = useAuthStore()

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const [m, listData, jobData] = await Promise.all([
        api.dashboard.getMetrics(),
        api.marketplace.getAll({ sortBy: "newest" }),
        api.jobs.getAll()
      ])
      setMetrics(m)
      setRecentListings(listData.slice(0, 3))
      setRecentJobs(jobData.slice(0, 3))
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const kpis = [
    {
      label: "My Marketplace Items",
      value: metrics?.totalListings || 0,
      icon: ShoppingBag,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-400/30",
      link: "/profile"
    },
    {
      label: "Job Applications",
      value: metrics?.totalApplications || 0,
      icon: Briefcase,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-400/30",
      link: "/jobs"
    },
    {
      label: "Tutoring Sessions",
      value: metrics?.totalBookings || 0,
      icon: GraduationCap,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-400/30",
      link: "/tutoring"
    },
    {
      label: "Active Rentals",
      value: metrics?.totalRentals || 0,
      icon: Clock,
      color: "text-pink-400",
      bg: "bg-pink-500/10 border-pink-400/30",
      link: "/rentals"
    },
    {
      label: "Saved Favorites",
      value: metrics?.totalFavorites || 0,
      icon: Heart,
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-400/30",
      link: "/profile"
    },
    {
      label: "Campus Trust Score",
      value: `${metrics?.trustScore || 98}%`,
      icon: ShieldCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-400/30",
      link: "/profile"
    }
  ]

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
      {/* Ambient Radial Lights */}
      <div className="ambient-aurora w-[600px] h-[350px] bg-cyan-500/10 top-0 left-10 pointer-events-none" />
      <div className="ambient-aurora w-[600px] h-[350px] bg-purple-600/15 top-1/4 right-0 pointer-events-none" />

      {/* Header with Switch Student Persona Quick-Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="verified" size="xs" className="border-cyan-400/30 text-cyan-300">
              Campus Intelligence 3D
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">• Live Data Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Student Command Center</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back, <span className="text-white font-bold">{user?.user_metadata?.full_name || "Student"}</span>. All your campus metrics and upcoming deadlines in one 3D matrix.
          </p>
        </div>

        {/* Demo Switch Persona Dock */}
        <div className="flex items-center gap-2 p-1.5 bg-[#0B0F1C]/90 border border-white/10 rounded-2xl backdrop-blur-xl">
          <span className="text-[11px] font-bold text-muted-foreground px-2">Switch Student:</span>
          {[
            { id: "usr_aarav", name: "Aarav" },
            { id: "usr_priya", name: "Priya" },
            { id: "usr_ananya", name: "Ananya" },
            { id: "usr_rohan", name: "Rohan" }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => switchStudent(p.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                user?.id === p.id
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-xs"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* KPI 3D Stat Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 relative z-10"
      >
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <motion.div key={idx} variants={item}>
              <Link to={kpi.link}>
                <Card3D neonGlow="cyan" maxTilt={10} className="p-4 flex flex-col justify-between h-full group">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-xl border ${kpi.bg} ${kpi.color}`}>
                      <Icon size={16} />
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
                      {kpi.value}
                    </div>
                    <div className="text-[11px] font-semibold text-muted-foreground mt-0.5 truncate">
                      {kpi.label}
                    </div>
                  </div>
                </Card3D>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Main Grid: Activity & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left Column: Recent Activity & Applications (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Activity Stream */}
          <div className="p-6 rounded-3xl bg-[#0E1322]/90 border border-white/10 backdrop-blur-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Activity size={18} className="text-cyan-400" /> Recent Campus Activity
              </h3>
              <Badge variant="verified" size="xs">Live Stream</Badge>
            </div>

            {metrics?.recentActivity && metrics.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {metrics.recentActivity.map(act => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between hover:border-cyan-400/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shrink-0">
                        {act.type === "application" ? <Briefcase size={15} /> : <GraduationCap size={15} />}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-white">{act.title}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {new Date(act.date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                      {act.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-xs">
                No recent activity recorded yet. Apply to jobs or book tutoring to see updates here!
              </div>
            )}
          </div>

          {/* Recommended Jobs */}
          <div className="p-6 rounded-3xl bg-[#0E1322]/90 border border-white/10 backdrop-blur-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Briefcase size={18} className="text-purple-400" /> High-Match Campus Jobs
              </h3>
              <Link to="/jobs" className="text-xs text-cyan-400 hover:underline font-semibold">
                View All Jobs
              </Link>
            </div>

            <div className="space-y-3">
              {recentJobs.map(job => (
                <Link
                  key={job.id}
                  to="/jobs"
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between hover:border-purple-400/40 transition-colors block group"
                >
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                      {job.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{job.company}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400 text-sm">
                      {job.pay_type === "hourly" ? `$${job.pay_amount}/hr` : `$${job.pay_amount} stipend`}
                    </span>
                    <span className="text-[10px] text-muted-foreground block capitalize">{job.job_type}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recommended Items & Quick Links (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Action Dock */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-[#0B0F1C] to-[#070A14] border border-cyan-500/25 backdrop-blur-2xl shadow-xl">
            <div className="flex items-center gap-2 mb-3 text-cyan-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles size={14} /> Quick Actions
            </div>
            <h3 className="text-xl font-black text-white mb-2">Publish to Campus Grid</h3>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
              Sell textbooks, list camera gear for rent, or start a collaborative study circle in seconds.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <Button asChild variant="glow" size="sm">
                <Link to="/marketplace/create" className="gap-1.5">
                  <ShoppingBag size={14} />
                  <span>List Item</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-white/15">
                <Link to="/rentals" className="gap-1.5">
                  <Clock size={14} className="text-cyan-400" />
                  <span>Rent Gear</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-white/15">
                <Link to="/study-groups" className="gap-1.5">
                  <GraduationCap size={14} className="text-purple-400" />
                  <span>Study Circles</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-white/15">
                <Link to="/messages" className="gap-1.5">
                  <MessageSquare size={14} className="text-pink-400" />
                  <span>Messages</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Trending Marketplace Drops */}
          <div className="p-6 rounded-3xl bg-[#0E1322]/90 border border-white/10 backdrop-blur-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <ShoppingBag size={18} className="text-cyan-400" /> Trending Items
              </h3>
              <Link to="/marketplace" className="text-xs text-cyan-400 hover:underline font-semibold">
                Explore Market
              </Link>
            </div>

            <div className="space-y-3">
              {recentListings.map(itemData => (
                <Link
                  key={itemData.id}
                  to="/marketplace"
                  className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3 hover:border-cyan-400/40 transition-colors block group"
                >
                  <img
                    src={itemData.image_url}
                    alt=""
                    onError={handleImageError}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors truncate">
                      {itemData.title}
                    </h4>
                    <span className="text-[11px] text-muted-foreground">{itemData.category} • {itemData.condition}</span>
                  </div>
                  <span className="font-black text-sm text-white shrink-0">${itemData.price}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
