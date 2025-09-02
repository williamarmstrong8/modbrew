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
export type Profile = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role: 'customer' | 'admin';
  created_at: string;
  updated_at: string;
};

export type Membership = {
  id: string;
  user_id: string;
  membership_type: 'basic' | 'premium' | 'vip';
  status: 'active' | 'inactive' | 'cancelled';
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

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
