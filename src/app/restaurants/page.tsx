import { uberFetch } from "@/lib/uber";
import RestaurantListClient from "@/components/RestaurantList";

// Updated TypeScript interface for the store data based on API response
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

export default async function RestaurantsPage() {
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
    <>
      <RestaurantListClient stores={stores} error={error} />
    </>
  );
}