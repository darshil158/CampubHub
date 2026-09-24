import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Upload, Loader2, X, AlertCircle } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { Textarea } from "../components/ui/Textarea"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "../store/useAuthStore"

const CATEGORIES = ["Textbooks", "Electronics", "Furniture", "Clothing", "Other"]
const CONDITIONS = ["New", "Like New", "Good", "Fair", "Poor"]

export default function CreateListing() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const navigate = useNavigate()
  const { user } = useAuthStore()

  // If we arrived here but are not logged in, show auth wall
  if (!user) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[60vh] py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Please log in to sell an item</h2>
        <Button onClick={() => navigate('/login')}>Go to Login</Button>
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

    const formData = new FormData(e.target)
    const title = formData.get('title')
    const price = formData.get('price')
    const category = formData.get('category')
    const condition = formData.get('condition')
    const description = formData.get('description')

    try {
      let image_url = null

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('marketplace')
          .upload(filePath, imageFile)

        if (uploadError) {
          // If the bucket isn't set up yet, fallback gracefully instead of completely breaking
          console.error(uploadError)
          if (uploadError.statusCode === "404") {
             setError("Storage bucket 'marketplace' not found. Please create it in Supabase.")
             setIsLoading(false)
             return
          }
          throw uploadError
        }

        const { data: { publicUrl } } = supabase.storage
          .from('marketplace')
          .getPublicUrl(filePath)
          
        image_url = publicUrl
      }

      const { error: insertError } = await supabase
        .from('listings')
        .insert({
          seller_id: user.id,
          title,
          price: parseFloat(price),
          category,
          condition,
          description,
          image_url,
          status: 'active'
        })

      if (insertError) throw insertError

      navigate('/marketplace')
    } catch (err) {
      console.error(err)
      setError(err.message || "An error occurred while creating the listing")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border shadow-sm rounded-2xl p-6 md:p-10"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Post a Listing</h1>
          <p className="text-muted-foreground mt-2">Fill out the details below to sell or rent your item.</p>
        </div>

        {error && (
          <div className="w-full mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-md flex items-center gap-2 border border-red-100">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Item Photo (Optional)</Label>
            <div className="mt-2 flex items-center gap-6">
              {imagePreview ? (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null) }}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground bg-muted/30">
                  <Upload size={24} className="mb-2" />
                  <span className="text-xs">No image</span>
                </div>
              )}
              <div>
                <Label htmlFor="image-upload" className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                  Choose Photo
                </Label>
                <input 
                  id="image-upload"
                  type="file" 
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <p className="text-xs text-muted-foreground mt-2">Max size: 5MB (JPEG, PNG, WebP)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="e.g. Calculus 8th Edition" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="0.00" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select 
                id="category" 
                name="category"
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <select 
                id="condition" 
                name="condition"
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                required
              >
                <option value="">Select condition</option>
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Describe your item, its condition, and any other relevant details..." 
              required 
              rows={5}
            />
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="min-w-[120px]">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Post Listing"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
