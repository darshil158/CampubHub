import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Plus, Tag, Sparkles, ShieldCheck, ArrowRight, Package } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardContent, CardFooter } from "../components/ui/Card"
import { Badge, VerifiedBadge } from "../components/ui/Badge"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "../store/useAuthStore"
import { Link } from "react-router-dom"

const CATEGORIES = ["All", "Textbooks", "Electronics", "Furniture", "Clothing", "Other"]

export default function Marketplace() {
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const { user } = useAuthStore()

  useEffect(() => {
    fetchListings()
  }, [activeCategory, searchQuery])

  const fetchListings = async () => {
    setIsLoading(true)
    try {
      let query = supabase
        .from('listings')
        .select(`*, profiles(full_name, avatar_url)`)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (activeCategory !== "All") {
        query = query.eq('category', activeCategory)
      }
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`)
      }

      const { data, error } = await query
      
      if (error) {
        if (error.code === '42P01') {
          console.log("Listings table not created yet.")
        } else {
          throw error
        }
      } else {
        setListings(data || [])
      }
    } catch (error) {
      console.error("Error fetching listings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="verified" size="xs">Quadly Trade</Badge>
            <span className="text-xs text-muted-foreground font-medium">• Verified Campus Exchange</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Campus Marketplace</h1>
          <p className="text-muted-foreground text-sm mt-1">Buy, sell, and rent textbooks, gear, and dorm essentials with fellow students.</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-2.5">
          <div className="relative w-full md:w-72">
            <Input 
              placeholder="Search items, textbooks..." 
              leftIcon={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {user && (
            <Button asChild variant="glow" className="shrink-0 gap-1.5">
              <Link to="/marketplace/create">
                <Plus size={18} />
                <span className="hidden sm:inline">Sell Item</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex overflow-x-auto pb-4 mb-6 gap-2 scrollbar-hide">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activeCategory === category
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25 scale-102'
                : 'bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/70'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="h-[320px] rounded-2xl bg-muted/50 animate-pulse border border-border/60"></div>
          ))}
        </div>
      ) : listings.length > 0 ? (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {listings.map(listing => (
            <motion.div key={listing.id} variants={item}>
              <Card interactive={true} className="h-full flex flex-col overflow-hidden group">
                <div className="relative aspect-square bg-muted/30 overflow-hidden">
                  {listing.image_url ? (
                    <img 
                      src={listing.image_url} 
                      alt={listing.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/40 bg-muted/20">
                      <Package size={40} strokeWidth={1.5} />
                      <span className="text-xs mt-1 font-medium">Campus item</span>
                    </div>
                  )}
                  {listing.condition && (
                    <div className="absolute top-2.5 right-2.5 bg-background/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-2xs border border-border/60">
                      {listing.condition}
                    </div>
                  )}
                </div>
                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1">{listing.category}</div>
                    <h3 className="font-bold text-base line-clamp-1 mb-1.5 text-foreground group-hover:text-primary transition-colors">{listing.title}</h3>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <p className="text-xl font-black text-foreground">${Number(listing.price).toFixed(2)}</p>
                    <span className="text-[11px] text-muted-foreground font-medium">Local pickup</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 text-xs text-muted-foreground border-t border-border/50 mt-auto">
                  <div className="flex items-center gap-2 pt-3 w-full">
                    <div className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center overflow-hidden font-bold text-[10px]">
                      {listing.profiles?.avatar_url ? (
                        <img src={listing.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        listing.profiles?.full_name?.charAt(0) || 'U'
                      )}
                    </div>
                    <span className="truncate font-medium text-foreground/80">{listing.profiles?.full_name || 'Verified Student'}</span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-border/80 bg-card/30 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Search size={28} />
          </div>
          <h3 className="text-xl font-bold mb-1.5">No listings found</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
            We couldn't find items matching "{searchQuery || activeCategory}". Be the first on your campus to post an item!
          </p>
          {user ? (
            <Button asChild variant="glow">
              <Link to="/marketplace/create" className="gap-2">
                <Plus size={16} />
                <span>Create First Listing</span>
              </Link>
            </Button>
          ) : (
            <Button asChild variant="default">
              <Link to="/signup">Join to List Items</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
