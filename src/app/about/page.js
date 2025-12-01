'use client';

import { Users, Target, Eye, TrendingUp, Zap, Award } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-gray-50 text-gray-800">
      <section className="relative text-center py-16 sm:py-20 px-4 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            About LinkShorti
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            We are a passionate team dedicated to providing the best link shortening service in the world.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Story</h2>
          <div className="text-base text-gray-600 space-y-4 leading-relaxed">
            <p>
              Founded in 2024, Link Shorti was born from a simple idea: to make sharing links easier and more effective. We saw a world cluttered with long, clunky URLs and envisioned a simpler, more elegant solution. What started as a side project quickly grew into a passion for creating a powerful tool that could help creators, marketers, and businesses of all sizes.
            </p>
            <p>
              Our journey has been one of continuous innovation. We are constantly exploring new ways to improve our service, from adding powerful analytics features to ensuring our platform is secure and reliable. We are proud of what we have built, but we are even more excited about what the future holds.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6">
            <div className="mb-4 rounded-lg bg-cyan-50 p-3 text-cyan-600">
              <Target className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h2>
            <p className="text-sm text-gray-600">
              Our mission is to empower creators, marketers, and businesses to share their content with the world through short, memorable links.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="mb-4 rounded-lg bg-blue-50 p-3 text-blue-600">
              <Eye className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Our Vision</h2>
            <p className="text-sm text-gray-600">
              We envision a world where every link is a gateway to a great experience. We are committed to building the tools to make that a reality.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="mb-4 rounded-lg bg-purple-50 p-3 text-purple-600">
              <Award className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Our Values</h2>
            <p className="text-sm text-gray-600">
              We believe in innovation, simplicity, and putting our users first. We are committed to building a product that is not only powerful but also a joy to use.
            </p>
          </div>
        </div>
      </section>



      <section className="bg-gray-50 py-16 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">Ready to get started?</h2>
          <p className="mt-4 text-gray-600">
            Create your free account today and start sharing short, powerful links.
          </p>
          <div className="mt-8">
            <a
              href="/join-now"
              className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Sign Up for Free
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}