import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  property_type: string;
  status: string;
  amenities: string[];
  images: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  user_id: string | null;
  message: string;
  response: string;
  created_at: string;
};
