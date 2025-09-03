import { createClient } from '@supabase/supabase-js';

declare global {
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Define types for our database schema
export type Membership = {
  id: string;
  user_id: string;
  name?: string;
  email: string;
  role: string;
  membership_type: string;
  status: string;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
};

export type Expense = {
  id: number;
  purchased_at: string;
  item_name: string;
  price: number;
  purchaser: 'mary' | 'will' | 'ben';
};

export type DailySale = {
  id: number;
  sales_date: string;
  customer_count: number;
  gross_sales: number;
};

export type WeeklyChallenge = {
  id: string;
  user_id: string;
  challenge_name: string;
  status: string;
  photo_urls: string[];
  submitted_at: string;
  created_at: string;
};

export type UserProfile = {
  id: string;
  user_id: string;
  name?: string;
  email?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
