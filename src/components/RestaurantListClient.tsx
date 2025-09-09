'use client';

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// TypeScript interface for the store data
interface Store {
  store_id: string;
  title: string;
  description: string;
  name: string;
}

// Props for the client component
interface RestaurantListClientProps {
  stores: Store[];
  error: string | null;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function RestaurantListClient({ stores, error }: RestaurantListClientProps) {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-stone-800 mb-10 border-b-2 border-sky-300 pb-4 inline-block mx-auto">
        Our Featured Restaurants
      </h2>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-md">
          <p className="font-sans">{error}</p>
        </div>
      )}

      {!error && stores.length === 0 && (
        <div className="text-center text-stone-500 font-sans italic">
          No restaurants found at this time.
        </div>
      )}
      
      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {stores.length === 0 && !error
            ? Array(6)
                .fill(null)
                .map((_, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="animate-pulse bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                  >
                    <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-5/6 mb-6"></div>
                    <div className="h-12 bg-gray-200 rounded w-1/2"></div>
                  </motion.div>
                ))
            : stores.map((store) => (
                <motion.div
                  key={store.store_id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <span className="text-gray-300 font-sans italic">
                      Image Coming Soon
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-stone-800 mb-2 line-clamp-1">
                      {store.title}
                    </h3>
                    <p className="text-stone-600 font-sans mb-4 line-clamp-2 italic">
                      {store.description || "A culinary experience that awaits you."}
                    </p>
                    <div className="flex justify-between items-end">
                      <span className="text-stone-500 font-sans text-sm font-medium">
                        {store.name}
                      </span>
                      <Link
                        href={`/store/${store.store_id}/menu`}
                        className="inline-flex items-center px-6 py-3 bg-sky-600 text-white rounded-full font-bold uppercase tracking-wide text-sm hover:bg-sky-700 transition-colors duration-200 shadow-md"
                        aria-label={`View menu for ${store.name}`}
                      >
                        View Menu
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}