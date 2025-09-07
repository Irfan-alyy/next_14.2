'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Mail } from 'lucide-react';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const VerifyRequestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <main>
        <section className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-10 overflow-hidden rounded-b-lg shadow-xl">
          <div className="absolute inset-0 z-0 opacity-10">
            <svg className="w-full h-full" fill="none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
              <circle cx="20" cy="20" r="15" fill="currentColor" className="text-indigo-400"></circle>
              <circle cx="80" cy="50" r="25" fill="currentColor" className="text-purple-400"></circle>
              <circle cx="50" cy="80" r="10" fill="currentColor" className="text-indigo-300"></circle>
            </svg>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 animate-fade-in-up">
              Check Your Email
            </h1>
            <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
              We’ve sent a magic link to your email. Click the link to sign in.
            </p>
          </div>
        </section>
        <section className="py-16 bg-gray-50">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-300 ease-in-out hover:shadow-3xl text-center"
            >
              <Mail className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-700 mb-4">
                A sign-in link has been sent to your email address. Please check your inbox (and spam/junk folder) to continue.
              </p>
              <p className="text-gray-500 text-sm">
                Didn’t receive the email? Try signing in again or contact support.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VerifyRequestPage;