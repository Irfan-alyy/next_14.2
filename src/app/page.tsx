import Image from "next/image";
import { uberFetch } from "@/lib/uber";
import RestaurantListClient from "@/components/FeaturedRestaurantListClient";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// TypeScript interface for the store data
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
}

export default async function Home() {
  let stores: Store[] = [];
  let error: string | null = null;

  try {
    const data = await uberFetch("/v1/eats/stores");
    stores = data.stores || [];
  } catch (err) {
    console.log(err);
    error = "Failed to load restaurants. Please try again later.";
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/hero-restaurant.jpg"
            alt="Premium restaurant interior"
            fill
            className="object-cover brightness-75"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Discover Amazing
            <span className="block text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Flavors
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Premium dining experiences delivered to your doorstep. Explore the finest restaurants in your city.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/restaurants">
              <button className="btn-hero group inline-flex items-center px-6 py-3 bg-sky-600 text-white rounded-full font-bold uppercase tracking-wide text-sm hover:bg-sky-700 transition-colors duration-200 shadow-md">
                Explore Restaurants
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>
            <button className="inline-flex items-center px-6 py-3 bg-white/10 border-white/30 text-white rounded-full font-bold uppercase tracking-wide text-sm hover:bg-white/20 backdrop-blur-sm transition-colors duration-200">
              View Menu
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Restaurant List and Features */}
      <RestaurantListClient stores={stores} error={error} />
    </main>
  );
}