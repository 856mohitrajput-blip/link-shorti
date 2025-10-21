'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, Twitter, Linkedin, Send, Instagram } from 'lucide-react';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
});

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => {
        setStatus('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          fullName: '',
          email: '',
          message: '',
        });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="relative text-center py-16 sm:py-24 px-4 bg-gradient-to-r from-cyan-100 via-blue-100 to-purple-100">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
          Get in Touch
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-gray-600">
          We are here for you. How can we help?
        </p>
      </div>

      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 flex flex-col">
              <h2 className="text-3xl font-bold tracking-tighter text-gray-900">
                Send a Message
              </h2>
              <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-6 flex-grow">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none sm:text-sm p-3"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none sm:text-sm p-3"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none sm:text-sm p-3"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
                {status === 'success' && (
                  <p className="text-green-600 text-sm">Your message has been sent successfully. We will contact you back soon.</p>
                )}
                {status === 'error' && (
                  <p className="text-red-600">Something went wrong. Please try again.</p>
                )}
              </form>
            </div>

            <div className="space-y-8 flex flex-col">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900">Our Office</h3>
                <p className="mt-2 text-gray-600">
                  International Tech Park, Bangalore, India
                </p>
                <div className="mt-4 flex-grow min-h-[300px] bg-gray-200 rounded-lg overflow-hidden">
                  <Map />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200">
            <div className="">
              <h3 className="text-2xl font-bold text-gray-900">Contact Information</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <Mail className="h-6 w-6 text-cyan-500" />
                  <a
                    href="mailto:hello@linkshorti.com"
                    className="ml-3 text-gray-600 hover:text-gray-900"
                  >
                    hello@linkshorti.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-6 w-6 text-cyan-500" />
                  <a
                    href="tel:+1234567890"
                    className="ml-3 text-gray-600 hover:text-gray-900"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
            </div>
            <div className="">
              <h3 className="text-2xl font-bold text-gray-900">Send DMs</h3>
              <div className="mt-4 flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <Twitter className="h-9 w-9" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <Linkedin className="h-9 w-9" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <Instagram className="h-9 w-9" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}