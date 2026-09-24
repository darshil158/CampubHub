import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Plus, Tag } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardContent, CardFooter } from "../components/ui/Card"
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
      
      // If table doesn't exist yet, Supabase might throw an error. We handle it silently for now.
      if (error) {
        if (error.code === '42P01') {
          // Table doesn't exist error code in Postgres
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
      transition: { staggerChildren: 0.1 }
    }
  }
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campus Marketplace</h1>
          <p className="text-muted-foreground mt-1">Buy, sell, and rent items within your college community.</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search items..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter size={18} />
          </Button>
          {user && (
            <Button asChild className="gap-2 shadow-sm">
              <Link to="/marketplace/create">
                <Plus size={18} />
                <span className="hidden sm:inline">Sell Item</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto pb-4 mb-6 gap-2 scrollbar-hide">
        {CATEGORIES.map(category => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "secondary"}
            className="rounded-full px-6"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="h-[300px] rounded-xl bg-muted animate-pulse border border-border"></div>
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
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow group cursor-pointer border-border/50">
                <div className="relative aspect-square bg-muted overflow-hidden">
                  {listing.image_url ? (
                    <img 
                      src={listing.image_url} 
                      alt={listing.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Tag size={48} opacity={0.2} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
                    {listing.condition}
                  </div>
                </div>
                <CardContent className="p-4 flex-1">
                  <div className="text-xs font-medium text-primary mb-1">{listing.category}</div>
                  <h3 className="font-semibold text-lg line-clamp-1 mb-1">{listing.title}</h3>
                  <p className="text-xl font-bold">${Number(listing.price).toFixed(2)}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 text-xs text-muted-foreground border-t mt-auto">
                  <div className="flex items-center gap-2 pt-3 w-full">
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                      {listing.profiles?.avatar_url ? (
                        <img src={listing.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/20" />
                      )}
                    </div>
                    <span className="truncate">{listing.profiles?.full_name || 'Anonymous User'}</span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-24 flex flex-col items-center">
          <div className="bg-muted p-4 rounded-full mb-4">
            <Search className="text-muted-foreground" size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2">No items found</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            We couldn't find any listings matching your current filters. Try adjusting your search or category.
          </p>
          {user && (
            <Button asChild>
              <Link to="/marketplace/create">Be the first to list an item</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
