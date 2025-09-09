'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";

// TypeScript interfaces for the item data structure
interface Translation {
  en_us: string;
}

interface Item {
  id: string;
  title?: { translations: Translation };
  subtitle?: { translations: Translation };
  description?: { translations: Translation };
  price_info?: { price: number };
}

interface ItemClientProps {
  item: Item | null;
  storeId: string;
}

// Animation variants for the main content
const containerVariants:Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

// Animation variants for the toast notification
const toastVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { y: 50, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
};

export default function ItemClient({ item, storeId }: ItemClientProps) {
  const [showToast, setShowToast] = useState(false);

  const handleAddToOrder = () => {
    console.log("Added to order:", item);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
  };

  const gradientBackground = {
    background: 'linear-gradient(135deg, #8be6ffff 0%, #f3e7e9 100%)'
  };
  const gradientBackgroundB = {
    background: 'linear-gradient(135deg, #d6f0f7ff 0%, #f3eaebff 100%)'
  };

  return (
    <main className="min-h-screen font-serif" style={gradientBackground}>
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href={`/store/${storeId}/menu`}
            className="inline-flex items-center text-sky-700 hover:text-sky-900 font-sans font-medium transition-colors duration-200"
            aria-label="Back to menu"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="hidden sm:inline">Back to Menu</span>
          </Link>
        </div>
        
        {/* Animate the content block with Framer Motion */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          style={gradientBackgroundB}
          className="bg-white rounded-3xl shadow-xl p-6 lg:p-12"
        >
          {!item ? (
            // Elegant Skeleton Loader
            <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="aspect-square bg-gray-200 rounded-2xl w-full"></div>
              <div className="flex flex-col justify-center">
                <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-5/6 mb-8"></div>
                <div className="h-14 bg-gray-200 rounded-full w-2/3"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Section */}
              <div className="aspect-square relative w-full rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/placeholder-dish.jpg" // Placeholder image
                  alt={item.title?.translations?.en_us || "Item image"}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Details Section */}
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl lg:text-5xl font-bold text-stone-800 mb-2">
                  {item.title?.translations?.en_us || "Item"}
                </h1>
                <p className="text-stone-600 font-sans text-lg italic mb-6 leading-relaxed">
                  {item.subtitle?.translations?.en_us || "A classic dish prepared with the finest ingredients."}
                </p>
                
                {item.description?.translations?.en_us && (
                  <p className="text-stone-700 text-sm font-sans mb-6">
                    {item.description.translations.en_us}
                  </p>
                )}
                
                <p className="text-3xl font-bold text-stone-800 mb-8">
                  ${((item.price_info?.price || 0) / 100).toFixed(2)}
                </p>
                <button
                  onClick={handleAddToOrder}
                  className="w-full bg-sky-600 text-white font-bold uppercase tracking-wide px-6 py-4 rounded-full hover:bg-sky-700 transition-colors duration-200 shadow-md transform hover:scale-105"
                  aria-label={`Add ${item.title?.translations?.en_us} to order`}
                >
                  Add to Order
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* AnimatePresence for the toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-sky-600 text-white px-6 py-3 rounded-full shadow-lg"
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <span className="font-sans font-semibold">
              <span className="hidden sm:inline-block">Added to order: </span>{item?.title?.translations?.en_us}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}