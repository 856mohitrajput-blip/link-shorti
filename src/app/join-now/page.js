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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="relative w-full lg:max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden lg:h-[520px] min-h-[640px] sm:min-h-[600px] lg:min-h-0 flex flex-col">

        <div className="w-full py-4 text-center bg-gray-800 text-white flex items-center justify-center gap-3">
          <Image 
            src="/logo.jpg" 
            alt="LinkShorti Logo" 
            width={40} 
            height={40} 
            className="rounded-lg"
          />
          <span className="text-3xl font-extrabold">LinkShorti</span>
        </div>

        <div className="flex-1 relative lg:flex lg:flex-row h-full">
          <div
            className={`
              hidden lg:flex w-full lg:w-1/2 p-8 lg:p-12 text-white bg-gradient-to-br from-cyan-500 to-blue-600 flex-col justify-center items-center transition-all duration-700 ease-in-out h-full
              ${isLogin
                ? 'lg:translate-x-full'
                : 'lg:translate-x-0'
              }
            `}
          >
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
                {isLogin ? 'Hello, Friend!' : 'Welcome Back!'}
              </h2>
              <p className="mb-8 text-sm lg:text-base">
                {isLogin
                  ? 'Enter your personal details and start your journey with us'
                  : 'To keep connected with us please login with your personal info'}
              </p>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-bold py-3 px-8 rounded-full border-2 border-white hover:bg-white hover:text-cyan-500 transition-all duration-300 cursor-pointer text-sm lg:text-base"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </div>
          </div>

          <div
            className={`
              absolute lg:relative w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-12 bg-white transition-all duration-700 ease-in-out transform h-full overflow-y-auto
              ${isLogin
                ? 'lg:-translate-x-full'
                : 'lg:translate-x-0'
              }
            `}
          >
            <div className="flex-1 flex items-center justify-center w-full">
              {isLogin ? <LoginForm /> : <SignUpForm />}
            </div>

            <div className="w-full px-8 flex justify-center lg:hidden flex-shrink-0 pt-6 pb-2">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full max-w-sm font-bold py-3 px-8 rounded-full border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white transition-all duration-300 cursor-pointer text-sm"
              >
                {isLogin ? 'Need an Account? Sign Up' : 'Already have an Account? Login'}
              </button>
            </div>
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
        router.push("/dashboard");
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
    <div className="text-center w-full max-w-sm">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Login</h2>
      <div className="flex justify-center mb-6">
        <div className="w-16 h-1 bg-cyan-500"></div>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && <p className="text-red-500">{error}</p>}
        <div className="relative">
          <Mail className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="email"
            placeholder="Email"
            required={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm lg:text-base"
          />
        </div>
        <div className="relative">
          <Lock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            required={true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm lg:text-base"
          />
          <div
            className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="text-gray-400 h-5 w-5" /> : <Eye className="text-gray-400 h-5 w-5" />}
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform transition-transform hover:scale-105 cursor-pointer disabled:opacity-50 text-sm lg:text-base"
        >
          {loading ? 'Logging in...' : <><span>Login</span><ArrowRight className="ml-2 h-5 w-5" /></>}
        </button>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
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
          router.push("/dashboard");
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
      <div className="text-center w-full max-w-sm">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Verify Email</h2>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-1 bg-cyan-500"></div>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          We&apos;ve sent a 6-digit code to <strong>{email}</strong>
        </p>
        <form className="space-y-6" onSubmit={handleVerifyOTP}>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          <div className="relative">
            <input
              type="text"
              placeholder="Enter 6-digit code"
              required={true}
              value={otp}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 6) {
                  setOtp(value);
                  setError('');
                }
              }}
              maxLength="6"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-center text-lg font-mono tracking-widest"
            />
          </div>
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform transition-transform hover:scale-105 cursor-pointer disabled:opacity-50 text-sm lg:text-base"
          >
            {loading ? 'Verifying...' : <><span>Verify & Complete Signup</span><ArrowRight className="ml-2 h-5 w-5" /></>}
          </button>
          <button
            type="button"
            onClick={resendOTP}
            disabled={loading}
            className="w-full text-cyan-600 hover:text-cyan-800 text-sm font-medium disabled:opacity-50"
          >
            Didn&apos;t receive code? Resend
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Back to signup
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="text-center w-full max-w-sm">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Create Account</h2>
      <div className="flex justify-center mb-6">
        <div className="w-16 h-1 bg-cyan-500"></div>
      </div>
      <form className="space-y-6" onSubmit={handleSignup}>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <div className="relative">
          <User className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Name"
            required={true}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm lg:text-base"
          />
        </div>
        <div className="relative">
          <Mail className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="email"
            placeholder="Email"
            required={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm lg:text-base"
          />
        </div>
        <div className="relative">
          <Lock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type={showPassword ? 'text' : 'password'}
            required={true}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm lg:text-base"
          />
          <div
            className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="text-gray-400 h-5 w-5" /> : <Eye className="text-gray-400 h-5 w-5" />}
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform transition-transform hover:scale-105 cursor-pointer disabled:opacity-50 text-sm lg:text-base"
        >
          {loading ? 'Creating account...' : <><span>Create Account</span><ArrowRight className="ml-2 h-5 w-5" /></>}
        </button>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        <div className="mt-4">
          <GoogleSignInButton text="Sign up with Google" />
        </div>
      </div>
    </div>
  );
}