'use client'

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PlusCircle, Utensils } from "lucide-react";
import { useToast } from "@/lib/contexts/toast-context";

type Category = {
  _id: string;
  name: string;
};

type MenuItem = {
  _id: string;
  name: string;
  category: {
    _id: string;
    name: string;
  } | string; // Can be object or string ID
  price: number;
  available: boolean;
  image?: string;
  imageUrl?: string;
  imageFileUrl?: string;
  linkTarget?: string;
};

export default function MenuManagerPage() {
  const params = useParams();
  const router = useRouter();
  // Toast is temporarily disabled to fix UI issues
  // const { showToast } = useToast();
  const showToast = (message: string, type?: string) => {
    // Temporarily use alert instead of toast
    alert(`${type?.toUpperCase()}: ${message}`);
  };
  const hotelId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // Track which item is being acted upon
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  useEffect(() => {
    if (!hotelId) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [resCat, resMenu] = await Promise.all([
          fetch(`/api/hotels/${hotelId}/categories`),
          fetch(`/api/hotels/${hotelId}/menu`),
        ]);

        if (!resCat.ok) throw new Error("Failed to fetch categories");
        if (!resMenu.ok) throw new Error("Failed to fetch menu");

        const catJson = await resCat.json();
        const menuJson = await resMenu.json();

        setCategories(catJson.categories || catJson);
        setMenu(menuJson.menu || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [hotelId]);

  const handleToggleAvailable = async (itemId: string, current: boolean) => {
    setActionLoading(itemId);
    try {
      // Check if this is an embedded menu item (from hotel.menu) or from Menu collection
      const item = menu.find(m => m._id === itemId);
      const isEmbeddedItem = item && typeof item.category === 'string'; // Embedded items have category as string

      const apiUrl = isEmbeddedItem
        ? `/api/hotels/${hotelId}/menu-items/${itemId}`
        : `/api/menu/status/${itemId}`;

      const res = await fetch(apiUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !current }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update availability");
      }

      setMenu((menu) =>
        menu.map((item) =>
          item._id === itemId ? { ...item, available: !current } : item
        )
      );

      showToast(
        `Menu item ${!current ? 'marked as available' : 'marked as unavailable'}`,
        "success"
      );
    } catch (error: any) {
      showToast(error.message || "Failed to update menu item availability", "error");
    } finally {
      setActionLoading(null);
    }
  };


  const handleEdit = (id:string) =>{
    router.push(`/dashboard/hotels/${hotelId}/menu/edit/${id}`)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setActionLoading(id);
      try {
        // Check if this is an embedded menu item or from Menu collection
        const item = menu.find(m => m._id === id);
        const isEmbeddedItem = item && typeof item.category === 'string';

        const apiUrl = isEmbeddedItem
          ? `/api/hotels/${hotelId}/menu-items/${id}`
          : `/api/menu/${id}`;

        const res = await fetch(apiUrl, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to delete menu item');
        }

        // Remove item from local state immediately
        setMenu((menu) => menu.filter((item) => item._id !== id));

        showToast('Menu item deleted successfully', 'success');
      } catch (error: any) {
        showToast(error.message || 'Failed to delete item, please try again', 'error');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setAddingCategory(true);
    try {
      const res = await fetch(`/api/hotels/${hotelId}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName, hotelId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add category');
      }

      const newCategory = await res.json();
      setCategories((prev) => [...prev, newCategory]);
      setNewCategoryName('');
      showToast('Category added successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to add category', 'error');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? This may affect menu items.')) {
      try {
        const res = await fetch(`/api/hotels/${hotelId}/categories/${categoryId}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to delete category');
        }

        setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
        showToast('Category deleted successfully', 'success');
      } catch (error: any) {
        showToast(error.message || 'Failed to delete category', 'error');
      }
    }
  };


  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Menu Management
              </h1>
              <p className="text-gray-600 text-lg">Create and manage your restaurant menu items</p>
              <Link href={`/dashboard/hotels/${hotelId}/menu/create`}>
                <span className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg cursor-pointer mt-4">
                  <PlusCircle size={20} />
                  <span>Add New Menu Item</span>
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Items</p>
                <p className="text-2xl font-bold text-gray-800">{menu.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Utensils className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Category Management */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Category Management</h2>
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddCategory}
                disabled={addingCategory || !newCategoryName.trim()}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                {addingCategory ? 'Adding...' : 'Add Category'}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{category.name}</span>
                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {menu.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Utensils className="text-gray-400" size={40} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Your Menu is Empty</h3>
            <p className="text-gray-600 mb-8 text-lg">Start building your menu by adding your first dish.</p>
            <Link href={`/dashboard/hotels/${hotelId}/menu/create`}>
              <span className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg cursor-pointer">
                <PlusCircle size={24} />
                <span>Create Your First Menu Item</span>
              </span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menu.map((item) => (
              <div key={item._id} className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                {/* Image */}
                {(item.imageFileUrl || item.imageUrl || item.image) && (
                  <div className="relative">
                    <img
                      src={item.imageFileUrl || item.imageUrl || item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                      item.available
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {item.available ? "Available" : "Unavailable"}
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-3">
                    Category: {typeof item.category === 'object' ? item.category?.name : (categories.find((cat) => cat._id === item.category)?.name || "Uncategorized")}
                  </p>
                  <p className="text-2xl font-bold text-green-600 mb-4">₹{item.price.toFixed(2)}</p>

                  <div className="flex gap-3">
                    {/* Toggle Availability */}
                    <button
                      className={`flex-1 px-4 py-3 rounded-xl text-white font-semibold transition-all duration-200 ${
                        item.available
                          ? "bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          : "bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      } ${actionLoading === item._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => handleToggleAvailable(item._id, item.available)}
                      disabled={actionLoading === item._id}
                    >
                      {actionLoading === item._id ? 'Updating...' : (item.available ? "Mark Unavailable" : "Mark Available")}
                    </button>

                    {/* Edit */}
                    <button
                      className="px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
                      onClick={() => handleEdit(item._id)}
                      disabled={actionLoading === item._id}
                    >
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      className="px-4 py-3 rounded-xl bg-gray-700 hover:bg-gray-800 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
                      onClick={() => handleDelete(item._id)}
                      disabled={actionLoading === item._id}
                    >
                      {actionLoading === item._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
