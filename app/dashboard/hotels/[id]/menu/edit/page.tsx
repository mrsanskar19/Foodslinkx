"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

interface Category {
  _id: string
  name: string
  hotelId: string
}

interface MenuItem {
  name: string
  description: string
  price: number
  category: string
  available: boolean
  image: string
}


export default function MenuManagementPage() {
   const params = useParams()
    const hotelId = params.id as string
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newMenuItem, setNewMenuItem] = useState<MenuItem>({
    name: '',
    description: '',
    price: 0,
    category: '',
    available: true,
    image: 'https://via.placeholder.com/150',
  })

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/hotels/${hotelId}/categories`)
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleCreateCategory = async () => {
    try {
      const response = await fetch(`/api/hotels/${hotelId}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName, hotelId }),
      })
      if (response.ok) {
        const newCategory = await response.json()
        setCategories([...categories, newCategory])
        setNewCategoryName('')
        alert('Category created')
      } else {
        alert('Failed to create category')
      }
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  const handleAddMenuItem = async () => {
 try {
      const response = await fetch(`/api/hotels/${hotelId}/menu-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newMenuItem, hotelId }),
      })
      if (response.ok) {
        const addedMenuItem = await response.json()
        // Optionally, update a list of menu items or clear the form
        setNewMenuItem({ name: '', description: '', price: 0, category: '', available: true, image: '' })
        alert('Menu item added successfully')
      } else {
        alert('Failed to add menu item')
      }
    } catch (error) {
      console.error('Error adding menu item:', error)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Menu & Category Management</h1>

      {/* Category Management */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name"
            className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
          />
          <button onClick={handleCreateCategory} className="bg-secondary text-secondary-foreground py-2 px-4 rounded-lg hover:bg-secondary/90">
            Create Category
          </button>
        </div>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat._id} className="bg-card p-3 rounded-lg shadow-sm">
              {cat.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Menu Item Management */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Add New Menu Item</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name" 
            onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
             className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            placeholder="Description"
            onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
             className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
          />
          <input
            type="number"
            placeholder="Price"
            onChange={(e) => setNewMenuItem({ ...newMenuItem, price: parseFloat(e.target.value) })}
             className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
          />
          <select
            value={newMenuItem.category}
            onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary"
            >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
           <input
            type="file"
            placeholder="Image"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setNewMenuItem({ ...newMenuItem, image: reader.result as string });
                };
                reader.readAsDataURL(file);
              }
            }}
             className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={newMenuItem.available}
              onChange={(e) => setNewMenuItem({ ...newMenuItem, available: e.target.checked })}
              className="mr-2"
            />
            <label>Available</label>
          </div>
        </div>
        <button onClick={handleAddMenuItem} className="mt-4 bg-primary text-primary-foreground py-2 px-6 rounded-lg hover:bg-primary/90">
          Add Menu Item
        </button>
      </div>
    </div>
  )
}
