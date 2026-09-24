import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Plus, Home, MapPin, DollarSign, Calendar,
  X, Loader2, AlertCircle, Wifi, Car, WashingMachine,
  Dog, Ban, Moon, Users, Building2, BedDouble, Eye,
  Phone, Check
} from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { Textarea } from "../components/ui/Textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "../store/useAuthStore"

const LISTING_TYPES = [
  { value: "all", label: "All Listings" },
  { value: "offering", label: "Has a Room" },
  { value: "looking", label: "Needs a Room" },
]

const ROOM_TYPES = [
  { value: "private", label: "Private Room", icon: BedDouble },
  { value: "shared", label: "Shared Room", icon: Users },
  { value: "studio", label: "Studio", icon: Building2 },
  { value: "apartment", label: "Apartment", icon: Building2 },
  { value: "house", label: "House", icon: Home },
]

const AMENITY_OPTIONS = ["WiFi", "Parking", "Laundry", "Gym", "Pool", "Furnished", "A/C", "Kitchen", "Study Room"]
const PREFERENCE_OPTIONS = ["Non-smoker", "Pet-friendly", "Quiet Hours", "No Parties", "LGBTQ+ Friendly", "Vegetarian Kitchen", "Early Bird", "Night Owl"]

const AMENITY_ICONS = {
  WiFi: Wifi, Parking: Car, Laundry: WashingMachine,
}
const PREFERENCE_ICONS = {
  "Non-smoker": Ban, "Pet-friendly": Dog, "Quiet Hours": Moon,
  "Night Owl": Moon, "Early Bird": Calendar,
}

const TYPE_BADGE = {
  offering: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  looking: "bg-blue-500/10 text-blue-600 border-blue-200",
}

export default function Roommates() {
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeType, setActiveType] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)
  const { user } = useAuthStore()

  useEffect(() => {
    fetchListings()
  }, [activeType, searchQuery])

  const fetchListings = async () => {
    setIsLoading(true)
    try {
      let query = supabase
        .from("roommates")
        .select("*, profiles(full_name, avatar_url, university, phone)")
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (activeType !== "all") {
        query = query.eq("listing_type", activeType)
      }
      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`)
      }

      const { data, error } = await query
      if (error && error.code !== "42P01") throw error
      setListings(data || [])
    } catch (err) {
      console.error("Error fetching roommate listings:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return `${Math.floor(days / 7)}w ago`
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric"
    })
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } }
  }
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/10 p-8 md:p-10 mb-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(160_60%_50%/0.12),transparent_60%)]" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-emerald-500/15 p-2.5 rounded-xl">
                <Home className="text-emerald-600" size={24} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Find Roommates</h1>
            </div>
            <p className="text-muted-foreground max-w-lg">
              Browse housing options, find compatible roommates, or list your open room for fellow students.
            </p>
          </div>
          <div className="flex w-full md:w-auto items-center gap-2">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search listings..."
                className="pl-9 bg-background/80 backdrop-blur-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {user && (
              <Button
                className="gap-2 shadow-md shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Post Listing</span>
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Listing Type Filters */}
      <div className="flex gap-2 mb-6">
        {LISTING_TYPES.map(type => (
          <Button
            key={type.value}
            variant={activeType === type.value ? "default" : "secondary"}
            onClick={() => setActiveType(type.value)}
            className="rounded-full px-5"
          >
            {type.label}
          </Button>
        ))}
      </div>

      {/* Listings Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="h-72 rounded-xl bg-muted animate-pulse border border-border" />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {listings.map(listing => (
            <motion.div key={listing.id} variants={item}>
              <Card className="h-full flex flex-col hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 group border-border/50 hover:border-emerald-500/20 cursor-pointer"
                onClick={() => setSelectedListing(listing)}
              >
                {/* Image Area */}
                {listing.image_urls && listing.image_urls.length > 0 ? (
                  <div className="relative h-40 overflow-hidden rounded-t-xl">
                    <img
                      src={listing.image_urls[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {listing.image_urls.length > 1 && (
                      <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                        +{listing.image_urls.length - 1} photos
                      </span>
                    )}
                    <span className={`absolute top-3 left-3 text-xs px-3 py-1 rounded-full font-semibold border backdrop-blur-sm ${TYPE_BADGE[listing.listing_type]}`}>
                      {listing.listing_type === "offering" ? "Room Available" : "Looking for Room"}
                    </span>
                  </div>
                ) : (
                  <div className="relative h-32 bg-gradient-to-br from-muted to-muted/50 rounded-t-xl flex items-center justify-center">
                    <Home size={40} className="text-muted-foreground/30" />
                    <span className={`absolute top-3 left-3 text-xs px-3 py-1 rounded-full font-semibold border ${TYPE_BADGE[listing.listing_type]}`}>
                      {listing.listing_type === "offering" ? "Room Available" : "Looking for Room"}
                    </span>
                  </div>
                )}

                <CardContent className="p-5 flex-1 flex flex-col">
                  <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {listing.title}
                  </CardTitle>

                  {/* Key Details */}
                  <div className="space-y-1.5 mb-3">
                    {listing.rent && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign size={14} className="text-emerald-500 shrink-0" />
                        <span className="font-bold text-lg text-emerald-600">
                          ${Number(listing.rent).toLocaleString()}
                        </span>
                        <span className="text-muted-foreground text-xs">/month</span>
                      </div>
                    )}
                    {listing.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin size={14} className="shrink-0" />
                        <span className="truncate">{listing.location}</span>
                      </div>
                    )}
                    {listing.move_in_date && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar size={14} className="shrink-0" />
                        <span>Move-in: {formatDate(listing.move_in_date)}</span>
                      </div>
                    )}
                    {listing.room_type && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BedDouble size={14} className="shrink-0" />
                        <span className="capitalize">{listing.room_type} room</span>
                        {listing.lease_duration && (
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full ml-auto">{listing.lease_duration}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Amenities */}
                  {listing.amenities && listing.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {listing.amenities.slice(0, 4).map(amenity => {
                        const AIcon = AMENITY_ICONS[amenity]
                        return (
                          <span key={amenity} className="bg-muted text-xs px-2 py-0.5 rounded-md text-muted-foreground font-medium flex items-center gap-1">
                            {AIcon && <AIcon size={10} />}
                            {amenity}
                          </span>
                        )
                      })}
                      {listing.amenities.length > 4 && (
                        <span className="text-xs text-muted-foreground">+{listing.amenities.length - 4}</span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/10 overflow-hidden flex items-center justify-center">
                        {listing.profiles?.avatar_url ? (
                          <img src={listing.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-emerald-600 text-xs font-bold">
                            {listing.profiles?.full_name?.charAt(0) || "?"}
                          </span>
                        )}
                      </div>
                      <div className="text-xs">
                        <div className="font-medium truncate max-w-[100px]">{listing.profiles?.full_name || "Anonymous"}</div>
                        <div className="text-muted-foreground">{timeAgo(listing.created_at)}</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs h-8 gap-1">
                      <Eye size={12} /> View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 bg-card rounded-2xl border border-dashed border-border"
        >
          <div className="bg-emerald-500/10 p-4 rounded-2xl inline-block mb-4">
            <Home className="text-emerald-600" size={36} />
          </div>
          <h3 className="text-xl font-semibold mb-2">No roommate listings yet</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            Post the first listing to help students find housing or roommates.
          </p>
          {user && (
            <Button onClick={() => setShowCreateModal(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus size={18} /> Post the First Listing
            </Button>
          )}
        </motion.div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedListing && (
          <ListingDetailModal listing={selectedListing} onClose={() => setSelectedListing(null)} />
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateRoommateModal
            onClose={() => setShowCreateModal(false)}
            onCreated={() => { setShowCreateModal(false); fetchListings(); }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Listing Detail Modal ────────────────────────────────────────────
function ListingDetailModal({ listing, onClose }) {
  const [copiedPhone, setCopiedPhone] = useState(false)
  const phone = listing.profiles?.phone

  const copyPhone = () => {
    if (phone) {
      navigator.clipboard.writeText(phone)
      setCopiedPhone(true)
      setTimeout(() => setCopiedPhone(false), 2500)
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Header */}
        {listing.image_urls && listing.image_urls.length > 0 && (
          <div className="relative h-48 rounded-t-2xl overflow-hidden">
            <img src={listing.image_urls[0]} alt={listing.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${TYPE_BADGE[listing.listing_type]}`}>
                {listing.listing_type === "offering" ? "Room Available" : "Looking for Room"}
              </span>
              <h2 className="text-2xl font-bold mt-3">{listing.title}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors shrink-0">
              <X size={20} />
            </button>
          </div>

          {listing.rent && (
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold text-emerald-600">${Number(listing.rent).toLocaleString()}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          )}

          <p className="text-muted-foreground mb-6 leading-relaxed">{listing.description}</p>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {listing.location && (
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><MapPin size={12} /> Location</div>
                <div className="text-sm font-medium">{listing.location}</div>
              </div>
            )}
            {listing.room_type && (
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><BedDouble size={12} /> Room Type</div>
                <div className="text-sm font-medium capitalize">{listing.room_type}</div>
              </div>
            )}
            {listing.move_in_date && (
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Calendar size={12} /> Move-in</div>
                <div className="text-sm font-medium">{new Date(listing.move_in_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
              </div>
            )}
            {listing.lease_duration && (
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Lease</div>
                <div className="text-sm font-medium">{listing.lease_duration}</div>
              </div>
            )}
          </div>

          {/* Amenities */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div className="mb-5">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map(a => (
                  <span key={a} className="bg-emerald-500/10 text-emerald-700 text-xs px-3 py-1.5 rounded-full font-medium">{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Preferences */}
          {listing.preferences && listing.preferences.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Preferences</h4>
              <div className="flex flex-wrap gap-2">
                {listing.preferences.map(p => (
                  <span key={p} className="bg-blue-500/10 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium">{p}</span>
                ))}
              </div>
            </div>
          )}

          {/* Poster Info */}
          <div className="border-t border-border pt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 overflow-hidden flex items-center justify-center">
                {listing.profiles?.avatar_url ? (
                  <img src={listing.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-emerald-600 font-bold">{listing.profiles?.full_name?.charAt(0) || "?"}</span>
                )}
              </div>
              <div>
                <div className="font-medium">{listing.profiles?.full_name || "Anonymous"}</div>
                <div className="text-xs text-muted-foreground">{listing.profiles?.university || "Campus Student"}</div>
              </div>
            </div>
            {phone ? (
              <Button
                onClick={copyPhone}
                className={copiedPhone ? "bg-muted text-foreground border border-border" : "bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs"}
              >
                {copiedPhone ? (
                  <>
                    <Check size={14} className="text-emerald-500 mr-1" /> Copied!
                  </>
                ) : (
                  <>
                    <Phone size={14} className="mr-1" /> Contact: {phone}
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="outline"
                className="text-xs"
                onClick={() => alert(`Connect with ${listing.profiles?.full_name || "the poster"} via university channels.`)}
              >
                Contact Poster
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Create Roommate Listing Modal ───────────────────────────────────
function CreateRoommateModal({ onClose, onCreated }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [selectedPrefs, setSelectedPrefs] = useState([])
  const { user } = useAuthStore()

  const toggleAmenity = (a) => setSelectedAmenities(prev =>
    prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
  )
  const togglePref = (p) => setSelectedPrefs(prev =>
    prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const fd = new FormData(e.target)

    try {
      const { error: insertError } = await supabase.from("roommates").insert({
        poster_id: user.id,
        title: fd.get("title"),
        description: fd.get("description"),
        listing_type: fd.get("listing_type"),
        rent: fd.get("rent") ? parseFloat(fd.get("rent")) : null,
        location: fd.get("location") || null,
        move_in_date: fd.get("move_in_date") || null,
        lease_duration: fd.get("lease_duration") || null,
        room_type: fd.get("room_type") || null,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : null,
        preferences: selectedPrefs.length > 0 ? selectedPrefs : null,
        status: "active",
      })

      if (insertError) throw insertError
      onCreated()
    } catch (err) {
      console.error(err)
      setError(err.message || "Failed to create listing")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-bold">Post a Roommate Listing</h2>
            <p className="text-sm text-muted-foreground">Find a roommate or list your open room</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="listing_type">Are you offering or looking? *</Label>
            <div className="grid grid-cols-2 gap-3">
              <label className="cursor-pointer">
                <input type="radio" name="listing_type" value="offering" className="peer hidden" defaultChecked />
                <div className="peer-checked:border-emerald-500 peer-checked:bg-emerald-500/10 border-2 border-border rounded-xl p-4 text-center transition-all hover:border-emerald-300">
                  <Home size={24} className="mx-auto mb-2 text-emerald-600" />
                  <div className="font-semibold text-sm">I Have a Room</div>
                  <div className="text-xs text-muted-foreground">Offering a room/space</div>
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="listing_type" value="looking" className="peer hidden" />
                <div className="peer-checked:border-blue-500 peer-checked:bg-blue-500/10 border-2 border-border rounded-xl p-4 text-center transition-all hover:border-blue-300">
                  <Search size={24} className="mx-auto mb-2 text-blue-600" />
                  <div className="font-semibold text-sm">Need a Room</div>
                  <div className="text-xs text-muted-foreground">Looking for housing</div>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" name="title" placeholder="e.g. Sunny room 5 min from campus" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label htmlFor="rent">Monthly Rent ($)</Label>
              <Input id="rent" name="rent" type="number" min="0" step="1" placeholder="650" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="e.g. Near Main Gate" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room_type">Room Type</Label>
              <select
                id="room_type"
                name="room_type"
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <option value="">Select</option>
                {ROOM_TYPES.map(rt => (
                  <option key={rt.value} value={rt.value}>{rt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="move_in_date">Available From</Label>
              <Input id="move_in_date" name="move_in_date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lease_duration">Lease Duration</Label>
              <Input id="lease_duration" name="lease_duration" placeholder="e.g. 6 months, 1 year" />
            </div>
          </div>

          {/* Amenities Checkboxes */}
          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-all ${
                    selectedAmenities.includes(a)
                      ? "bg-emerald-500/15 text-emerald-700 border-emerald-300"
                      : "bg-muted text-muted-foreground border-transparent hover:border-border"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-2">
            <Label>Roommate Preferences</Label>
            <div className="flex flex-wrap gap-2">
              {PREFERENCE_OPTIONS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePref(p)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-all ${
                    selectedPrefs.includes(p)
                      ? "bg-blue-500/15 text-blue-700 border-blue-300"
                      : "bg-muted text-muted-foreground border-transparent hover:border-border"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the space, neighborhood, house rules, what you're looking for in a roommate..."
              required
              rows={4}
            />
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-border">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[140px] bg-emerald-600 hover:bg-emerald-700 text-white">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Post Listing"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
