'use client';

import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-700"></div>
      <div className="relative bg-white rounded-2xl p-6 sm:p-8 md:p-10">
        <button
          className="flex w-full items-center justify-between text-left text-lg font-medium text-gray-800 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">{question}</span>
          {isOpen ? (
            <Minus className="h-6 w-6 text-purple-500" />
          ) : (
            <Plus className="h-6 w-6 text-gray-400" />
          )}
        </button>
        <div
          className={`grid overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default function FaqPage() {
  const faqs = [
    {
      question: 'Why are views/statistics/earnings not counting?',
      answer:
        'Visitors must be unique within 24 hours. Visitors must reach their destination page to count as a visit. Visitors must have JavaScript enabled. Visitors must have cookies enabled. Visitors must disable AdBlock extensions, VPN, and proxy.',
    },
    {
      question: 'How to Create an Account in LinkShorti?',
      answer:
        'Click on the "Sign up" tab in the upper-right side of the home page. You will see a registration form with fields for your username, email address, and password. Fill out the form, accept the terms and conditions, and click on "Register". Your LinkShorti account will be activated and you will be logged in.',
    },
    {
      question: 'How do I create a short link?',
      answer:
        "Simply paste your long link into the input field on the home page and click the 'Shorten' button. Your short link will be generated instantly.",
    },
    {
      question: 'How to Share our links on Facebook/Instagram?',
      answer:
        'To post your shortened links on Facebook or Instagram without any issues, we recommend using a service like etextpad.com to wrap your links.',
    },
    {
      question: 'How to Withdraw from LinkShorti?',
      answer:
        'To withdraw your earnings, you need to fill out your profile information in your LinkShorti account. Once your details are saved, you can request a withdrawal. We process payments on a daily basis, and the minimum withdrawal amount is $4. We support various payment methods including PayPal, Airtm, Paysera, WebMoney, Payeer & UPI etc.',
    },
    {
      question: 'Is LinkShorti the highest paying URL shortener service?',
      answer:
        'Yes, LinkShorti is one of the highest paying URL shorteners in 2025. If you are looking for the best paying URL shortener, you have come to the right place.',
    },
    {
      question: 'Is LinkShorti a Legit URL Shortener?',
      answer:
        'Yes, LinkShorti is a highly trusted and legitimate URL shortener service for earning money online. We have been paying our users daily since 2025 and have received positive reviews for our reliability.',
    },
    {
      question: 'Is LinkShorti the best URL shortener of 2025?',
      answer:
        'Yes, LinkShorti is one of the top link shorteners to earn money in 2025. We are a trusted network with high CPM rates, and our company has been providing reliable service since 2018.',
    },
  ];

  return (
      <div className="mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-500 drop-shadow-md">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to the most common questions about LinkShorti.
          </p>
        </div>
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {faqs.map((faq, index) => (
            <FaqItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
  );
}
