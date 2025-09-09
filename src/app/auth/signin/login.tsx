"use client"; // This directive is necessary for client-side interactivity in Next.js App Router

import React, { useState } from "react";
import { Mail, LogIn } from "lucide-react"; // Importing icons from lucide-react
import { motion, AnimatePresence, Variants } from "framer-motion"; // Importing framer-motion
import { signIn } from "next-auth/react";
import { Loader } from "lucide-react";
import LoadingSpinner from "@/components/ui/spinners";

// Inline SVG for Google Logo
const GoogleIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="20px"
    height="20px"
    className="mr-2"
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.945,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,2.867,0.702,5.55,1.937,7.961l6.571-4.819C11.345,26.892,7.055,24,7.055,24C7.055,24,6.306,14.691,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.571-4.819C29.345,35.108,25.055,38,24,38c-5.055,0-9.345-3.108-11.303-7.961l-6.571,4.819C9.954,41.947,14.732,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.002,0.003-0.003l6.571,4.819C34.046,41.947,38.824,44,43.611,44z"
    />
  </svg>
);

// Inline SVG for GitHub Logo
const GithubIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="20px"
    height="20px"
    className="mr-2"
    fill="currentColor"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.6.111.82-.255.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.542-1.367-1.322-1.734-1.322-1.734-1.08-.744.082-.73.082-.73 1.192.083 1.82 1.226 1.82 1.226 1.06 1.81 2.784 1.287 3.45.987.108-.767.419-1.287.769-1.583-2.646-.301-5.426-1.323-5.426-5.889 0-1.303.465-2.369 1.226-3.204-.124-.301-.532-1.513.111-3.159 0 0 1-.32 3.269 1.226 1-.276 2.06-.414 3.12-.419 1.06.005 2.12.143 3.12.419 2.269-1.546 3.269-1.226 3.269-1.226.645 1.646.237 2.858.111 3.159.76.835 1.226 1.901 1.226 3.204 0 4.575-2.784 5.582-5.433 5.879.43.372.823 1.102.823 2.222 0 1.606-.015 2.895-.015 3.286 0 .326.21.696.825.577 4.766-1.587 8.204-6.085 8.204-11.387C24 5.373 18.627 0 12 0z" />
  </svg>
);

// Variants for Framer Motion animations
const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<{
    provider: string;
    loading: boolean;
  }>({ provider: "", loading: false });

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (isLogin) {
  //     // Handle login logic here
  //     console.log('Login attempt:', { email, password });
  //     // In a real app, you'd integrate with your backend auth system (e.g., NextAuth.js)
  //     // Example: signIn('credentials', { email, password });
  //   } else {
  //     // Handle signup logic here
  //     if (password !== confirmPassword) {
  //       // In a real app, replace alert with a custom modal or toast notification
  //       console.error('Passwords do not match!');
  //       return;
  //     }
  //     console.log('Signup attempt:', { name, email, password });
  //     // Example: signUp({ name, email, password });
  //   }
  //   // In a real app, you'd typically redirect or show a success/error message
  // };

  const handleGoogleSignIn = () => {
    setLoading({ provider: "google", loading: true });
    console.log("Continue with Google clicked");
    signIn("google", { callbackUrl: "/" });
    // Example: signIn('google');
  };

  const handleGithubSignIn = () => {
    setLoading({ provider: "github", loading: true });
    console.log("Continue with GitHub clicked");
    signIn("github", { callbackUrl: "/" });
    // Example: signIn('github');
  };
  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading({ provider: "email", loading: true });
    console.log("Continue with Magic Link clicked");
    signIn("email", { email: email, callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-4 font-inter" style={{ background: 'linear-gradient(135deg, #d1f5ffff 0%, #f3e7e9 100%)' }}>
      <AnimatePresence mode="wait">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-xl shadow-2xl p-8 md:p-10 w-full max-w-md transform transition-all duration-300 ease-in-out hover:shadow-3xl"
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold text-center text-gray-800 mb-8"
          ></motion.h2>

          {/* Social Login Buttons */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3,
                },
              },
            }}
            className="space-y-4 mb-6"
          >
            <motion.button
              variants={itemVariants}
              onClick={handleGoogleSignIn}
              disabled={loading.provider === "google" && loading.loading}
              className="disabled:cursor-progress w-full flex items-center justify-center gap-5 px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
            >
              {loading.provider == "google" && loading.loading ? (
                <LoadingSpinner
                  variant="spinner"
                  color=""
                  className="text-indigo-600"
                />
              ) : (
                <span className="flex items-center justify-between">
                  <GoogleIcon />
                  Continue with Google
                </span>
              )}
            </motion.button>
            <motion.button
              variants={itemVariants}
              onClick={handleGithubSignIn}
              disabled={loading.provider === "github" && loading.loading}
              className="disabled:cursor-progress w-full flex items-center justify-center gap-5 px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
            >
              {loading.provider == "github" && loading.loading ? (
                <LoadingSpinner
                  variant="spinner"
                  color=""
                  className="text-indigo-600"
                />
              ) : (
                <span className="flex items-center justify-between">
                  <GithubIcon />
                  Continue with Github
                </span>
              )}
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="relative flex py-5 items-center"
          >
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">Or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </motion.div>

          <motion.form
            onSubmit={handleEmailSignIn}
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.6, // Delay form fields after social buttons
                },
              },
            }}
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="relative">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none text-black block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading.provider === "email" && loading.loading}
              className="disabled:cursor-progress  w-full flex justify-center gap-5 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 transform hover:scale-105"
            >
              {loading.provider == "email" && loading.loading ? (
                <LoadingSpinner
                  variant="spinner"
                  color=""
                  className="text-white"
                />
              ) : (
                <span className="flex items-center justify-between">
                  Login with Email
                </span>
              )}
            </motion.button>
          </motion.form>
          {/* Email/Password Form */}
          {/* <motion.form
            onSubmit={handleSubmit}
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.6, // Delay form fields after social buttons
                },
              },
            }}
            className="space-y-6"
          >
            {!isLogin && (
              <motion.div variants={itemVariants} className="relative">
                <label htmlFor="name" className="sr-only">Name</label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="relative">
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>

            {/* <motion.div variants={itemVariants} className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div> */}

          {/* {!isLogin && (
              <motion.div variants={itemVariants} className="relative">
                <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </motion.div>
            )} */}
          {/* 
            <motion.button
              variants={itemVariants}
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 transform hover:scale-105"
            >
              <LogIn className="h-5 w-5 mr-2" /> Sign In With Email */}
          {/* {isLogin ? (
                <>
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5 mr-2" /> Sign Up
                </>
              )} */}
          {/* </motion.button> */}
          {/* </motion.form> */}

          {/* Toggle between Login and Signup */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-6 text-center text-sm text-gray-600"
          >
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition duration-200"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition duration-200"
                >
                  Sign In
                </button>
              </p>
            )}
          </motion.div> */}

          {/* {isLogin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-4 text-center text-sm"
            >
              <Link href="/auth/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition duration-200">
                Forgot your password?
              </Link>
            </motion.div>
          )} */}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthPage;
