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
      <div className="relative text-center py-16 sm:py-20 px-4 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            We are here for you. How can we help?
          </p>
        </div>
      </div>

      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
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
                    className="block w-full rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm p-2.5"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
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
                    className="block w-full rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm p-2.5"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm p-2.5"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 transition-colors"
                >
                  <Send className="h-5 w-5 mr-2" />
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
                {status === 'success' && (
                  <p className="text-green-600 text-sm">Your message has been sent successfully. We will contact you back soon.</p>
                )}
                {status === 'error' && (
                  <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
                )}
              </form>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3 text-sm text-gray-600">
                  <p className="flex items-start">
                    <span className="text-cyan-600 mr-2">•</span>
                    <span>We typically respond within 24 hours during business days</span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-cyan-600 mr-2">•</span>
                    <span>For urgent matters, please call us directly</span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-cyan-600 mr-2">•</span>
                    <span>All inquiries are handled with strict confidentiality</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Our Office</h3>
                <p className="text-gray-600 text-sm mb-4">
                  International Tech Park, Bangalore, India
                </p>
                <div className="h-[250px] bg-gray-200 rounded-lg overflow-hidden">
                  <Map />
                </div>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-cyan-600" />
                    <a
                      href="mailto:support@linkshorti.com"
                      className="ml-3 text-sm text-gray-600 hover:text-gray-900"
                    >
                      support@linkshorti.com
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-cyan-600" />
                    <a
                      href="tel:+918059238403"
                      className="ml-3 text-sm text-gray-600 hover:text-gray-900"
                    >
                      (coming soon)
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://twitter.com/linkshorti" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-cyan-500 transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-6 w-6" />
                  </a>
                  <a 
                    href="https://linkedin.com/company/linkshorti" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a 
                    href="https://instagram.com/linkshorti" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-pink-600 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}