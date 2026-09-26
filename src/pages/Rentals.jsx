import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Calendar, Clock, DollarSign, ShieldCheck,
  Plus, Check, Sparkles, Filter, ChevronRight, X, AlertCircle, Eye, ArrowRight
} from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { Card3D } from "../components/ui/Card3D"
import { Badge, VerifiedBadge } from "../components/ui/Badge"
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from "../components/ui/Modal"
import { api } from "../services/api"
import { useAuthStore } from "../store/useAuthStore"
import { handleImageError } from "../lib/utils"

const RENTAL_CATEGORIES = ["All", "Audio / Video", "Entertainment", "Gaming", "Outdoor", "Academics", "Apparel"]

export default function Rentals() {
  const [rentals, setRentals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  
  // Selected rental for modal
  const [selectedRental, setSelectedRental] = useState(null)
  const [rentalDays, setRentalDays] = useState(2)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Create rental modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newDailyRate, setNewDailyRate] = useState("")
  const [newWeeklyRate, setNewWeeklyRate] = useState("")
  const [newDeposit, setNewDeposit] = useState("")
  const [newCategory, setNewCategory] = useState("Audio / Video")
  const [newDescription, setNewDescription] = useState("")
  const [newLocation, setNewLocation] = useState("")

  const { user } = useAuthStore()

  useEffect(() => {
    fetchRentals()
  }, [activeCategory])

  const fetchRentals = async () => {
    setIsLoading(true)
    try {
      const data = await api.rentals.getAll({
        search: searchQuery,
        category: activeCategory
      })
      setRentals(data)
    } catch (err) {
      console.error("Error fetching rentals:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchRentals()
  }

  const handleBookRental = async () => {
    if (!selectedRental) return
    setIsSubmitting(true)
    try {
      await api.rentals.requestRental({
        rentalId: selectedRental.id,
        days: rentalDays,
        startDate: new Date().toISOString().split("T")[0]
      })
      setBookingSuccess(true)
      setTimeout(() => {
        setBookingSuccess(false)
        setSelectedRental(null)
      }, 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateRental = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await api.rentals.create({
        title: newTitle,
        daily_rate: parseFloat(newDailyRate),
        weekly_rate: parseFloat(newWeeklyRate || newDailyRate * 4),
        deposit: parseFloat(newDeposit || 0),
        category: newCategory,
        description: newDescription,
        location: newLocation || "Main Campus Quad",
        image_url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80"
      })
      setShowCreateModal(false)
      fetchRentals()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

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
      {/* Ambient Auroras */}
      <div className="ambient-aurora w-[500px] h-[300px] bg-cyan-500/10 top-10 left-10 pointer-events-none" />
      <div className="ambient-aurora w-[600px] h-[350px] bg-pink-600/15 top-1/3 right-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="verified" size="xs" className="border-cyan-400/30 text-cyan-300">
              Campus Gear Rentals 3D
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">• Short-Term Student Equipment</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Campus Rentals</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Rent cameras, projectors, gaming consoles, and scientific calculators from verified campus peers without buying.
          </p>
        </div>

        <div className="flex w-full md:w-auto items-center gap-2.5">
          <form onSubmit={handleSearch} className="relative w-full md:w-72">
            <Input
              placeholder="Search gear, gadgets..."
              leftIcon={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0B0F1C]/90 border-white/10 focus-visible:border-cyan-400"
            />
          </form>

          {user && (
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="glow"
              className="shrink-0 gap-1.5 shadow-[0_0_20px_rgba(0,240,255,0.35)]"
            >
              <Plus size={16} />
              <span>List Gear</span>
            </Button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide mb-8 relative z-10 py-1">
        {RENTAL_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === cat
                ? "bg-gradient-to-r from-cyan-500 to-primary text-white shadow-[0_0_18px_rgba(0,240,255,0.4)] scale-105 border border-cyan-400/40"
                : "bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="h-80 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
          ))}
        </div>
      ) : rentals.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
        >
          {rentals.map(itemData => (
            <motion.div key={itemData.id} variants={item} className="h-full">
              <Card3D
                neonGlow="cyan"
                maxTilt={9}
                className="h-full p-0 overflow-hidden flex flex-col justify-between group cursor-pointer"
                onClick={() => setSelectedRental(itemData)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-[#070A14]">
                  <img
                    src={itemData.image_url}
                    alt={itemData.title}
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 text-[11px] px-3 py-1 rounded-full font-bold bg-black/75 backdrop-blur-md border border-white/15 text-cyan-300">
                    {itemData.category}
                  </span>

                  {/* Daily Rate Pill */}
                  <div className="absolute bottom-3 left-3 bg-[#0B0F1C]/90 backdrop-blur-md border border-cyan-400/30 px-3 py-1 rounded-xl flex items-baseline gap-1 shadow-lg">
                    <span className="text-xl font-black text-white">${itemData.daily_rate}</span>
                    <span className="text-[11px] text-muted-foreground font-semibold">/ day</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-1.5">
                      {itemData.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                      {itemData.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 mb-4">
                      <div>
                        <span className="text-[10px] text-muted-foreground block font-medium">Weekly Rate</span>
                        <span className="font-bold text-white">${itemData.weekly_rate}/wk</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block font-medium">Refundable Deposit</span>
                        <span className="font-bold text-emerald-400">${itemData.deposit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-3.5 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        {itemData.profiles?.full_name?.charAt(0) || "U"}
                      </div>
                      <span className="text-xs text-muted-foreground font-semibold truncate max-w-[120px]">
                        {itemData.profiles?.full_name || "Campus Peer"}
                      </span>
                    </div>

                    <Button
                      size="xs"
                      variant="glow"
                      className="gap-1 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedRental(itemData)
                      }}
                    >
                      <span>Rent Now</span>
                      <ArrowRight size={12} />
                    </Button>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-white/15 bg-white/5 backdrop-blur-xl flex flex-col items-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-400/30">
            <Clock size={30} />
          </div>
          <h3 className="text-xl font-bold mb-1.5 text-white">No rental gear listed in this category</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
            Have high-end electronics, calculators, or event gear? List them to earn rental cash from classmates.
          </p>
          {user && (
            <Button onClick={() => setShowCreateModal(true)} variant="glow" className="gap-2">
              <Plus size={16} />
              <span>List Your First Rental Item</span>
            </Button>
          )}
        </div>
      )}

      {/* Rental Booking Modal */}
      <Modal isOpen={!!selectedRental} onClose={() => setSelectedRental(null)} size="md">
        {selectedRental && (
          <div>
            <ModalHeader>
              <ModalTitle className="text-white flex items-center gap-2">
                <Sparkles size={18} className="text-cyan-400" /> Rent Equipment
              </ModalTitle>
            </ModalHeader>
            <ModalContent className="space-y-4">
              <div className="flex gap-4 items-center p-3 rounded-2xl bg-[#070A14] border border-white/10">
                <img
                  src={selectedRental.image_url}
                  alt={selectedRental.title}
                  onError={handleImageError}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-white text-sm line-clamp-1">{selectedRental.title}</h4>
                  <p className="text-xs text-cyan-300 font-semibold mt-0.5">${selectedRental.daily_rate} / day</p>
                  <p className="text-[11px] text-muted-foreground">Owner: {selectedRental.profiles?.full_name}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white/80">Rental Duration:</span>
                  <span className="text-cyan-400 font-bold">{rentalDays} {rentalDays === 1 ? 'day' : 'days'}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="14"
                  value={rentalDays}
                  onChange={(e) => setRentalDays(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Price Calculation */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Rate (${selectedRental.daily_rate} × {rentalDays} days)</span>
                  <span className="text-white font-semibold">${selectedRental.daily_rate * rentalDays}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Refundable Escrow Deposit</span>
                  <span className="text-white font-semibold">${selectedRental.deposit}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm">
                  <span className="text-white">Total Amount Due</span>
                  <span className="text-cyan-300">${selectedRental.daily_rate * rentalDays + selectedRental.deposit}</span>
                </div>
              </div>

              {bookingSuccess && (
                <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                  <Check size={16} /> Rental request sent! The owner has been notified.
                </div>
              )}
            </ModalContent>
            <ModalFooter>
              <Button variant="outline" onClick={() => setSelectedRental(null)}>
                Cancel
              </Button>
              <Button
                variant="glow"
                onClick={handleBookRental}
                loading={isSubmitting}
                disabled={bookingSuccess}
              >
                Confirm Rental Request
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>

      {/* Create Rental Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} size="lg">
        <div>
          <ModalHeader>
            <ModalTitle className="text-white flex items-center gap-2">
              <Plus size={18} className="text-cyan-400" /> List Gear for Rent
            </ModalTitle>
          </ModalHeader>
          <form onSubmit={handleCreateRental}>
            <ModalContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-white/80">Item Title</Label>
                <Input
                  required
                  placeholder="e.g. Sony Alpha a6400 Camera Kit"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-[#0B0F1C]/90 border-white/10"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-white/80">Daily Rate ($)</Label>
                  <Input
                    required
                    type="number"
                    min="1"
                    placeholder="15"
                    value={newDailyRate}
                    onChange={(e) => setNewDailyRate(e.target.value)}
                    className="bg-[#0B0F1C]/90 border-white/10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-white/80">Weekly Rate ($)</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="65"
                    value={newWeeklyRate}
                    onChange={(e) => setNewWeeklyRate(e.target.value)}
                    className="bg-[#0B0F1C]/90 border-white/10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-white/80">Deposit ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="50"
                    value={newDeposit}
                    onChange={(e) => setNewDeposit(e.target.value)}
                    className="bg-[#0B0F1C]/90 border-white/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-white/80">Category</Label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#0B0F1C] border border-white/10 text-white text-xs"
                  >
                    {RENTAL_CATEGORIES.filter(c => c !== "All").map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-white/80">Pickup Location</Label>
                  <Input
                    placeholder="e.g. North Campus Library"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="bg-[#0B0F1C]/90 border-white/10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-white/80">Description & Included Accessories</Label>
                <textarea
                  rows={3}
                  required
                  placeholder="Included lenses, charger, memory cards, condition details..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#0B0F1C] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </ModalContent>
            <ModalFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="glow" loading={isSubmitting}>
                Publish Rental Item
              </Button>
            </ModalFooter>
          </form>
        </div>
      </Modal>
    </div>
  )
}
