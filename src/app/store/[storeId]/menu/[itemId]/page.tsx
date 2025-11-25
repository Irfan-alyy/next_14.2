// app/store/[storeId]/item/[itemId]/page.tsx

// This is a Server Component. It doesn't have 'use client' and runs on the server.
import ItemClient from "@/components/ItemClient"; // We import the Client Component here
import Link from "next/link";

// TypeScript interfaces to ensure data types are correct
interface Translation {
  en_us: string;
}

interface Item {
  id: string;
  title?: { translations: Translation };
  subtitle?: { translations: Translation };
  description?: { translations: Translation };
  price_info?: { price: number };
  image_url: string | null
}

// Next.js automatically passes 'params' with the URL segments
interface ItemPageProps {
  params: {
    storeId: string;
    itemId: string;
  };
}

// This function is the Server Component. It's 'async' because it fetches data.
export default async function ItemPage({ params }: ItemPageProps) {
  const { storeId, itemId } = params;

  // The server component handles all the data fetching logic.
  let item: Item | null = null;
  let error: string | null = null;

  try {
    const response= await fetch(`${process.env.API_BASE_URL}/api/uber_eats/${storeId}/items/${itemId}`)
    const data= await response.json();
    item= data?.item
  } catch (err) {
    console.error("Failed to fetch item details:", err);
    error = "Failed to load item details. Please try again later.";
  }

  // Handle errors and "item not found" on the server.
  // This sends a simple, non-interactive page to the user.
  if (error || !item) {
    return (
      <main className="min-h-screen font-serif" style={{ background: 'linear-gradient(135deg, #d1f5ffff 0%, #f3e7e9 100%)' }}>
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
            {error || "Item not found."}
          </div>
          {/* Link to navigate back, can also be a server component */}
          <Link href={`/store/${storeId}`} className="text-sky-700 hover:text-sky-900 font-medium flex items-center gap-2">
            Back to Menu
          </Link>
        </div>
      </main>
    );
  }

  // If the item is found, we pass the data down to the Client Component.
  // The Client Component handles all the interactive UI and animations.
  return <ItemClient item={item} storeId={storeId} />;
}