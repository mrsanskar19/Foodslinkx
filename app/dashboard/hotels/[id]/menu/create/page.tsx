'use client'

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Utensils, DollarSign, Tag, FileText, Image as ImageIcon, ToggleLeft, ToggleRight } from "lucide-react";

type Category = {
  _id: string;
  name: string;
};

export default function CreateMenuItemPage() {
  const router = useRouter();
  const params = useParams();
  const hotelId = params.id as string;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [linkTarget, setLinkTarget] = useState("");
  const [available, setAvailable] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId) return;

    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/hotels/${hotelId}/categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data.categories || data);
        if (data.categories?.length > 0 && !category) {
          setCategory(data.categories[0]._id);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchCategories();
  }, [hotelId, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('hotelId', hotelId);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('available', available.toString());
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }
      if (imageUrl) {
        formData.append('imageUrl', imageUrl);
      }
      if (linkTarget) {
        formData.append('linkTarget', linkTarget);
      }

      const res = await fetch(`/api/menu/add`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create menu item");
      }

      router.push(`/dashboard/hotels/${hotelId}/menu`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.includes("image")) {
        const file = item.getAsFile();
        if (file) {
          setImageFile(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target && typeof e.target.result === "string") {
              setImagePreview(e.target.result);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          setImagePreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center mb-8">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <ArrowLeft size={20} />
                <span className="font-semibold">Back to Menu</span>
            </button>
        </div>

        <div className="bg-card p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-primary mb-8">Create a New Menu Item</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="font-semibold flex items-center gap-2"><Utensils size={16}/> Dish Name</label>
                        <input type="text" placeholder="e.g., Margherita Pizza" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary" required />
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <label className="font-semibold flex items-center gap-2"><DollarSign size={16}/> Price</label>
                        <input type="number" placeholder="e.g., 12.99" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary" required />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="font-semibold flex items-center gap-2"><FileText size={16}/> Description</label>
                    <textarea placeholder="e.g., Classic pizza with fresh mozzarella and basil" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary min-h-[100px]" required />
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <label className="font-semibold flex items-center gap-2"><Tag size={16}/> Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary" required>
                        <option value="" disabled>Select a category</option>
                        {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                    </select>
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                    <label className="font-semibold flex items-center gap-2"><ImageIcon size={16}/> Image</label>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <label className="block text-sm text-muted-foreground">Upload Image File (max 5MB)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary"
                        />
                    </div>

                    {/* OR separator */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-border"></div>
                        <span className="text-sm text-muted-foreground font-medium">OR</span>
                        <div className="flex-1 h-px bg-border"></div>
                    </div>

                    {/* External URL */}
                    <div className="space-y-2">
                        <label className="block text-sm text-muted-foreground">External Image URL</label>
                        <input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            onPaste={handlePaste}
                            className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary"
                        />
                    </div>

                    {/* Link Target */}
                    <div className="space-y-2">
                        <label className="block text-sm text-muted-foreground">Link Target URL (optional)</label>
                        <input
                            type="url"
                            placeholder="https://example.com"
                            value={linkTarget}
                            onChange={(e) => setLinkTarget(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary"
                        />
                    </div>

                    {/* Preview */}
                    {imagePreview && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-muted-foreground mb-2">Image Preview:</p>
                            <img src={imagePreview} alt="Menu item preview" className="rounded-lg border-2 border-border max-h-48 w-auto" />
                        </div>
                    )}
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between py-2">
                    <label className="font-semibold">Available for Ordering</label>
                    <div onClick={() => setAvailable(!available)} className="cursor-pointer flex items-center gap-2">
                        {available ? <ToggleRight size={40} className="text-primary"/> : <ToggleLeft size={40} className="text-muted-foreground"/>}
                        <span className={`font-bold ${available ? 'text-primary' : 'text-muted-foreground'}`}>{available ? "Yes" : "No"}</span>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm font-semibold pt-2">{error}</p>}

                <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
                    {loading ? "Creating..." : "Create Menu Item"}
                </button>
            </form>
        </div>
    </div>
  );
}
