'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Shield, 
  ShieldAlert, 
  Search,
  Ban,
  CheckCircle,
  AlertCircle,
  Calendar,
  Mail,
  Wallet
} from 'lucide-react';
import axios from 'axios';

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [blockingUserId, setBlockingUserId] = useState(null);
  const [blockReason, setBlockReason] = useState('');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Check admin authentication from sessionStorage
    checkAdminAuth();
  }, [router]);

  const checkAdminAuth = () => {
    const adminAuth = sessionStorage.getItem('adminAuth');
    if (adminAuth) {
      fetchUsers();
    } else {
      router.push('/admin/login');
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(user => 
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/users');
      if (res.data.success) {
        setUsers(res.data.users);
        setFilteredUsers(res.data.users);
      }
    } catch (error) {
      showMessage('error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleBlockClick = (user) => {
    setSelectedUser(user);
    setBlockReason('');
    setShowBlockModal(true);
  };

  const handleBlockUser = async () => {
    if (!selectedUser) return;
    
    setBlockingUserId(selectedUser._id);
    try {
      const res = await axios.post('/api/admin/block-user', {
        userId: selectedUser._id,
        action: 'block',
        reason: blockReason || 'No reason provided'
      });

      if (res.data.success) {
        showMessage('success', 'User blocked successfully');
        fetchUsers();
        setShowBlockModal(false);
        setSelectedUser(null);
        setBlockReason('');
      }
    } catch (error) {
      showMessage('error', error?.response?.data?.message || 'Failed to block user');
    } finally {
      setBlockingUserId(null);
    }
  };

  const handleUnblockUser = async (userId) => {
    setBlockingUserId(userId);
    try {
      const res = await axios.post('/api/admin/block-user', {
        userId,
        action: 'unblock'
      });

      if (res.data.success) {
        showMessage('success', 'User unblocked successfully');
        fetchUsers();
      }
    } catch (error) {
      showMessage('error', error?.response?.data?.message || 'Failed to unblock user');
    } finally {
      setBlockingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-100 rounded-full"></div>
          <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  const stats = {
    total: users.length,
    blocked: users.filter(u => u.isBlocked).length,
    active: users.filter(u => !u.isBlocked).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <button
              onClick={() => router.push('/admin/withdrawals')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Wallet className="w-4 h-4" />
              Manage Withdrawals
            </button>
          </div>
          <p className="text-base text-gray-600">Manage user accounts and permissions</p>
        </div>

        {/* Alert Message */}
        {message.text && (
          <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 shadow-sm border animate-in slide-in-from-top-2 duration-300 ${
            message.type === 'success' 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-900 border-green-200/50' 
              : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-900 border-red-200/50'
          }`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              message.type === 'success' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
            </div>
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Users</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Active Users</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Blocked Users</span>
              <Ban className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.blocked}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm shadow-sm"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white font-semibold">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.isBlocked ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <Ban className="w-3 h-3" />
                          Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.isAdmin ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="text-sm text-gray-600">User</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!user.isAdmin && (
                        user.isBlocked ? (
                          <button
                            onClick={() => handleUnblockUser(user._id)}
                            disabled={blockingUserId === user._id}
                            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {blockingUserId === user._id ? 'Unblocking...' : 'Unblock'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlockClick(user)}
                            disabled={blockingUserId === user._id}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Block
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Block Modal */}
      {showBlockModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Block User</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to block <strong>{selectedUser.fullName}</strong>? They will not be able to sign in.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason (optional)</label>
              <textarea
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Enter reason for blocking..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowBlockModal(false);
                  setSelectedUser(null);
                  setBlockReason('');
                }}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockUser}
                disabled={blockingUserId === selectedUser._id}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {blockingUserId === selectedUser._id ? 'Blocking...' : 'Block User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
