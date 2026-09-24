import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Upload, Loader2, X, AlertCircle, Sparkles, ArrowLeft, Package, Check, Tag } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { Select } from "../components/ui/Select"
import { Textarea } from "../components/ui/Textarea"
import { Card3D } from "../components/ui/Card3D"
import { Badge } from "../components/ui/Badge"
import { api } from "../services/api"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "../store/useAuthStore"

const CATEGORIES = ["Textbooks", "Electronics", "Furniture", "Clothing", "Other"]
const CONDITIONS = ["New", "Like New", "Good", "Fair", "Poor"]

export default function CreateListing() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  
  // Live Preview Form State
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Textbooks")
  const [condition, setCondition] = useState("Like New")
  const [description, setDescription] = useState("")

  const navigate = useNavigate()
  const { user } = useAuthStore()

  if (!user) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[60vh] py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Please log in to sell an item</h2>
        <Button onClick={() => navigate('/login')} variant="glow">Go to Login</Button>
      </div>
    )
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB")
        return
      }
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setError(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      let image_url = imagePreview || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"

      // Attempt Supabase storage upload if configured
      try {
        if (imageFile) {
          const fileExt = imageFile.name.split('.').pop()
          const fileName = `${Math.random()}.${fileExt}`
          const filePath = `${user.id}/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('marketplace')
            .upload(filePath, imageFile)

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('marketplace')
              .getPublicUrl(filePath)
            image_url = publicUrl
          }
        }
      } catch (uploadErr) {
        console.warn("Storage upload fallback:", uploadErr)
      }

      // Save via unified api service
      await api.marketplace.create({
        title,
        price: parseFloat(price),
        category,
        condition,
        description,
        image_url,
        location: "Campus Quad Pickup"
      })

      navigate('/marketplace')
    } catch (err) {
      console.error(err)
      setError(err.message || "An error occurred while creating the listing")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl relative">
      {/* Ambient Radial Backlights */}
      <div className="ambient-aurora w-[500px] h-[300px] bg-cyan-500/10 top-10 left-10 pointer-events-none" />
      <div className="ambient-aurora w-[600px] h-[350px] bg-purple-600/15 top-1/4 right-10 pointer-events-none" />

      <div className="mb-6 flex items-center justify-between relative z-10">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Marketplace
        </Link>
        <Badge variant="verified" size="xs">3D Listing Studio</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Form Container (7 cols) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-7 bg-[#0E1322]/90 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-6 sm:p-8"
        >
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Create 3D Listing</h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">
              List your textbooks, tech gadgets, or dorm supplies to the campus community.
            </p>
          </div>

          {error && (
            <div className="w-full mb-6 p-3.5 bg-red-500/10 text-red-400 text-xs sm:text-sm rounded-xl flex items-center gap-2.5 border border-red-500/20">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Image Upload Dropzone */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-white/80">Item Image</Label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null) }}
                      className="absolute top-1.5 right-1.5 bg-black/70 text-white rounded-full p-1 hover:bg-black transition-colors cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload"
                    className="w-28 h-28 rounded-2xl border-2 border-dashed border-white/15 hover:border-cyan-400/50 flex flex-col items-center justify-center text-muted-foreground bg-white/5 cursor-pointer transition-all hover:bg-white/10"
                  >
                    <Upload size={22} className="text-cyan-400 mb-1.5" />
                    <span className="text-[11px] font-medium">Upload</span>
                  </label>
                )}
                <div>
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl text-xs font-semibold px-4 py-2 border border-white/15 bg-white/5 hover:bg-white/10 text-white transition-all shadow-xs"
                  >
                    <Upload size={14} className="text-cyan-400" />
                    <span>Select Photo</span>
                  </label>
                  <input 
                    id="image-upload"
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <p className="text-[11px] text-muted-foreground mt-1.5">Max size 5MB (PNG, JPG, WebP)</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-semibold text-white/80">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Calculus Early Transcendentals"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-xs font-semibold text-white/80">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="45.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-xs font-semibold text-white/80">Category</Label>
                <Select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0B0F1C] text-white">{c}</option>)}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="condition" className="text-xs font-semibold text-white/80">Condition</Label>
                <Select
                  id="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                >
                  {CONDITIONS.map(c => <option key={c} value={c} className="bg-[#0B0F1C] text-white">{c}</option>)}
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold text-white/80">Description</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Details on edition, highlighting, condition, pickup location on campus..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-[#0B0F1C]/90 border-white/10"
              />
            </div>

            <Button
              type="submit"
              variant="glow"
              size="lg"
              className="w-full mt-2 font-bold shadow-[0_0_25px_rgba(0,240,255,0.4)]"
              loading={isLoading}
            >
              Publish Listing to Campus Matrix
            </Button>
          </form>
        </motion.div>

        {/* Live 3D Holographic Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Live 3D Holographic Preview</span>
          </div>

          <Card3D neonGlow="cyan" maxTilt={12} className="p-0 overflow-hidden">
            <div className="relative aspect-square bg-[#070A14] overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Live Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 bg-[#070A14]/70">
                  <Package size={52} strokeWidth={1.5} className="text-cyan-400/40" />
                  <span className="text-xs mt-2 text-white/40">Item image will render here</span>
                </div>
              )}
              <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-md border border-white/15 text-cyan-300">
                {condition}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-cyan-400 mb-1">{category}</div>
                <h3 className="font-bold text-lg text-white line-clamp-1 mb-1">{title || "Untitled Campus Listing"}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{description || "No description provided yet."}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Listing Price</span>
                  <span className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    ${price ? Number(price).toFixed(2) : "0.00"}
                  </span>
                </div>
                <Badge variant="verified" size="xs">
                  {user.user_metadata?.full_name || "Verified Student"}
                </Badge>
              </div>
            </div>
          </Card3D>
        </div>
      </div>
    </div>
  )
}
