"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Search, Filter, ChefHat } from "lucide-react";
import Image from "next/image";

// Updated TypeScript interface for the store data
interface Store {
  store_id: string;
  name: string;
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
  // Optional fields to match UI (if API provides them, otherwise use defaults)
  description?: string;
  cuisine?: string;
  rating?: number;
  tags?: string[];
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
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function RestaurantListClient({ stores, error }: RestaurantListClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");

  // Map API stores to restaurant-like structure for UI consistency
  
  const restaurants = stores.map((store) => ({
    id: store.store_id,
    name: store.name,
    cuisine: store.cuisine || "Various", // Default if not provided
    rating: store.rating || 4.5, // Default rating
    deliveryTime: store.avg_prep_time ? `${store.avg_prep_time}-45 min` : "30-45 min", // Use avg_prep_time
    image: store.raw_hero_url,
    location: store.location.address || store.location.city || "Nearby",
    description: store.description || `${store.name} offers delicious meals ready for delivery.`,
    priceRange: store.price_bucket || "$$",
    deliveryFee: store.pos_data.integration_enabled ? "Free" : "$2.99", // Example mapping
    tags: store.tags || ["Delivery", "Fresh"], // Default tags
  }));

  // Available cuisines (from hardcoded + dynamic if API provides)
  const cuisines = ["All", ...new Set(restaurants.map((r) => r.cuisine))];

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCuisine = selectedCuisine === "All" || restaurant.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Discover Restaurants
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our selected restaurants and get your favorite food delivered fresh to your door
          </p>
        </motion.div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-md">
            <p className="font-sans">{error}</p>
          </div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search restaurants, cuisines, or dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="hover-lift">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Cuisine Filter */}
          <div className="flex flex-wrap gap-2">
            {cuisines.map((cuisine) => (
              <Button
                key={cuisine}
                variant={selectedCuisine === cuisine ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCuisine(cuisine)}
                className="hover-lift"
              >
                {cuisine}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <p className="text-muted-foreground">
            {filteredRestaurants.length} restaurants found
          </p>
        </motion.div>

        {/* Restaurant Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredRestaurants.map((restaurant) => (
            <motion.div
              key={restaurant.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Link href={`/store/${restaurant.id}/menu`}>
                <Card className="card-restaurant group h-full overflow-hidden cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    {restaurant.image ? (
                      <Image
                        src={restaurant.image}
                        alt={restaurant.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          console.error(`Image load failed for ${restaurant.name}:`, e);
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-300 italic">Image Coming Soon</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <span className="text-xs font-medium text-primary">{restaurant.priceRange}</span>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{restaurant.rating}</span>
                    </div>
                    {restaurant.deliveryFee === "Free" && (
                      <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Free Delivery
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold">{restaurant.name}</h3>
                      <Badge variant="secondary">{restaurant.cuisine}</Badge>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {restaurant.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {restaurant.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{restaurant.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                    </div>

                    {restaurant.deliveryFee !== "Free" && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Delivery: {restaurant.deliveryFee}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredRestaurants.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No restaurants found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}