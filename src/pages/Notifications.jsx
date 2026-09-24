import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import {
  Bell, CheckCheck, MessageSquare, Briefcase, Calendar,
  ShieldCheck, ArrowRight, Trash2, Clock, Check
} from "lucide-react"
import { Button } from "../components/ui/Button"
import { Badge, VerifiedBadge } from "../components/ui/Badge"
import { Card3D } from "../components/ui/Card3D"
import { api } from "../services/api"
import { useAuthStore } from "../store/useAuthStore"

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuthStore()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const data = await api.notifications.getAll()
      setNotifications(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAllRead = async () => {
    await api.notifications.markAllRead()
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  const handleMarkRead = async (id) => {
    await api.notifications.markRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  const filteredNotifs = notifications.filter(n => {
    if (activeTab === "all") return true
    return n.type === activeTab
  })

  const getIcon = (type) => {
    switch (type) {
      case "message":
        return <MessageSquare size={16} className="text-cyan-400" />
      case "application":
        return <Briefcase size={16} className="text-purple-400" />
      case "booking":
        return <Calendar size={16} className="text-emerald-400" />
      case "system":
      default:
        return <ShieldCheck size={16} className="text-pink-400" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl relative">
      {/* Ambient Auroras */}
      <div className="ambient-aurora w-[500px] h-[300px] bg-cyan-500/10 top-10 left-10 pointer-events-none" />
      <div className="ambient-aurora w-[500px] h-[300px] bg-purple-600/15 bottom-10 right-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="verified" size="xs" className="border-cyan-400/30 text-cyan-300">
              Notification Matrix 3D
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">• Activity & Real-Time Alerts</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Notifications</h1>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllRead}
          className="gap-1.5 border-white/15 text-xs hover:border-cyan-400/40"
        >
          <CheckCheck size={14} className="text-cyan-400" />
          <span>Mark All as Read</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 relative z-10 py-1">
        {[
          { id: "all", label: "All Alerts" },
          { id: "message", label: "Messages" },
          { id: "application", label: "Applications" },
          { id: "booking", label: "Bookings" },
          { id: "system", label: "System" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_15px_rgba(0,240,255,0.3)] border border-cyan-400/40"
                : "bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="space-y-3 relative z-10">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-20 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
          ))}
        </div>
      ) : filteredNotifs.length > 0 ? (
        <div className="space-y-3 relative z-10">
          {filteredNotifs.map(notif => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                notif.is_read
                  ? "bg-[#0E1322]/80 border-white/10"
                  : "bg-[#0E172E]/95 border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className={`p-2.5 rounded-xl border shrink-0 ${
                  notif.is_read ? "bg-white/5 border-white/10" : "bg-cyan-500/20 border-cyan-400/40"
                }`}>
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white truncate">{notif.title}</h4>
                    {!notif.is_read && (
                      <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-white/50">
                    <span>{new Date(notif.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    {notif.link && (
                      <Link to={notif.link} className="text-cyan-400 hover:underline font-semibold flex items-center gap-1">
                        <span>Go to {notif.type}</span>
                        <ArrowRight size={10} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {!notif.is_read && (
                <button
                  onClick={() => handleMarkRead(notif.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-cyan-400 hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                  title="Mark as read"
                >
                  <Check size={16} />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-white/15 bg-white/5 backdrop-blur-xl flex flex-col items-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-400/30">
            <Bell size={30} />
          </div>
          <h3 className="text-xl font-bold mb-1 text-white">All Caught Up!</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            No unread notifications at the moment. New messages, application alerts, and bookings will appear here.
          </p>
        </div>
      )}
    </div>
  )
}
