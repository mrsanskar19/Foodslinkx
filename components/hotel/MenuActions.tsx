
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from '@/lib/models/menu';

interface MenuActionsProps {
  menuItem: Menu;
  hotelId: string;
}

export default function MenuActions({ menuItem, hotelId }: MenuActionsProps) {
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState(menuItem.available);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleAvailability = async () => {
    try {
      const res = await fetch(`/api/hotels/${hotelId}/menu-items/${menuItem._id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ available: !isAvailable }),
        }
      );

      if (!res.ok) {
        throw new Error('Failed to update availability');
      }

      setIsAvailable(!isAvailable);
    } catch (error) {
      console.error(error);
      // Revert state on error
      // alert('Failed to update, please try again');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setIsDeleting(true);
      try {
        const res = await fetch(
          `/api/hotels/${hotelId}/menu-items/${menuItem._id}`,
          {
            method: 'DELETE',
          }
        );

        if (!res.ok) {
          throw new Error('Failed to delete menu item');
        }

        router.refresh(); // Refresh the page to reflect the deletion
      } catch (error) {
        console.error(error);
        alert('Failed to delete item, please try again');
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    router.push(`/dashboard/hotels/${hotelId}/menu/edit?menuId=${menuItem._id}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleEdit}
        className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Edit
      </button>
      <button
        onClick={handleToggleAvailability}
        className={`px-3 py-1 text-sm font-medium text-white rounded-md ${
          isAvailable ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {isAvailable ? 'Make Unavailable' : 'Make Available'}
      </button>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-400"
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}
