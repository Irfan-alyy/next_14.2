import { uberFetch } from "@/lib/uber";
import MenuClient from "@/components/MenuClient";

// TypeScript interfaces to match your API data structure
interface Translation {
  en_us: string;
}

interface Item {
  id: string;
  title: { translations: Translation };
  subtitle: { translations: Translation };
  price_info: { price: number };
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

// Props for the Server Component
interface StorePageProps {
  params: {
    storeId: string;
  };
}

export default async function StorePage({ params }: StorePageProps) {
  let menu: MenuData = { categories: [], items: [], title: { translations: { en_us: "The Menu" } } };
  let error: string | null = null;
  const { storeId } = params;

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/uber_eats/${storeId}/items`);
    const data= await response.json()
    menu= data?.menu
  } catch (err) {
    console.error("Failed to fetch menu:", err);
    error = "Failed to load menu. Please try again later.";
  }
  return (
    <main className="min-h-screen font-serif ">
      {/* Hero Section - This can remain a server component */}
      <header className="relative w-full h-64  flex items-center justify-center text-center overflow-hidden shadow-md">
        <div className="absolute inset-0  opacity-80 z-0"></div>
        <div className="relative z-10 px-4 text-white">
          <h1 className="text-5xl md:text-6xl mt-10 font-bold text-gradient tracking-wide drop-shadow-lg">
            {menu.title?.translations?.en_us || "The Menu"}
          </h1>
          <p className="text-xl text-black md:text-2xl font-sans opacity-90 mt-2">
            A curated selection of our finest dishes.
          </p>
        </div>
      </header>

      {/* Render the MenuClient component with fetched data */}
      <MenuClient storeId={storeId} menu={menu} error={error} />
    </main>
  );
}