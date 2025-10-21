'use client';

import { Users, Target, Eye, TrendingUp, Zap, Award } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-gray-50 text-gray-800">
      <section className="relative text-center py-16 sm:py-20 px-4 overflow-hidden bg-gradient-to-r from-cyan-100 via-blue-100 to-purple-100">
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
            About  LinkShorti
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-gray-600">
            We are a passionate team dedicated to providing the best link shortening service in the world.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold tracking-tighter text-center text-gray-900">Our Story</h2>
          <div className="mt-12 text-lg text-gray-600 space-y-6 text-justify">
            <p>
              Founded in 2024, Link Shorti was born from a simple idea: to make sharing links easier and more effective. We saw a world cluttered with long, clunky URLs and envisioned a simpler, more elegant solution. What started as a side project quickly grew into a passion for creating a powerful tool that could help creators, marketers, and businesses of all sizes.
            </p>
            <p>
              Our journey has been one of continuous innovation. We are constantly exploring new ways to improve our service, from adding powerful analytics features to ensuring our platform is secure and reliable. We are proud of what we have built, but we are even more excited about what the future holds.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-cyan-100 p-4 text-cyan-600">
              <Target className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            <p className="mt-2 text-gray-600">
              Our mission is to empower creators, marketers, and businesses to share their content with the world through short, memorable links.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-blue-100 p-4 text-blue-600">
              <Eye className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
            <p className="mt-2 text-gray-600">
              We envision a world where every link is a gateway to a great experience. We are committed to building the tools to make that a reality.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-purple-100 p-4 text-purple-600">
              <Award className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Our Values</h2>
            <p className="mt-2 text-gray-600">
              We believe in innovation, simplicity, and putting our users first. We are committed to building a product that is not only powerful but also a joy to use.
            </p>
          </div>
        </div>
      </section>



      <section className="bg-white py-16 sm:py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-gray-900 sm:text-4xl">Ready to get started?</h2>
          <p className="mt-4 text-lg text-gray-600">
            Create your free account today and start sharing short, powerful links.
          </p>
          <div className="mt-8">
            <a
              href="/join-now"
              className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform transition-transform hover:scale-105"
            >
              Sign Up for Free
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}