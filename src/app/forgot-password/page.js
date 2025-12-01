'use client';

import { useState } from 'react';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('/api/forgot-password', {
        action: 'request',
        email
      });

      if (res.data.success) {
        setSuccess(res.data.message);
        setStep(2);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to send reset code';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('/api/forgot-password', {
        action: 'verify',
        email,
        otp
      });

      if (res.data.success) {
        setSuccess(res.data.message);
        setStep(3);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Invalid or expired code';
      setError(errorMessage);
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('/api/forgot-password', {
        action: 'reset',
        email,
        otp,
        newPassword
      });

      if (res.data.success) {
        setSuccess(res.data.message);
        setTimeout(() => {
          router.push('/join-now');
        }, 2000);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to reset password';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('/api/forgot-password', {
        action: 'request',
        email
      });

      if (res.data.success) {
        setSuccess('New reset code sent to your email!');
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to resend code';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="w-full py-6 text-center bg-gray-800 text-white flex items-center justify-center gap-3">
          <Image
            src="/logo.jpg"
            alt="LinkShorti Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="text-2xl font-extrabold">LinkShorti</span>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 1 && (
            <EmailStep
              email={email}
              setEmail={setEmail}
              error={error}
              success={success}
              loading={loading}
              onSubmit={handleRequestReset}
            />
          )}

          {step === 2 && (
            <OTPStep
              email={email}
              otp={otp}
              setOtp={setOtp}
              error={error}
              success={success}
              loading={loading}
              onSubmit={handleVerifyOTP}
              onResend={resendCode}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <NewPasswordStep
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              error={error}
              success={success}
              loading={loading}
              onSubmit={handleResetPassword}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function EmailStep({ email, setEmail, error, success, loading, onSubmit }) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-3">Forgot Password?</h2>
      <div className="flex justify-center mb-6">
        <div className="w-16 h-1 bg-cyan-500"></div>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Enter your email address and we&apos;ll send you a code to reset your password.
      </p>

      <form className="space-y-6" onSubmit={onSubmit}>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <div className="relative">
          <Mail className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform transition-transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? 'Sending...' : (
            <>
              <span>Send Reset Code</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </button>

        <Link
          href="/join-now"
          className="block text-cyan-600 hover:text-cyan-800 text-sm font-medium mt-4"
        >
          ← Back to Login
        </Link>
      </form>
    </div>
  );
}

function OTPStep({ email, otp, setOtp, error, success, loading, onSubmit, onResend, onBack }) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-3">Enter Reset Code</h2>
      <div className="flex justify-center mb-6">
        <div className="w-16 h-1 bg-cyan-500"></div>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        We&apos;ve sent a 6-digit code to <strong>{email}</strong>
      </p>

      <form className="space-y-6" onSubmit={onSubmit}>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <div className="relative">
          <input
            type="text"
            placeholder="Enter 6-digit code"
            required
            value={otp}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value) && value.length <= 6) {
                setOtp(value);
              }
            }}
            maxLength="6"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-center text-lg font-mono tracking-widest"
          />
        </div>

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform transition-transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? 'Verifying...' : (
            <>
              <span>Verify Code</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onResend}
          disabled={loading}
          className="w-full text-cyan-600 hover:text-cyan-800 text-sm font-medium disabled:opacity-50"
        >
          Didn&apos;t receive code? Resend
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
      </form>
    </div>
  );
}

function NewPasswordStep({ newPassword, setNewPassword, confirmPassword, setConfirmPassword, error, success, loading, onSubmit }) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-3">Reset Password</h2>
      <div className="flex justify-center mb-6">
        <div className="w-16 h-1 bg-cyan-500"></div>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Enter your new password below.
      </p>

      <form className="space-y-6" onSubmit={onSubmit}>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <div className="relative">
          <Lock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="password"
            placeholder="New Password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="relative">
          <Lock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="password"
            placeholder="Confirm New Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform transition-transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? 'Resetting...' : (
            <>
              <span>Reset Password</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
