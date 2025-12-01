'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Search,
  Eye,
  Check,
  X,
  RotateCcw,
  RefreshCw
} from 'lucide-react';

export default function AdminWithdrawalsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionReason, setActionReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const adminAuth = sessionStorage.getItem('adminAuth');
    if (!adminAuth) {
      router.push('/admin/login');
      return;
    }
    fetchWithdrawals();
  }, [router]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('/api/admin/withdrawals');
      if (res.data.success) {
        setRequests(res.data.requests);
      } else {
        setError('Failed to fetch withdrawals');
      }
    } catch (error) {
      setError('Failed to fetch withdrawals');
    } finally {
      setLoading(false);
    }
  };


  const handleAction = async (action) => {
    if (!selectedRequest) return;

    setActionLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/admin/withdrawals', {
        userEmail: selectedRequest.userEmail,
        withdrawalId: selectedRequest.withdrawalId,
        action,
        reason: actionReason
      });

      if (res.data.success) {
        setSelectedRequest(null);
        setActionReason('');
        setSuccessMessage(res.data.message);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchWithdrawals();
      } else {
        setError(res.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update withdrawal');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Approved': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Complete': return 'text-green-600 bg-green-50 border-green-200';
      case 'Cancelled': return 'text-red-600 bg-red-50 border-red-200';
      case 'Returned': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentDetails = (request) => {
    const method = request.withdrawalDetails?.selectedMethod;
    const details = request.withdrawalDetails;
    
    if (!method || !details) return 'N/A';
    
    switch (method) {
      case 'PayPal':
        return details.paypal?.email || 'N/A';
      case 'UPI':
        return details.upi?.id || 'N/A';
      case 'Bank Transfer':
        return details.bank?.accountNumber ? `****${details.bank.accountNumber.slice(-4)}` : 'N/A';
      default:
        return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading withdrawals...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.push('/admin')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Withdrawal Management</h1>
            <button
              onClick={fetchWithdrawals}
              className="ml-auto p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {requests.filter(r => r.status === 'Pending').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {requests.filter(r => r.status === 'Approved').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${requests.reduce((sum, r) => sum + r.totalAmount, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </div>
        )}


        {/* Withdrawals Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">User</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Method</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Account</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-8 text-gray-500">
                      No withdrawal requests found
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">{request.userName}</p>
                          <p className="text-sm text-gray-500">{request.userEmail}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-gray-900">${request.totalAmount.toFixed(2)}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-700">{request.withdrawalDetails?.selectedMethod || 'N/A'}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">{getPaymentDetails(request)}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">{formatDate(request.date)}</span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>


      {/* Action Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Withdrawal Details</h3>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">User</span>
                  <p className="text-gray-900 font-medium">{selectedRequest.userName}</p>
                  <p className="text-sm text-gray-500">{selectedRequest.userEmail}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Amount</span>
                  <p className="text-2xl font-bold text-gray-900">${selectedRequest.totalAmount.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div>
                  <span className="text-sm font-medium text-gray-500">Method</span>
                  <p className="text-gray-900">{selectedRequest.withdrawalDetails?.selectedMethod || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  <p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t">
                <span className="text-sm font-medium text-gray-500">Payment Details</span>
                {selectedRequest.withdrawalDetails?.selectedMethod === 'PayPal' && (
                  <p className="text-gray-900">Email: {selectedRequest.withdrawalDetails.paypal?.email || 'N/A'}</p>
                )}
                {selectedRequest.withdrawalDetails?.selectedMethod === 'UPI' && (
                  <p className="text-gray-900">UPI ID: {selectedRequest.withdrawalDetails.upi?.id || 'N/A'}</p>
                )}
                {selectedRequest.withdrawalDetails?.selectedMethod === 'Bank Transfer' && (
                  <div className="text-gray-900 text-sm space-y-1">
                    <p>Bank: {selectedRequest.withdrawalDetails.bank?.bankName || 'N/A'}</p>
                    <p>Account: {selectedRequest.withdrawalDetails.bank?.accountNumber || 'N/A'}</p>
                    <p>IFSC: {selectedRequest.withdrawalDetails.bank?.ifscCode || 'N/A'}</p>
                    <p>Holder: {selectedRequest.withdrawalDetails.bank?.accountHolderName || 'N/A'}</p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t">
                <span className="text-sm font-medium text-gray-500">Date</span>
                <p className="text-gray-900">{formatDate(selectedRequest.date)}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Note (Optional)</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Add a note for this action..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                rows={3}
              />
            </div>

            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedRequest.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleAction('approve')}
                      disabled={actionLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction('cancel')}
                      disabled={actionLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                )}
                {selectedRequest.status === 'Approved' && (
                  <>
                    <button
                      onClick={() => handleAction('complete')}
                      disabled={actionLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Complete
                    </button>
                    <button
                      onClick={() => handleAction('return')}
                      disabled={actionLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Return Funds
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setActionReason('');
                }}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
