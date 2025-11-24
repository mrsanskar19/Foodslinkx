'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  username: string;
  role: string;
  hotelId: {
    _id: string;
    name: string;
  } | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      console.log(data)

      // If no users, add a dummy user so the table is never empty
      if (Array.isArray(data) && data.length === 0) {
        setUsers([
          {
            _id: 'DUMMY_ID',
            username: 'Dummy User',
            role: 'hotel',
            hotelId: { _id: 'DUMMY_HOTEL', name: 'Dummy Hotel' },
          },
        ]);
      } else {
        setUsers(data);
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(`Error fetching users: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to delete user');
        }
        setUsers(users.filter((user) => user._id !== userId));
        alert('User deleted successfully.');
      } catch (err: any) {
        console.error('Error deleting user:', err);
        alert(`Error deleting user: ${err.message}`);
      }
    }
  };

  const handleView = (userId: string) => {
    router.push(`/admin/users/view/${userId}`);
  };

  const handleEdit = (userId: string) => {
    router.push(`/admin/users/edit/${userId}`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Users</h1>

      <div className="mb-4">
        <Link
          href="/admin/users/create"
          className="bg-primary hover:bg-primary text-white font-bold py-2 px-4 rounded"
        >
          Create New User
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="py-3 px-6 text-left border-b border-gray-200 bg-gray-100 font-bold text-gray-600 uppercase text-sm">ID</th>
              <th className="py-3 px-6 text-left border-b border-gray-200 bg-gray-100 font-bold text-gray-600 uppercase text-sm">Username</th>
              <th className="py-3 px-6 text-left border-b border-gray-200 bg-gray-100 font-bold text-gray-600 uppercase text-sm">Role</th>
              <th className="py-3 px-6 text-left border-b border-gray-200 bg-gray-100 font-bold text-gray-600 uppercase text-sm">Hotel</th>
              <th className="py-3 px-6 text-left border-b border-gray-200 bg-gray-100 font-bold text-gray-600 uppercase text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="py-4 px-6 border-b border-gray-200 text-gray-700 text-sm">{user._id}</td>
                <td className="py-4 px-6 border-b border-gray-200 text-gray-700 text-sm">{user.username}</td>
                <td className="py-4 px-6 border-b border-gray-200 text-gray-700 text-sm">{user.role}</td>
                <td className="py-4 px-6 border-b border-gray-200 text-gray-700 text-sm">{user.hotelId ? user.hotelId.name : 'N/A'}</td>
                <td className="py-4 px-6 border-b border-gray-200 text-gray-700 text-sm">
                  <button
                    onClick={() => handleView(user._id)}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(user._id)}
                    className="text-yellow-600 hover:text-yellow-900 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
