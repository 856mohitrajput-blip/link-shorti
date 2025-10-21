'use client';

import GetStartedBtn from '@/components/StyledButtons';
import { ArrowRight, DollarSign, Users, BarChart, Shield, Zap, Headset, LinkIcon, MousePointerClick } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-gray-50 text-gray-800">
      <section className="relative text-center py-16 sm:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-100 via-blue-100 to-purple-100 opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
            Shorten, Share, and Shine
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-gray-600">
            The ultimate link shortener for creators, marketers, and businesses. Create short links in seconds & earn money for every visit.
          </p>
          <div className="mt-10">
            <a
              href="/join-now"
              className="inline-block font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-full"
            >
              <GetStartedBtn />
            </a>
          </div>
        </div>
      </section>

      <section className="relative -mt-12 z-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-2xl p-4 border border-gray-200">
            <form 
            onSubmit={(e) => {
              e.preventDefault()
              router.push('/join-now')
            }}
            className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="text"
                required
                placeholder="Enter your link here"
                className="flex-grow w-full bg-gray-100 border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
              <button
                type="submit"
                className="w-full hover:cursor-pointer sm:w-auto flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg shadow-md hover:shadow-lg transform transition-transform hover:scale-105"
              >
                <span>Shorten</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 px-6 md:px-12">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-gray-900">Why Link Shorti?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Highest Paying URL Shortener of 2025. Join now & earn up to $20/1000 visits.
          </p>
        </div>
        <div className="mt-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <FeatureCard
            icon={<DollarSign className="h-8 w-8 text-cyan-500" />}
            title="How much do I earn?"
            description="It's just 3 steps: create an account, create a link and post it - for every visit, you earn money. It's just that easy! Shrinkearn's cpm is upto 20$."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-cyan-500" />}
            title="20% Referral Bonus"
            description="The ShrinkEarn referral program is a great way to spread the word and earn even more money with your short links! Refer friends and receive 20% of their earnings for life!"
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-cyan-500" />}
            title="Featured Administration Panel"
            description="Control all of the features from the administration panel with a click of a button. A powerful dashboard at your fingertips."
          />
          <FeatureCard
            icon={<BarChart className="h-8 w-8 text-cyan-500" />}
            title="Detailed Stats"
            description="Know your audience. Analyse in detail what brings you the most income and what strategies you should adapt."
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-cyan-500" />}
            title="Low Minimum Payout"
            description="You are required to earn only $5.00 before you will be paid. We can pay all users via their PayPal."
          />
          <FeatureCard
            icon={<Headset className="h-8 w-8 text-cyan-500" />}
            title="Support"
            description="A dedicated support team is ready to help with any questions you may have. We are here to help you succeed."
          />
        </div>
      </section>

      <section className="relative pb-20 sm:pb-24 px-6">
        <div className="text-center mb-16 sm:mb-20 md:mb-32 mt-8">
          <p className="mb-2 text-xl text-gray-500 font-light ">Numbers Speak for Themselves</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter text-gray-900">
            Fast Gr<span className="border-b-4 border-cyan-400 pb-3">owing P</span>latform
          </h2>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <StatCard
            icon={<MousePointerClick className="h-10 w-10 text-white" />}
            number={716824855}
            label="Total Clicks"
            gradient="from-cyan-400 to-blue-500"
          />

          <StatCard
            icon={<LinkIcon className="h-10 w-10 text-white" />}
            number={124533257}
            label="Total Links"
            gradient="from-sky-400 to-cyan-500"
          />

          <StatCard
            icon={<Users className="h-10 w-10 text-white" />}
            number={934525}
            label="Registered Users"
            gradient="from-blue-400 to-indigo-500"
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg transform transition-transform hover:-translate-y-2 hover:shadow-cyan-100/50">
      <div className="flex items-center justify-center h-16 w-16 bg-gray-100 rounded-full mb-6 border border-gray-200">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      <p className="mt-4 text-gray-600">{description}</p>
    </div>
  );
}

function StatCard({ icon, number, label, gradient }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  const animateCount = useCallback(() => {
    let start = 0;
    const duration = 2000;
    const stepTime = 1000 / 60;
    const increment = number / (duration / stepTime);

    function step() {
      start += increment;
      if (start < number) {
        setCount(Math.floor(start));
        requestAnimationFrame(step);
      } else {
        setCount(number);
      }
    }

    requestAnimationFrame(step);
  }, [number]);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          animateCount();
          setHasAnimated(true);
        }
      },
      { threshold: 0.4 }
    );

    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [number, hasAnimated, animateCount]);

  return (
    <div
      ref={ref}
      className={`p-8 sm:p-10 rounded-2xl shadow-lg text-center transform transition-transform 
                  hover:-translate-y-2 hover:shadow-xl 
                  bg-gradient-to-r ${gradient}`}
    >
      <div className="flex items-center justify-center h-20 w-20 mx-auto bg-white/20 rounded-full mb-6">
        {icon}
      </div>
      <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
        {count.toLocaleString()}
      </h3>
      <p className="mt-2 sm:mt-4 text-white/90 font-medium">{label}</p>
    </div>
  );
}