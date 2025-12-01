"use client";
import React from "react";
import { Facebook, Instagram, Linkedin, Mail, Twitter, Youtube, Twitch, Discord } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer () {
  return (
    <footer className="bg-slate-900 text-gray-300 pt-12 pb-6 px-6 border-t border-slate-800">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Image 
                src="/logo.jpg" 
                alt="LinkShorti Logo" 
                width={28} 
                height={28} 
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-white">
                LinkShorti
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              The ultimate link shortening service with advanced analytics and the best payout rates.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><FooterLink href="/about">About Us</FooterLink></li>
              <li><FooterLink href="/payout-rates">Payout Rates</FooterLink></li>
              <li><FooterLink href="/faqs">FAQs</FooterLink></li>
              <li><FooterLink href="/contact">Contact</FooterLink></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-base font-semibold text-white mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><FooterLink href="/privacy">Privacy Policy</FooterLink></li>
              <li><FooterLink href="/terms">Terms of Service</FooterLink></li>
              <li><FooterLink href="/payment-proofs">Payment Proofs</FooterLink></li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-base font-semibold text-white mb-3">Payment Methods</h3>
            <div className="bg-slate-800 rounded-lg p-3">
              <Image 
                src="/platforms.jpg" 
                className="rounded w-full h-auto" 
                alt="Payment Platforms" 
                width={400} 
                height={225} 
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} LinkShorti. All rights reserved.
          </p>

          <div className="flex gap-3">
            <SocialIcon href="#" icon={<Twitter size={18} />} brand="twitter" />
            <SocialIcon href="#" icon={<Facebook size={18} />} brand="facebook" />
            <SocialIcon href="#" icon={<Instagram size={18} />} brand="instagram" />
            <SocialIcon href="#" icon={<Linkedin size={18} />} brand="linkedin" />
            <SocialIcon href="#" icon={<Youtube size={18} />} brand="youtube" />
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ href, children }) => (
  <Link href={href} className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
    {children}
  </Link>
);

const SocialIcon = ({ href, icon, brand }) => {
  const brandColors = {
    twitter: 'hover:bg-sky-500',
    facebook: 'hover:bg-blue-600',
    instagram: 'hover:bg-pink-500',
    linkedin: 'hover:bg-blue-700',
    youtube: 'hover:bg-red-600',
  };

  return (
    <Link
      href={href}
      className={`w-9 h-9 flex items-center justify-center bg-slate-800 rounded-lg text-gray-400 hover:text-white ${brandColors[brand]} transition-all`}
    >
      {icon}
    </Link>
  );
};