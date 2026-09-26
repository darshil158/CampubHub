import {
  INITIAL_PROFILES,
  INITIAL_LISTINGS,
  INITIAL_RENTALS,
  INITIAL_SKILLS,
  INITIAL_NOTES,
  INITIAL_TUTORS,
  INITIAL_ROOMMATES,
  INITIAL_JOBS,
  INITIAL_STUDY_GROUPS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_FAVORITES
} from "../data/seedData"

const DB_KEY = "QUADLY_CAMPUS_DB_V4"

// Helper to delay for realistic UX transitions
const delay = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

class CampusDB {
  constructor() {
    this.init()
  }

  init() {
    const raw = localStorage.getItem(DB_KEY)
    if (!raw) {
      this.resetToSeed()
    }
  }

  resetToSeed() {
    const initialData = {
      profiles: INITIAL_PROFILES,
      currentUserId: "usr_aarav",
      listings: INITIAL_LISTINGS,
      rentals: INITIAL_RENTALS,
      skills: INITIAL_SKILLS,
      notes: INITIAL_NOTES,
      tutors: INITIAL_TUTORS,
      roommates: INITIAL_ROOMMATES,
      jobs: INITIAL_JOBS,
      studyGroups: INITIAL_STUDY_GROUPS,
      conversations: INITIAL_CONVERSATIONS,
      messages: INITIAL_MESSAGES,
      notifications: INITIAL_NOTIFICATIONS,
      favorites: INITIAL_FAVORITES,
      applications: [
        {
          id: "app_1",
          job_id: "job_1",
          user_id: "usr_rohan",
          resume_note: "Proficient with Linux and C++. Was lab prefect in high school.",
          status: "pending",
          created_at: "2026-09-24T10:00:00Z"
        },
        {
          id: "app_2",
          job_id: "job_2",
          user_id: "usr_aarav",
          resume_note: "Experience building full stack apps with Next.js and Tailwind.",
          status: "reviewed",
          created_at: "2026-09-23T14:00:00Z"
        }
      ],
      bookings: [
        {
          id: "bk_1",
          tutor_id: "tut_1",
          student_id: "usr_aarav",
          subject: "Machine Learning (CNNs)",
          date: "2026-09-25",
          time: "17:00",
          status: "confirmed",
          created_at: "2026-09-24T12:00:00Z"
        }
      ],
      reports: [
        {
          id: "rep_1",
          item_type: "listing",
          item_id: "lst_8",
          reported_by: "usr_vikram",
          reason: "Suspected duplicate bike post",
          status: "pending",
          created_at: "2026-09-23T15:20:00Z"
        }
      ]
    }
    localStorage.setItem(DB_KEY, JSON.stringify(initialData))
  }

  getData() {
    try {
      const raw = localStorage.getItem(DB_KEY)
      if (!raw) {
        this.resetToSeed()
        return JSON.parse(localStorage.getItem(DB_KEY))
      }
      const data = JSON.parse(raw)
      let needsSave = false

      // Self-heal skills and notes if missing or outdated
      if (!data.skills || data.skills.length < 10) {
        data.skills = INITIAL_SKILLS
        needsSave = true
      }
      if (!data.notes || data.notes.length < 10) {
        data.notes = INITIAL_NOTES
        needsSave = true
      }

      if (needsSave) {
        this.saveData(data)
      }
      return data
    } catch {
      this.resetToSeed()
      return JSON.parse(localStorage.getItem(DB_KEY))
    }
  }

  saveData(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data))
  }

  getProfile(userId) {
    const db = this.getData()
    const p = db.profiles.find(x => x.id === userId) || db.profiles[0]
    return {
      ...p,
      college: p?.university || p?.college || "Campus University"
    }
  }

  getCurrentUser() {
    const db = this.getData()
    const p = db.profiles.find(x => x.id === db.currentUserId) || db.profiles[0]
    return {
      ...p,
      college: p?.university || p?.college || "Campus University"
    }
  }
}

const db = new CampusDB()

/**
 * Unified Quadly API Client
 */
export const api = {
  // ── Auth & Profile ────────────────────────────────────────────────────────
  auth: {
    async getCurrentUser() {
      await delay(50)
      return db.getCurrentUser()
    },
    async setCurrentUser(userId) {
      const data = db.getData()
      data.currentUserId = userId
      db.saveData(data)
      return db.getCurrentUser()
    },
    async getProfile(userId) {
      await delay(50)
      return db.getProfile(userId)
    },
    async updateProfile(updates) {
      await delay(120)
      const data = db.getData()
      const currentUser = db.getCurrentUser()
      const idx = data.profiles.findIndex(p => p.id === currentUser.id)
      if (idx !== -1) {
        data.profiles[idx] = { ...data.profiles[idx], ...updates }
        db.saveData(data)
        return data.profiles[idx]
      }
      return currentUser
    }
  },

  // ── Marketplace ──────────────────────────────────────────────────────────
  marketplace: {
    async getAll({ search = "", category = "All", condition = "All", sortBy = "newest", minPrice = 0, maxPrice = 10000 } = {}) {
      await delay(90)
      const data = db.getData()
      let items = [...data.listings]

      // Filter by category
      if (category && category !== "All") {
        items = items.filter(i => i.category.toLowerCase() === category.toLowerCase())
      }

      // Filter by condition
      if (condition && condition !== "All") {
        items = items.filter(i => i.condition.toLowerCase() === condition.toLowerCase())
      }

      // Filter by price range
      items = items.filter(i => i.price >= minPrice && i.price <= maxPrice)

      // Search query
      if (search) {
        const q = search.toLowerCase()
        items = items.filter(i =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q)
        )
      }

      // Sorting
      if (sortBy === "price_asc") {
        items.sort((a, b) => a.price - b.price)
      } else if (sortBy === "price_desc") {
        items.sort((a, b) => b.price - a.price)
      } else if (sortBy === "popular") {
        items.sort((a, b) => b.views - a.views)
      } else {
        // newest
        items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      }

      // Join seller profile
      return items.map(item => ({
        ...item,
        profiles: db.getProfile(item.seller_id)
      }))
    },

    async getById(id) {
      await delay(60)
      const data = db.getData()
      const item = data.listings.find(i => i.id === id)
      if (!item) throw new Error("Listing not found")
      return {
        ...item,
        profiles: db.getProfile(item.seller_id)
      }
    },

    async create(listingData) {
      await delay(150)
      const data = db.getData()
      const user = db.getCurrentUser()
      const newListing = {
        id: `lst_${Date.now()}`,
        seller_id: user.id,
        status: "active",
        views: 1,
        favorites: 0,
        created_at: new Date().toISOString(),
        ...listingData
      }
      data.listings.unshift(newListing)
      db.saveData(data)
      return {
        ...newListing,
        profiles: user
      }
    },

    async delete(id) {
      await delay(120)
      const data = db.getData()
      data.listings = data.listings.filter(i => i.id !== id)
      db.saveData(data)
      return { success: true }
    },

    async toggleFavorite(listingId) {
      await delay(60)
      const data = db.getData()
      const user = db.getCurrentUser()
      const existingIdx = data.favorites.findIndex(
        f => f.user_id === user.id && f.item_id === listingId && f.item_type === "listing"
      )

      let isFav = false
      if (existingIdx !== -1) {
        data.favorites.splice(existingIdx, 1)
        const l = data.listings.find(x => x.id === listingId)
        if (l && l.favorites > 0) l.favorites -= 1
        isFav = false
      } else {
        data.favorites.push({
          id: `fav_${Date.now()}`,
          user_id: user.id,
          item_type: "listing",
          item_id: listingId
        })
        const l = data.listings.find(x => x.id === listingId)
        if (l) l.favorites = (l.favorites || 0) + 1
        isFav = true
      }
      db.saveData(data)
      return { isFavorite: isFav }
    }
  },

  // ── Rentals ──────────────────────────────────────────────────────────────
  rentals: {
    async getAll({ search = "", category = "All" } = {}) {
      await delay(80)
      const data = db.getData()
      let items = [...data.rentals]

      if (category && category !== "All") {
        items = items.filter(i => i.category.toLowerCase() === category.toLowerCase())
      }
      if (search) {
        const q = search.toLowerCase()
        items = items.filter(i =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q)
        )
      }

      return items.map(item => ({
        ...item,
        profiles: db.getProfile(item.owner_id)
      }))
    },

    async create(rentalData) {
      await delay(140)
      const data = db.getData()
      const user = db.getCurrentUser()
      const newRental = {
        id: `rnt_${Date.now()}`,
        owner_id: user.id,
        status: "available",
        min_days: 1,
        ...rentalData
      }
      data.rentals.unshift(newRental)
      db.saveData(data)
      return { ...newRental, profiles: user }
    },

    async requestRental({ rentalId, days = 1, startDate }) {
      await delay(120)
      const data = db.getData()
      const user = db.getCurrentUser()
      const rental = data.rentals.find(r => r.id === rentalId)
      if (!rental) throw new Error("Rental not found")

      // Add a notification for owner
      data.notifications.unshift({
        id: `notif_${Date.now()}`,
        user_id: rental.owner_id,
        type: "booking",
        title: "Rental Booking Request",
        description: `${user.full_name} requested to rent '${rental.title}' for ${days} days starting ${startDate}.`,
        link: "/profile",
        is_read: false,
        created_at: new Date().toISOString()
      })
      db.saveData(data)
      return { success: true, message: "Rental request sent to owner!" }
    }
  },

  // ── Skills ───────────────────────────────────────────────────────────────
  skills: {
    async getAll({ search = "", type = "all" } = {}) {
      await delay(80)
      const data = db.getData()
      let items = [...data.skills]

      if (type && type !== "all") {
        items = items.filter(s => s.type === type)
      }
      if (search) {
        const q = search.toLowerCase()
        items = items.filter(s =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
        )
      }

      return items.map(item => ({
        ...item,
        profiles: db.getProfile(item.profile_id)
      }))
    },

    async create(skillData) {
      await delay(120)
      const data = db.getData()
      const user = db.getCurrentUser()
      const newSkill = {
        id: `skl_${Date.now()}`,
        profile_id: user.id,
        rating: 5.0,
        created_at: new Date().toISOString(),
        ...skillData
      }
      data.skills.unshift(newSkill)
      db.saveData(data)
      return { ...newSkill, profiles: user }
    },

    async proposeSwap({ skillId, offerNote }) {
      await delay(100)
      const data = db.getData()
      const user = db.getCurrentUser()
      const skill = data.skills.find(s => s.id === skillId)
      if (!skill) throw new Error("Skill not found")

      data.notifications.unshift({
        id: `notif_${Date.now()}`,
        user_id: skill.profile_id,
        type: "offer",
        title: "Skill Swap Proposal Received",
        description: `${user.full_name} wants to swap skills with you: "${offerNote}".`,
        link: "/skills",
        is_read: false,
        created_at: new Date().toISOString()
      })
      db.saveData(data)
      return { success: true }
    }
  },

  // ── Notes & Study Guides ─────────────────────────────────────────────────
  notes: {
    async getAll({ search = "", subject = "All" } = {}) {
      await delay(80)
      const data = db.getData()
      let items = [...data.notes]

      if (subject && subject !== "All") {
        items = items.filter(n => n.subject.toLowerCase() === subject.toLowerCase())
      }
      if (search) {
        const q = search.toLowerCase()
        items = items.filter(n =>
          n.title.toLowerCase().includes(q) ||
          n.subject.toLowerCase().includes(q) ||
          n.course_code.toLowerCase().includes(q) ||
          n.tags?.some(t => t.toLowerCase().includes(q))
        )
      }

      return items.map(item => ({
        ...item,
        profiles: db.getProfile(item.contributor_id)
      }))
    },

    async create(noteData) {
      await delay(140)
      const data = db.getData()
      const user = db.getCurrentUser()
      const newNote = {
        id: `not_${Date.now()}`,
        contributor_id: user.id,
        downloads: 0,
        rating: 5.0,
        created_at: new Date().toISOString(),
        ...noteData
      }
      data.notes.unshift(newNote)
      db.saveData(data)
      return { ...newNote, profiles: user }
    },

    async download(noteId) {
      await delay(50)
      const data = db.getData()
      const note = data.notes.find(n => n.id === noteId)
      if (note) {
        note.downloads = (note.downloads || 0) + 1
        db.saveData(data)
        return { downloads: note.downloads }
      }
      return { downloads: 0 }
    }
  },

  // ── Tutoring ─────────────────────────────────────────────────────────────
  tutors: {
    async getAll({ search = "", maxRate } = {}) {
      await delay(80)
      const data = db.getData()
      let items = [...data.tutors]

      if (maxRate) {
        items = items.filter(t => t.hourly_rate <= maxRate)
      }
      if (search) {
        const q = search.toLowerCase()
        items = items.filter(t => {
          const profile = db.getProfile(t.profile_id)
          const nameMatch = profile.full_name.toLowerCase().includes(q)
          const subjMatch = t.subjects.some(s => s.toLowerCase().includes(q))
          return nameMatch || subjMatch
        })
      }

      return items.map(item => ({
        ...item,
        profiles: db.getProfile(item.profile_id)
      }))
    },

    async bookSession({ tutorId, subject, date, time, notes }) {
      await delay(120)
      const data = db.getData()
      const user = db.getCurrentUser()
      const tutor = data.tutors.find(t => t.id === tutorId)
      if (!tutor) throw new Error("Tutor not found")

      const newBooking = {
        id: `bk_${Date.now()}`,
        tutor_id: tutorId,
        student_id: user.id,
        subject,
        date,
        time,
        notes: notes || "",
        status: "confirmed",
        created_at: new Date().toISOString()
      }
      data.bookings.unshift(newBooking)

      // Notify tutor
      data.notifications.unshift({
        id: `notif_${Date.now()}`,
        user_id: tutor.profile_id,
        type: "booking",
        title: "New Tutoring Booking",
        description: `${user.full_name} booked a session for ${subject} on ${date} at ${time}.`,
        link: "/tutoring",
        is_read: false,
        created_at: new Date().toISOString()
      })
      db.saveData(data)
      return newBooking
    }
  },

  // ── Roommates ────────────────────────────────────────────────────────────
  roommates: {
    async getAll({ search = "", type = "All", maxRent } = {}) {
      await delay(80)
      const data = db.getData()
      let items = [...data.roommates]

      if (type && type !== "All") {
        const t = type.toLowerCase()
        items = items.filter(r => r.listing_type === t || r.room_type === t)
      }
      if (maxRent) {
        items = items.filter(r => r.rent <= maxRent)
      }
      if (search) {
        const q = search.toLowerCase()
        items = items.filter(r =>
          r.title.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.amenities?.some(a => a.toLowerCase().includes(q))
        )
      }

      return items.map(item => ({
        ...item,
        profiles: db.getProfile(item.poster_id)
      }))
    },

    async create(roommateData) {
      await delay(150)
      const data = db.getData()
      const user = db.getCurrentUser()
      const newListing = {
        id: `rom_${Date.now()}`,
        poster_id: user.id,
        status: "active",
        created_at: new Date().toISOString(),
        ...roommateData
      }
      data.roommates.unshift(newListing)
      db.saveData(data)
      return { ...newListing, profiles: user }
    },

    async delete(id) {
      await delay(120)
      const data = db.getData()
      data.roommates = data.roommates.filter(r => r.id !== id)
      db.saveData(data)
      return { success: true }
    }
  },

  // ── Jobs ─────────────────────────────────────────────────────────────────
  jobs: {
    async getAll({ search = "", jobType = "All", isRemote = false } = {}) {
      await delay(80)
      const data = db.getData()
      let items = [...data.jobs]

      if (jobType && jobType !== "All") {
        items = items.filter(j => j.job_type === jobType)
      }
      if (isRemote) {
        items = items.filter(j => j.is_remote)
      }
      if (search) {
        const q = search.toLowerCase()
        items = items.filter(j =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.skills_required?.some(s => s.toLowerCase().includes(q))
        )
      }

      return items.map(item => ({
        ...item,
        profiles: db.getProfile(item.poster_id)
      }))
    },

    async create(jobData) {
      await delay(150)
      const data = db.getData()
      const user = db.getCurrentUser()
      const newJob = {
        id: `job_${Date.now()}`,
        poster_id: user.id,
        status: "active",
        applications_count: 0,
        created_at: new Date().toISOString(),
        ...jobData
      }
      data.jobs.unshift(newJob)
      db.saveData(data)
      return { ...newJob, profiles: user }
    },

    async apply(jobId, { pitch = "" } = {}) {
      await delay(130)
      const data = db.getData()
      const user = db.getCurrentUser()
      const job = data.jobs.find(j => j.id === jobId)
      if (!job) throw new Error("Job not found")

      const newApp = {
        id: `app_${Date.now()}`,
        job_id: jobId,
        user_id: user.id,
        resume_note: pitch,
        status: "pending",
        created_at: new Date().toISOString()
      }
      data.applications.unshift(newApp)
      job.applications_count = (job.applications_count || 0) + 1

      // Notify job poster
      data.notifications.unshift({
        id: `notif_${Date.now()}`,
        user_id: job.poster_id,
        type: "application",
        title: "New Job Applicant",
        description: `${user.full_name} submitted an application for "${job.title}".`,
        link: "/jobs",
        is_read: false,
        created_at: new Date().toISOString()
      })
      db.saveData(data)
      return newApp
    },

    async delete(id) {
      await delay(120)
      const data = db.getData()
      data.jobs = data.jobs.filter(j => j.id !== id)
      db.saveData(data)
      return { success: true }
    }
  },

  // ── Study Groups ─────────────────────────────────────────────────────────
  studyGroups: {
    async getAll({ search = "", campus = "All" } = {}) {
      await delay(80)
      const data = db.getData()
      let items = [...data.studyGroups]

      if (campus && campus !== "All") {
        items = items.filter(g => g.campus.toLowerCase().includes(campus.toLowerCase()))
      }
      if (search) {
        const q = search.toLowerCase()
        items = items.filter(g =>
          g.title.toLowerCase().includes(q) ||
          g.subject.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.tags?.some(t => t.toLowerCase().includes(q))
        )
      }

      return items.map(item => ({
        ...item,
        creator: db.getProfile(item.creator_id)
      }))
    },

    async create(groupData) {
      await delay(140)
      const data = db.getData()
      const user = db.getCurrentUser()
      const newGroup = {
        id: `grp_${Date.now()}`,
        creator_id: user.id,
        members_count: 1,
        created_at: new Date().toISOString(),
        ...groupData
      }
      data.studyGroups.unshift(newGroup)
      db.saveData(data)
      return { ...newGroup, creator: user }
    },

    async join(groupId) {
      await delay(90)
      const data = db.getData()
      const group = data.studyGroups.find(g => g.id === groupId)
      if (!group) throw new Error("Group not found")
      if (group.members_count < group.max_capacity) {
        group.members_count += 1
        db.saveData(data)
      }
      return { success: true, members_count: group.members_count }
    }
  },

  // ── Messages ─────────────────────────────────────────────────────────────
  messages: {
    async getConversations() {
      await delay(60)
      const data = db.getData()
      const user = db.getCurrentUser()
      const convos = data.conversations.filter(c => c.participant_ids.includes(user.id))

      return convos.map(c => {
        const otherId = c.participant_ids.find(id => id !== user.id) || user.id
        return {
          ...c,
          otherUser: db.getProfile(otherId)
        }
      })
    },

    async getMessages(conversationId) {
      await delay(50)
      const data = db.getData()
      return data.messages
        .filter(m => m.conversation_id === conversationId)
        .map(m => ({
          ...m,
          sender: db.getProfile(m.sender_id)
        }))
    },

    async sendMessage({ conversationId, recipientId, text }) {
      await delay(60)
      const data = db.getData()
      const user = db.getCurrentUser()

      let convoId = conversationId
      if (!convoId) {
        const newConvo = {
          id: `cnv_${Date.now()}`,
          participant_ids: [user.id, recipientId],
          listing_id: null,
          last_message: text,
          last_message_time: new Date().toISOString(),
          unread_count: 0
        }
        data.conversations.unshift(newConvo)
        convoId = newConvo.id
      } else {
        const c = data.conversations.find(x => x.id === convoId)
        if (c) {
          c.last_message = text
          c.last_message_time = new Date().toISOString()
        }
      }

      const newMsg = {
        id: `msg_${Date.now()}`,
        conversation_id: convoId,
        sender_id: user.id,
        text,
        created_at: new Date().toISOString()
      }
      data.messages.push(newMsg)
      db.saveData(data)
      return { ...newMsg, sender: user }
    }
  },

  // ── Notifications ────────────────────────────────────────────────────────
  notifications: {
    async getAll() {
      await delay(50)
      const data = db.getData()
      const user = db.getCurrentUser()
      return data.notifications.filter(n => n.user_id === user.id)
    },

    async getUnreadCount() {
      const data = db.getData()
      const user = db.getCurrentUser()
      return data.notifications.filter(n => n.user_id === user.id && !n.is_read).length
    },

    async markRead(id) {
      const data = db.getData()
      const n = data.notifications.find(x => x.id === id)
      if (n) n.is_read = true
      db.saveData(data)
      return { success: true }
    },

    async markAllRead() {
      const data = db.getData()
      const user = db.getCurrentUser()
      data.notifications.forEach(n => {
        if (n.user_id === user.id) n.is_read = true
      })
      db.saveData(data)
      return { success: true }
    }
  },

  // ── Dashboard Metrics ────────────────────────────────────────────────────
  dashboard: {
    async getMetrics() {
      await delay(90)
      const data = db.getData()
      const user = db.getCurrentUser()

      const myListings = data.listings.filter(l => l.seller_id === user.id)
      const myApplications = data.applications.filter(a => a.user_id === user.id)
      const myBookings = data.bookings.filter(b => b.student_id === user.id || b.tutor_id === user.id)
      const myRentals = data.rentals.filter(r => r.owner_id === user.id)
      const myFavorites = data.favorites.filter(f => f.user_id === user.id)

      return {
        totalListings: myListings.length,
        totalApplications: myApplications.length,
        totalBookings: myBookings.length,
        totalRentals: myRentals.length,
        totalFavorites: myFavorites.length,
        trustScore: user.trust_score || 98,
        activeTradesRevenue: myListings.reduce((sum, item) => sum + item.price, 0),
        recentActivity: [
          ...myApplications.map(a => {
            const job = data.jobs.find(j => j.id === a.job_id)
            return {
              id: a.id,
              type: "application",
              title: `Applied to ${job?.title || "Campus Job"}`,
              date: a.created_at,
              status: a.status
            }
          }),
          ...myBookings.map(b => ({
            id: b.id,
            type: "booking",
            title: `Tutoring session: ${b.subject}`,
            date: b.created_at,
            status: b.status
          }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date))
      }
    }
  },

  // ── Admin ────────────────────────────────────────────────────────────────
  admin: {
    async getStats() {
      await delay(80)
      const data = db.getData()
      return {
        totalUsers: data.profiles.length,
        totalListings: data.listings.length,
        totalJobs: data.jobs.length,
        totalNotes: data.notes.length,
        totalStudyGroups: data.studyGroups.length,
        pendingReports: data.reports.filter(r => r.status === "pending").length
      }
    },

    async getReports() {
      await delay(70)
      const data = db.getData()
      return data.reports.map(r => ({
        ...r,
        reporter: db.getProfile(r.reported_by)
      }))
    },

    async resolveReport(reportId, action = "dismiss") {
      await delay(80)
      const data = db.getData()
      const rep = data.reports.find(r => r.id === reportId)
      if (rep) {
        rep.status = action === "ban" ? "banned" : "resolved"
        db.saveData(data)
      }
      return { success: true }
    }
  }
}
