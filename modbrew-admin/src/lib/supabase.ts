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
export const supabase = createClient<{
  public: {
    Tables: {
      expenses: {
        Row: Expense;
        Insert: Omit<Expense, 'id'>;
        Update: Partial<Omit<Expense, 'id'>>;
      };
      daily_sales: {
        Row: DailySale;
        Insert: Omit<DailySale, 'id'>;
        Update: Partial<Omit<DailySale, 'id'>>;
      };
    };
  };
}>(supabaseUrl, supabaseAnonKey);
