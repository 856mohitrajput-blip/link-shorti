'use client';

import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import axios from 'axios';

export default function JoinUsPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-lg flex flex-col lg:flex-row">
        {/* Left Panel - Welcome Message */}
        <div className={`hidden lg:flex lg:w-5/12 p-10 bg-slate-900 text-white flex-col justify-center ${!isLogin ? 'order-2' : 'order-1'}`}>
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <Image
                src="/logo.jpg"
                alt="LinkShorti"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-2xl font-bold">LinkShorti</span>
            </div>
            
            <h2 className="text-3xl font-bold">
              {isLogin ? 'New here?' : 'Welcome back!'}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {isLogin
                ? 'Create an account to start shortening and managing your links'
                : 'Sign in to access your dashboard and manage your links'}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="inline-block font-medium py-2.5 px-6 rounded-lg border border-white/30 hover:bg-white hover:text-slate-900 transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className={`w-full lg:w-7/12 flex flex-col ${!isLogin ? 'order-1' : 'order-2'} max-h-[90vh] overflow-y-auto`}>
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-center gap-3 py-6 border-b">
            <Image
              src="/logo.jpg"
              alt="LinkShorti"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="text-xl font-bold text-gray-900">LinkShorti</span>
          </div>

          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-sm">
              {isLogin ? <LoginForm /> : <SignUpForm />}
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden border-t p-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span className="font-semibold text-cyan-600 hover:text-cyan-700">
                {isLogin ? 'Sign Up' : 'Sign In'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/join-now', {
        action: 'login',
        email,
        password
      });

      if (res.data.success) {
        // Force a hard navigation to refresh the session
        window.location.href = "/dashboard";
      } else {
        throw new Error(res.data.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign In</h2>
        <p className="text-gray-600 text-sm">Enter your credentials to continue</p>
      </div>
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="text-left">
          <a href="/forgot-password" className="text-sm text-cyan-600 hover:text-cyan-700 underline">
            Forgot password?
          </a>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>
        <div className="mt-4">
          <GoogleSignInButton text="Sign in with Google" />
        </div>
      </div>
    </div>
  );
}

function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: signup form, 2: otp verification

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('/api/join-now', {
        action: 'signup',
        name,
        email,
        password
      });

      if (res.data.success) {
        setSuccess('Account created! Please check your email for verification code.');
        setStep(2);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Something went wrong';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/join-now', {
        action: 'verify',
        email,
        otp
      });

      if (res.data.success) {
        // Auto login after successful verification
        const loginRes = await axios.post('/api/join-now', {
          action: 'login',
          email,
          password
        });

        if (loginRes.data.success) {
          // Force a hard navigation to refresh the session
          window.location.href = "/dashboard";
        } else {
          throw new Error("Login failed after verification");
        }
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Invalid or expired OTP';
      setError(errorMessage);
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('/api/join-now', {
        action: 'resend',
        email
      });

      if (res.data.success) {
        setSuccess('New verification code sent to your email!');
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to resend OTP';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Verify Email</h2>
          <p className="text-sm text-gray-600">
            Enter the 6-digit code sent to <strong>{email}</strong>
          </p>
        </div>
        
        <form className="space-y-4" onSubmit={handleVerifyOTP}>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
              {success}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Verification Code</label>
            <input
              type="text"
              placeholder="000000"
              required
              value={otp}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 6) {
                  setOtp(value);
                  setError('');
                }
              }}
              maxLength="6"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-center text-xl font-mono tracking-widest text-gray-900"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
          
          <div className="space-y-2 pt-2 text-center">
            <button
              type="button"
              onClick={resendOTP}
              disabled={loading}
              className="text-cyan-600 hover:text-cyan-700 text-sm disabled:opacity-50 underline"
            >
              Resend code
            </button>
            <div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                ← Back
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
        <p className="text-gray-600 text-sm">Get started with LinkShorti</p>
      </div>
      
      <form className="space-y-4" onSubmit={handleSignup}>
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
            {success}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
          <div className="relative">
            <User className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>
        <div className="mt-4">
          <GoogleSignInButton text="Sign up with Google" />
        </div>
      </div>
    </div>
  );
}