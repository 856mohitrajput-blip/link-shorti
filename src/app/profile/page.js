'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Check, AlertCircle, User, Lock, Mail, Eye, EyeOff, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  
  // Password change states
  const [passwordStep, setPasswordStep] = useState(1);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/join-now');
    }
    
    if (session?.user) {
      setFullName(session.user.fullName || '');
      setEmail(session.user.email || '');
      setProfileImage(session.user.image || '');
      checkIfGoogleUser();
    }
  }, [session, status, router]);

  const checkIfGoogleUser = async () => {
    try {
      const res = await axios.get('/api/profile/check-auth-method');
      setIsGoogleUser(res.data.isGoogleUser);
    } catch (error) {
      console.error('Error checking auth method:', error);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('/api/profile/update', { fullName });

      if (res.data.success) {
        showMessage('success', 'Profile updated successfully');
        
        // Trigger NextAuth session update with the new data
        await update({ fullName });
        
        // Wait a moment to show the success message, then do a hard reload
        setTimeout(() => {
          setIsReloading(true);
          window.location.reload();
        }, 1000);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      showMessage('error', error?.response?.data?.message || 'Failed to update profile');
      setLoading(false);
    }
  };

  const handleRequestPasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      showMessage('error', 'Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('/api/profile/change-password', {
        action: 'request',
        newPassword
      });

      if (res.data.success) {
        showMessage('success', 'Verification code sent to your email');
        setPasswordStep(2);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      showMessage('error', error?.response?.data?.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('/api/profile/change-password', {
        action: 'verify',
        otp,
        newPassword
      });

      if (res.data.success) {
        showMessage('success', 'Password changed successfully');
        setPasswordStep(1);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setOtp('');
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      showMessage('error', error?.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setPasswordStep(1);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setOtp('');
    setMessage({ type: '', text: '' });
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-100 rounded-full"></div>
          <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      {isReloading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-gray-600 font-medium">Updating profile...</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-28 space-y-6 lg:space-y-8">
              {/* Profile Card */}
              <div className="group flex lg:block items-center gap-4 lg:gap-0">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:mb-5">
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 overflow-hidden shadow-lg ring-4 ring-white transition-all group-hover:shadow-xl group-hover:scale-105">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                        {fullName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  {isGoogleUser && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-xl shadow-lg flex items-center justify-center ring-2 ring-white transition-transform group-hover:scale-110">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 lg:flex-none">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 lg:mb-1.5 transition-colors group-hover:text-gray-700">{fullName}</h2>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed break-all">{email}</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex lg:flex-col gap-2 lg:space-y-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'profile'
                      ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                {!isGoogleUser && (
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'security'
                        ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span>Security</span>
                  </button>
                )}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
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
                    <Check className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                </div>
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-8 lg:mb-10">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 lg:mb-3">Profile Settings</h1>
                  <p className="text-sm sm:text-base text-gray-600">Manage your personal information and preferences</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-2xl">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          disabled
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-gray-500">
                        Your email address cannot be changed
                      </p>
                    </div>

                    {isGoogleUser && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-blue-900 mb-0.5">Connected with Google</p>
                            <p className="text-xs text-blue-700">
                              Your account is linked to Google. Some settings are managed through your Google account.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving changes...' : 'Save changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && !isGoogleUser && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-8 lg:mb-10">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 lg:mb-3">Security Settings</h1>
                  <p className="text-sm sm:text-base text-gray-600">Manage your password and account security</p>
                </div>

                {passwordStep === 1 ? (
                  <form onSubmit={handleRequestPasswordChange} className="space-y-6 max-w-2xl">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> A verification code will be sent to your email to confirm the password change.
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Sending code...' : 'Continue to verification'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="max-w-2xl animate-in fade-in duration-300">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/60 rounded-xl mb-8 shadow-sm">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-900 mb-1.5">Verification code sent</p>
                          <p className="text-xs text-blue-700 leading-relaxed">
                            We&apos;ve sent a 6-digit verification code to <strong>{email}</strong>. Please enter it below to complete your password change.
                          </p>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleVerifyPasswordChange} className="space-y-8">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Verification Code</label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value) && value.length <= 6) {
                              setOtp(value);
                            }
                          }}
                          maxLength="6"
                          placeholder="000000"
                          className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-center text-2xl font-mono tracking-[0.5em] shadow-sm transition-all hover:border-gray-400 hover:shadow"
                          required
                        />
                        <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                          Code expires in 10 minutes
                        </p>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={handleCancelPasswordChange}
                          className="px-6 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow active:scale-[0.98]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading || otp.length !== 6}
                          className="flex-1 px-6 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 active:scale-[0.98]"
                        >
                          {loading ? (
                            <span className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Verifying...
                            </span>
                          ) : (
                            'Verify & change password'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
