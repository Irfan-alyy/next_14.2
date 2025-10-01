"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

// TypeScript interfaces for the data structure
interface Translation {
  en_us: string;
}

interface Item {
  id: string;
  title: { translations: Translation };
  description: { translations: Translation };
  price_info: { price: number };
  image_url:string
}

interface CategoryEntity {
  id: string;
}

interface Category {
  id: string;
  title: { translations: Translation };
  entities: CategoryEntity[];
}

interface MenuData {
  categories: Category[];
  items: Item[];
  title: { translations: Translation };
}

interface MenuClientProps {
  storeId: string;
  menu: MenuData;
  error: string | null;
}

// Animation variants for menu categories and items
const categoryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function MenuClient({ storeId, menu, error }: MenuClientProps) {
  const { data } = useSession();
  console.log("menu item", menu);
  
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Back to restaurants link */}
      <div className="flex justify-between items-center mb-10">
        <Link
          href="/"
          className="inline-flex items-center text-sky-700 hover:text-sky-900 font-sans font-medium transition-colors duration-200"
          aria-label="Back to store list"
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
          <span className="hidden sm:inline">Back to Restaurants</span>
        </Link>
        {data?.user? (
          <Link
            href={`/store/${storeId}/add-menu`}
            className="inline-flex items-center px-6 py-3 bg-sky-600 text-white rounded-full font-bold uppercase tracking-wide text-sm hover:bg-sky-700 transition-colors duration-200 shadow-md"
            aria-label="Add New Items to Menu"
          >
            Add Item
          </Link>
        ):
        <Link
            href={`/auth/signin`}
            className="inline-flex items-center px-6 py-3 bg-sky-600 text-white rounded-full font-bold uppercase tracking-wide text-sm hover:bg-sky-700 transition-colors duration-200 shadow-md"
            aria-label="Add New Items to Menu"
          >
            Login
          </Link>
        }
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-md">
          <p className="font-sans">{error}</p>
        </div>
      )}

      {!error && (!menu?.categories || menu.categories.length === 0) && (
        <div className="text-center text-stone-500 font-sans italic">
          No menu items are available at this time.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {!error &&
          menu?.categories?.map((cat) => (
            <motion.section
              key={cat.id}
              className="mb-8"
              initial="hidden"
              animate="visible"
              variants={categoryVariants}
            >
              <h2 className="text-3xl font-bold text-stone-800 mb-6 border-b-2 border-sky-300 pb-2">
                {cat.title?.translations?.en_us || "Category"}
              </h2>
              <motion.ul
                className="grid grid-cols-1 gap-6"
                variants={categoryVariants}
              >
                {cat.entities?.length === 0
                  ? Array(3)
                      .fill(null)
                      .map((_, index) => (
                        <motion.li
                          key={index}
                          variants={itemVariants}
                          className="animate-pulse flex items-center p-4 rounded-lg shadow-sm border border-gray-100 bg-white"
                        >
                          <div className="h-20 w-20 bg-gray-200 rounded-lg mr-4"></div>
                          <div className="flex-1">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </motion.li>
                      ))
                  : cat.entities?.map((entity) => {
                      const item = menu.items?.find((i) => i.id === entity.id);
                      if (!item) return null;
                      return (
                        <motion.li
                          key={item.id}
                          variants={itemVariants}
                          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                          <div className="flex items-start gap-6">
                            <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                              <span className="text-gray-300 text-xs italic font-sans flex items-center justify-center h-full">
                               <img src={item?.image_url|| ""} alt="image" />
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="text-xl font-semibold text-stone-800 leading-snug">
                                  {item.title?.translations?.en_us || "Item"}
                                </h3>
                                {item.price_info?.price && (
                                  <span className="text-stone-800 font-bold text-lg font-sans flex-shrink-0 ml-4">
                                    ${(item.price_info.price / 100).toFixed(2)}
                                  </span>
                                )}
                              </div>
                              <p className="text-stone-600 font-sans text-sm italic mb-4">
                                {item.description?.translations?.en_us ||
                                  "A delicious dish to tempt your senses."}
                              </p>
                              <Link
                                href={`/store/${storeId}/menu/${item.id}`}
                                className="text-sky-600 hover:text-sky-800 font-sans font-medium text-sm transition-colors duration-200"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
              </motion.ul>
            </motion.section>
          ))}
      </div>
    </div>
  );
}
