import Image from "next/image";
import { uberFetch } from "@/lib/uber";
import RestaurantListClient from "@/components/RestaurantListClient";

// TypeScript interface for the store data
interface Store {
  store_id: string;
  title: string;
  description: string;
  name: string;
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
    <main
      className="min-h-screen font-serif"
      style={{
        background: "linear-gradient(135deg, #56d6faff 0%, #f3e7e9 100%)",
      }}
    >
      {/* Hero Section - This can remain a server component */}
      <header className="relative w-full h-80 flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/logo.jpg"
          alt="Elegant restaurant setting"
          fill
          className="object-cover brightness-75"
        />
        <div className="relative z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-wide drop-shadow-lg">
            Savor the Moment
          </h1>
          <p className="text-xl md:text-2xl text-white font-sans drop-shadow-lg">
            Discover a curated collection of local culinary delights.
          </p>
        </div>
      </header>

      {/* The client component handles the rest of the page */}
      <RestaurantListClient stores={stores} error={error} />
    </main>
  );
}