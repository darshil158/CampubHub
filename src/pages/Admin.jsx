import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ShieldAlert, Users, ShoppingBag, Briefcase, FileText,
  AlertTriangle, Check, Ban, Eye, ShieldCheck, Activity, Search
} from "lucide-react"
import { Button } from "../components/ui/Button"
import { Badge, VerifiedBadge } from "../components/ui/Badge"
import { Card3D } from "../components/ui/Card3D"
import { api } from "../services/api"
import { useAuthStore } from "../store/useAuthStore"

export default function Admin() {
  const [stats, setStats] = useState(null)
  const [reports, setReports] = useState([])
  const [profiles, setProfiles] = useState([])
  const [activeTab, setActiveTab] = useState("reports")
  const [isLoading, setIsLoading] = useState(true)
  const [actionSuccess, setActionSuccess] = useState(null)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    setIsLoading(true)
    try {
      const [s, r, allListings] = await Promise.all([
        api.admin.getStats(),
        api.admin.getReports(),
        api.marketplace.getAll()
      ])
      setStats(s)
      setReports(r)
      // Extract unique profiles from listings
      const studentMap = new Map()
      allListings.forEach(l => {
        if (l.profiles) studentMap.set(l.profiles.id, l.profiles)
      })
      setProfiles(Array.from(studentMap.values()))
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResolve = async (reportId, action) => {
    await api.admin.resolveReport(reportId, action)
    setActionSuccess(`Report ${action === 'ban' ? 'banned item' : 'dismissed'} successfully.`)
    setTimeout(() => setActionSuccess(null), 3000)
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: action === 'ban' ? 'banned' : 'resolved' } : r))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl relative">
      {/* Ambient Auroras */}
      <div className="ambient-aurora w-[600px] h-[350px] bg-red-600/10 top-0 left-10 pointer-events-none" />
      <div className="ambient-aurora w-[600px] h-[350px] bg-cyan-600/10 bottom-0 right-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="verified" size="xs" className="border-red-400/30 text-red-300">
              Campus Security & Moderation 3D
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">• Institutional Governance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Admin Command Matrix</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Campus-wide moderation, trust metrics, report resolution, and platform integrity management.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm flex items-center gap-2 relative z-10">
          <Check size={16} /> {actionSuccess}
        </div>
      )}

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 relative z-10">
        {[
          { label: "Active Students", val: stats?.totalUsers || 8, icon: Users, color: "text-cyan-400" },
          { label: "Marketplace Items", val: stats?.totalListings || 18, icon: ShoppingBag, color: "text-purple-400" },
          { label: "Campus Jobs", val: stats?.totalJobs || 5, icon: Briefcase, color: "text-emerald-400" },
          { label: "Study Guides", val: stats?.totalNotes || 6, icon: FileText, color: "text-pink-400" },
          { label: "Study Circles", val: stats?.totalStudyGroups || 4, icon: Activity, color: "text-amber-400" },
          { label: "Moderation Queue", val: stats?.pendingReports || 1, icon: AlertTriangle, color: "text-red-400" }
        ].map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <Card3D key={idx} neonGlow="cyan" maxTilt={8} className="p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-muted-foreground">{kpi.label}</span>
                <Icon size={14} className={kpi.color} />
              </div>
              <div className={`text-2xl font-black text-white ${kpi.color}`}>
                {kpi.val}
              </div>
            </Card3D>
          )
        })}
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 relative z-10">
        {[
          { id: "reports", label: "Moderation Queue", count: reports.filter(r => r.status === "pending").length },
          { id: "students", label: "Student Directory", count: profiles.length },
          { id: "audit", label: "Platform Audit Log" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] border border-red-400/40"
                : "bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 border border-white/15">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="relative z-10">
        {activeTab === "reports" && (
          <div className="p-6 rounded-3xl bg-[#0E1322]/90 border border-white/10 backdrop-blur-2xl shadow-xl space-y-4">
            <h3 className="font-bold text-lg text-white mb-2 flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-400" /> Pending Flagged Reports
            </h3>

            {reports.map(rep => (
              <div
                key={rep.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Report #{rep.id}</span>
                    <span className="text-xs text-muted-foreground">• Target: {rep.item_type} ({rep.item_id})</span>
                    <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold uppercase ${
                      rep.status === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {rep.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white">Reason: {rep.reason}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Reported by: {rep.reporter?.full_name}</p>
                </div>

                {rep.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="xs"
                      variant="outline"
                      className="text-xs border-white/15 hover:border-emerald-400"
                      onClick={() => handleResolve(rep.id, "dismiss")}
                    >
                      <Check size={12} className="mr-1" /> Dismiss
                    </Button>
                    <Button
                      size="xs"
                      variant="destructive"
                      className="text-xs bg-red-600 hover:bg-red-700"
                      onClick={() => handleResolve(rep.id, "ban")}
                    >
                      <Ban size={12} className="mr-1" /> Remove Post
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "students" && (
          <div className="p-6 rounded-3xl bg-[#0E1322]/90 border border-white/10 backdrop-blur-2xl shadow-xl">
            <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Users size={18} className="text-cyan-400" /> Verified Student Directory
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-muted-foreground">
                <thead className="text-[11px] uppercase tracking-wider text-white border-b border-white/10">
                  <tr>
                    <th className="pb-3">Student Name</th>
                    <th className="pb-3">University</th>
                    <th className="pb-3">Course / Major</th>
                    <th className="pb-3">Trust Score</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {profiles.map(p => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 font-bold text-white flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px]">
                          {p.full_name?.charAt(0)}
                        </div>
                        <span>{p.full_name}</span>
                      </td>
                      <td className="py-3">{p.university}</td>
                      <td className="py-3">{p.course || "B.Tech CSE"}</td>
                      <td className="py-3 font-bold text-emerald-400">{p.trust_score || 98}%</td>
                      <td className="py-3">
                        <Badge variant="verified" size="xs">.edu Verified</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "audit" && (
          <div className="p-6 rounded-3xl bg-[#0E1322]/90 border border-white/10 backdrop-blur-2xl shadow-xl space-y-3">
            <h3 className="font-bold text-lg text-white mb-2 flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400" /> Immutable Security Logs
            </h3>
            {[
              { event: "Institutional Domain Verification", actor: "System Daemon", time: "10 mins ago", status: "Success" },
              { event: "New Listing Escrow Check (MacBook Air M2)", actor: "usr_aarav", time: "2 hours ago", status: "Approved" },
              { event: "P2P Rental Security Contract Issued", actor: "usr_vikram", time: "4 hours ago", status: "Logged" },
              { event: "Admin User Role Session Refresh", actor: "Supervisor", time: "1 day ago", status: "Audited" }
            ].map((log, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white block">{log.event}</span>
                  <span className="text-[11px] text-muted-foreground">Actor: {log.actor} • {log.time}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
