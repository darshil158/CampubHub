import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Filter, Plus, Tag, Sparkles, ShieldCheck, ArrowRight,
  Package, Flame, Clock, Heart, Eye, MessageSquare, MapPin, X
} from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card3D } from "../components/ui/Card3D"
import { Badge, VerifiedBadge } from "../components/ui/Badge"
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from "../components/ui/Modal"
import { api } from "../services/api"
import { useAuthStore } from "../store/useAuthStore"
import { Link, useNavigate } from "react-router-dom"
import { handleImageError, FALLBACK_AVATAR_DATA_URI } from "../lib/utils"

const CATEGORIES = ["All", "Textbooks", "Electronics", "Furniture", "Other"]

export default function Marketplace() {
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedListing, setSelectedListing] = useState(null)
  const [favoritedIds, setFavoritedIds] = useState(new Set())

  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchListings()
  }, [activeCategory, sortBy])

  const fetchListings = async () => {
    setIsLoading(true)
    try {
      const data = await api.marketplace.getAll({
        category: activeCategory,
        search: searchQuery,
        sortBy
      })
      setListings(data)
    } catch (error) {
      console.error("Error fetching listings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchListings()
  }

  const handleToggleFavorite = async (e, listingId) => {
    e.stopPropagation()
    try {
      const res = await api.marketplace.toggleFavorite(listingId)
      setFavoritedIds(prev => {
        const next = new Set(prev)
        if (res.isFavorite) next.add(listingId)
        else next.delete(listingId)
        return next
      })
      setListings(prev =>
        prev.map(l => l.id === listingId ? { ...l, favorites: (l.favorites || 0) + (res.isFavorite ? 1 : -1) } : l)
      )
    } catch (err) {
      console.error(err)
    }
  }

  const handleContactSeller = (listing) => {
    setSelectedListing(null)
    navigate("/messages")
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } }
  }

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl relative">
      {/* Ambient Radial Backlights */}
      <div className="ambient-aurora w-[500px] h-[300px] bg-cyan-500/10 top-10 left-10 pointer-events-none" />
      <div className="ambient-aurora w-[600px] h-[350px] bg-purple-600/15 top-1/3 right-10 pointer-events-none" />

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="verified" size="xs" className="border-cyan-400/30 text-cyan-300">
              3D Marketplace
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">• Verified Student Trading</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Campus Marketplace</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Buy, sell, and trade textbooks, electronics, and dorm equipment with verified peers and zero seller fees.
          </p>
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-2.5">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
            <Input 
              placeholder="Search gear, textbooks..." 
              leftIcon={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0B0F1C]/90 border-white/10 focus-visible:border-cyan-400"
            />
          </form>

          {user && (
            <Button asChild variant="glow" className="shrink-0 gap-1.5 shadow-[0_0_20px_rgba(0,240,255,0.35)]">
              <Link to="/marketplace/create">
                <Plus size={18} />
                <span className="hidden sm:inline">Sell Item</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Filter & Sort Controls Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 relative z-10">
        {/* Holographic Category Navigation Pills */}
        <div className="flex overflow-x-auto gap-2 scrollbar-hide py-1 w-full sm:w-auto">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeCategory === category
                  ? "bg-gradient-to-r from-cyan-500 to-primary text-white shadow-[0_0_18px_rgba(0,240,255,0.4)] scale-102 border border-cyan-400/50"
                  : "bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground font-semibold">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-bold bg-[#0B0F1C] border border-white/15 text-white px-3 py-1.5 rounded-xl cursor-pointer focus:outline-none focus:border-cyan-400"
          >
            <option value="newest">Newest Listed</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* 3D Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="h-[360px] rounded-2xl bg-white/5 animate-pulse border border-white/10" />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10"
        >
          {listings.map(listing => {
            const isFav = favoritedIds.has(listing.id)
            return (
              <motion.div key={listing.id} variants={item} className="h-full">
                <Card3D
                  neonGlow="cyan"
                  maxTilt={10}
                  className="p-0 overflow-hidden flex flex-col justify-between group cursor-pointer"
                  onClick={() => setSelectedListing(listing)}
                >
                  {/* Image Section */}
                  <div className="relative aspect-square bg-[#070A14] overflow-hidden">
                    {listing.image_url ? (
                      <img 
                        src={listing.image_url} 
                        alt={listing.title}
                        onError={handleImageError}
                        className="object-cover w-full h-full group-hover:scale-108 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 bg-[#070A14]/70">
                        <Package size={44} strokeWidth={1.5} className="text-cyan-400/40" />
                        <span className="text-xs mt-1.5 font-medium text-white/50">Campus item</span>
                      </div>
                    )}

                    {/* Condition Pill */}
                    {listing.condition && (
                      <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-md border border-white/15 text-cyan-300">
                        {listing.condition}
                      </div>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => handleToggleFavorite(e, listing.id)}
                      className={`absolute top-2.5 left-2.5 p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                        isFav
                          ? "bg-red-500/20 border-red-500 text-red-400"
                          : "bg-black/60 border-white/15 text-white/70 hover:text-white"
                      }`}
                      title="Save item"
                    >
                      <Heart size={14} className={isFav ? "fill-current" : ""} />
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-cyan-400 mb-1">{listing.category}</div>
                      <h3 className="font-bold text-base line-clamp-1 mb-1.5 text-foreground group-hover:text-cyan-300 transition-colors">
                        {listing.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {listing.description}
                      </p>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-white/5">
                      <p className="text-xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                        ${Number(listing.price).toFixed(2)}
                      </p>
                      <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[110px]">
                        {listing.location || "Campus pickup"}
                      </span>
                    </div>
                  </div>

                  {/* Footer Section */}
                  <div className="p-4 pt-0 text-xs text-muted-foreground border-t border-white/10 mt-auto">
                    <div className="flex items-center justify-between pt-3 w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 text-white flex items-center justify-center overflow-hidden font-bold text-[10px] shadow-xs">
                          {listing.profiles?.avatar_url ? (
                            <img 
                              src={listing.profiles.avatar_url} 
                              alt="" 
                              onError={(e) => handleImageError(e, FALLBACK_AVATAR_DATA_URI)}
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            listing.profiles?.full_name?.charAt(0) || "U"
                          )}
                        </div>
                        <span className="truncate font-medium text-foreground/80 max-w-[120px]">
                          {listing.profiles?.full_name || "Verified Student"}
                        </span>
                      </div>

                      <span className="text-[10px] text-muted-foreground">
                        {listing.views || 10} views
                      </span>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            )
          })}
        </motion.div>
      ) : (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-white/15 bg-white/5 backdrop-blur-xl flex flex-col items-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-400/30 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <Search size={30} />
          </div>
          <h3 className="text-xl font-bold mb-1.5 text-white">No listings found</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
            No items matching "{searchQuery || activeCategory}" yet. Be the first on your campus to post an item!
          </p>
          {user ? (
            <Button asChild variant="glow">
              <Link to="/marketplace/create" className="gap-2">
                <Plus size={16} />
                <span>Create 3D Listing</span>
              </Link>
            </Button>
          ) : (
            <Button asChild variant="glow">
              <Link to="/signup">Join to List Items</Link>
            </Button>
          )}
        </div>
      )}

      {/* Item Quick View 3D Modal */}
      <Modal isOpen={!!selectedListing} onClose={() => setSelectedListing(null)} size="lg">
        {selectedListing && (
          <div>
            <ModalHeader>
              <ModalTitle className="text-white flex items-center gap-2">
                <Sparkles size={18} className="text-cyan-400" /> Item Details
              </ModalTitle>
            </ModalHeader>
            <ModalContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#070A14] border border-white/10">
                  <img
                    src={selectedListing.image_url}
                    alt={selectedListing.title}
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 right-2.5 bg-black/80 px-2.5 py-0.5 rounded-full text-xs font-bold text-cyan-300 border border-white/15">
                    {selectedListing.condition}
                  </span>
                </div>

                <div className="space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{selectedListing.category}</span>
                    <h3 className="text-xl font-bold text-white mt-1">{selectedListing.title}</h3>
                    <div className="text-2xl font-black text-white mt-2">
                      ${Number(selectedListing.price).toFixed(2)}
                    </div>

                    <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                      {selectedListing.description}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin size={14} className="text-cyan-400" />
                      <span>{selectedListing.location || "Campus Quad pickup"}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
                        {selectedListing.profiles?.full_name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{selectedListing.profiles?.full_name}</div>
                        <div className="text-[10px] text-muted-foreground">{selectedListing.profiles?.university}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ModalContent>
            <ModalFooter>
              <Button variant="outline" onClick={() => setSelectedListing(null)}>
                Close
              </Button>
              <Button
                variant="glow"
                onClick={() => handleContactSeller(selectedListing)}
                className="gap-2"
              >
                <MessageSquare size={16} />
                <span>Message Seller</span>
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>
    </div>
  )
}
