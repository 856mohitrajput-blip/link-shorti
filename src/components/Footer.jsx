"use client";
import React from "react";
import { Facebook, Instagram, Linkedin, Mail, Twitter, Youtube, Twitch, Discord } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer () {
  return (
    <footer className="bg-black text-gray-300 pt-16 pb-8 px-6">
      <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        
        <div className="md:col-span-1 flex-1">
          <Link href="/" className="flex items-center gap-3 mb-4">
            <Image 
              src="/logo.jpg" 
              alt="LinkShorti Logo" 
              width={32} 
              height={32} 
              className="rounded-lg"
            />
            <span className="text-2xl font-bold text-white tracking-wider">
              LinkShorti
            </span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed">
            The ultimate link shortening service with advanced analytics and the best payout rates.
          </p>
        </div>

        <div className="flex-1 sm:justify-self-center">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-3">
            <li><FooterLink href="/privacy">Privacy Policy</FooterLink></li>
            <li><FooterLink href="/terms">Terms of Use</FooterLink></li>
            <li><FooterLink href="/contact">Contact Us</FooterLink></li>
          </ul>
        </div>

        <div className="sm:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Payout Methods (Platforms supported)</h3>
          <div>
            <Image src="/platforms.jpg" className="rounded-sm" alt="Platforms" width={1600} height={900} layout="responsive" />
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-500 text-center md:text-left mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} LinkShorti. All rights reserved.
        </p>

        <div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <SocialIcon href="#" icon={<Twitter size={20} />} brand="twitter" />
            <SocialIcon href="#" icon={<Facebook size={20} />} brand="facebook" />
            <SocialIcon href="#" icon={<Instagram size={20} />} brand="instagram" />
            <SocialIcon href="#" icon={<Linkedin size={20} />} brand="linkedin" />
            <SocialIcon href="#" icon={<Youtube size={20} />} brand="youtube" />
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ href, children }) => (
  <Link href={href} className="hover:text-cyan-400 transition-colors duration-300">
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
    twitch: 'hover:bg-purple-600',
    discord: 'hover:bg-indigo-500',
  };

  return (
    <Link
      href={href}
      className={`w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full text-white ${brandColors[brand]} transition-all duration-300`}
    >
      {icon}
    </Link>
  );
};