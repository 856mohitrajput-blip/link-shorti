'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import Image from 'next/image';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'Configuration':
        return {
          title: 'Configuration Error',
          message: 'There is a problem with the server configuration. Please contact support.',
          icon: <AlertCircle className="w-12 h-12 text-red-600" />
        };
      case 'AccessDenied':
        return {
          title: 'Account Blocked',
          message: 'Your account has been blocked. Please contact support for assistance.',
          icon: <ShieldAlert className="w-12 h-12 text-red-600" />
        };
      case 'Verification':
        return {
          title: 'Verification Error',
          message: 'The verification link is invalid or has expired. Please try again.',
          icon: <AlertCircle className="w-12 h-12 text-orange-600" />
        };
      default:
        return {
          title: 'Authentication Error',
          message: 'An error occurred during authentication. Please try again.',
          icon: <AlertCircle className="w-12 h-12 text-red-600" />
        };
    }
  };

  const errorInfo = getErrorMessage();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/logo.jpg"
              alt="LinkShorti Logo"
              width={48}
              height={48}
              className="rounded-xl"
            />
            <span className="text-3xl font-extrabold text-gray-900">LinkShorti</span>
          </div>
        </div>

        {/* Error Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {errorInfo.icon}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {errorInfo.title}
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            {errorInfo.message}
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/join-now"
              className="block w-full px-6 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              Back to Sign In
            </Link>

            {error === 'AccessDenied' && (
              <a
                href="mailto:support@linkshorti.com"
                className="block w-full px-6 py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all"
              >
                Contact Support
              </a>
            )}
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <a
              href="mailto:support@linkshorti.com"
              className="text-cyan-600 hover:text-cyan-700 font-medium"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
