type PriceDetail = {
  amount: number;
  currency_code: string;
  formatted_amount: string;
};

type ItemPrice = {
  unit_price: PriceDetail;
  total_price: PriceDetail;
  base_unit_price: PriceDetail;
  base_total_price: PriceDetail;
};

type CartItem = {
  id: string;
  title: string;
  external_data: string;
  quantity: number;
  price: ItemPrice;
  selected_modifier_groups?: string; // Can be more specific if you know the structure
  special_instructions: string | null;
  instance_id: string;
  eater_id: string;
};

type Cart = {
  items: CartItem[];
  fulfillment_issues: [];
  special_instructions: string
};

type Payment = {
  charges: {
    total: PriceDetail;
    sub_total: PriceDetail;
  };
  accounting: unknown;
};

type Store = {
  id: string;
  name: string;
  integrator_store_id: string;
  integrator_brand_id: string;
};

type Eater = {
  first_name: string;
  phone: string;
  phone_code: string;
  last_name: string;
};

type EaterInfo = {
  first_name: string;
  id: string;
};

type Packaging = {
  disposable_items: {
    should_include: boolean;
  };
};

export type UberOrder = {
  id: string;
  display_id: string;
  current_state: string; // Consider using a union type: 'DENIED' | 'ACCEPTED' | 'COMPLETED' etc.
  store: Store;
  eater: Eater;
  cart: Cart;
  payment: Payment;
  placed_at: string; // ISO date string
  type: string; // Consider: 'DELIVERY_BY_UBER' | 'PICKUP' | etc.
  packaging: Packaging;
  eaters: EaterInfo[];
  brand: string; // Consider: 'UBER_EATS' | 'DOORDASH' | etc.
  deliveries: []; // Can be more specific if you know the structure
  order_manager_client_id: string;
};