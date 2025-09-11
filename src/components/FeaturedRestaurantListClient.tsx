"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Star, MapPin, Clock, ChefHat } from "lucide-react";

// TypeScript interface for the store data
interface Store {
  store_id: string;
  name: string;
  description?:string;
  merchant_store_id: string;
  partner_store_id: string;
  avg_prep_time: number;
  contact_emails: string[];
  location: {
    address: string;
    address_2: string;
    city: string;
    country: string;
    postal_code: string;
  };
  pos_data: {
    integration_enabled: boolean;
  };
  price_bucket: string;
  raw_hero_url: string;
  status: string;
  timezone: string;
  web_url: string;
}

// Props for the client component
interface RestaurantListClientProps {
  stores: Store[];
  error: string | null;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function RestaurantListClient({ stores, error }: RestaurantListClientProps) {
  return (
    <div className="min-h-screen">
      {/* Featured Restaurants Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Featured Restaurants
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Handpicked premium dining experiences that deliver exceptional flavors right to your door
            </p>
          </motion.div>

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
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
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
                        <div className="h-48 bg-gray-200 rounded mb-4"></div>
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
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="card-restaurant group overflow-hidden h-full">
                        <div className="relative h-48 overflow-hidden">
                          {store.raw_hero_url ? (
                            <Image
                              src={store.raw_hero_url}
                              alt={store.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <span className="text-gray-300 font-sans italic">
                                Image Coming Soon
                              </span>
                            </div>
                          )}
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">N/A</span>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-xl font-bold">{store.name}</h3>
                            <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                              {store.price_bucket}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {store?.description || "A culinary experience that awaits you."}
                          </p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{store.location.address || "Location N/A"}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{store.avg_prep_time ? `${store.avg_prep_time} min` : "Delivery N/A"}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/restaurants">
              <button className="inline-flex items-center px-6 py-3 bg-white/10 border-white/30 text-stone-800 rounded-full font-bold uppercase tracking-wide text-sm hover:bg-white/20 backdrop-blur-sm transition-colors duration-200 hover-lift">
                View All Restaurants
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: ChefHat,
                title: "Premium Quality",
                description: "Carefully curated restaurants with the highest standards for food quality and service.",
              },
              {
                icon: Clock,
                title: "Fast Delivery",
                description: "Quick and reliable delivery service that ensures your food arrives fresh and hot.",
              },
              {
                icon: Star,
                title: "Top Rated",
                description: "Only the best-rated restaurants make it to our platform, ensuring exceptional experiences.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}