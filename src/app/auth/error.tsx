'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring', stiffness: 120 } },
  hover: { scale: 1.05 },
};

const ErrorPage: React.FC = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Unknown Error';

  const errorMessages: Record<string, string> = {
    Configuration: 'There was a problem with the server configuration. Please try again later.',
    AccessDenied: 'Access denied. You do not have permission to sign in.',
    Verification: 'The sign-in link is invalid or has expired. Please request a new one.',
    Default: 'An unexpected error occurred. Please try again.',
  };

  const message = errorMessages[error] || errorMessages.Default;

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
              Something Went Wrong
            </h1>
            <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
              An error occurred during authentication.
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
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <p className="text-gray-700 mb-4">{message}</p>
              <motion.div
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Link
                  href="/auth/signin"
                  className="inline-flex justify-center py-2 px-4 bg-indigo-600 text-white rounded-md shadow-lg hover:bg-indigo-700 transition duration-300"
                >
                  Try Again
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ErrorPage;