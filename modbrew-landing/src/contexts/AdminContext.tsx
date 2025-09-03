import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

// Types for our admin data
interface DailySale {
  id: number;
  sales_date: string;
  customer_count: number;
  gross_sales: number;
}

interface Expense {
  id: number;
  purchased_at: string;
  item_name: string;
  price: number;
  purchaser: 'mary' | 'will' | 'ben';
}

interface Membership {
  id: string;
  user_id: string;
  name?: string;
  email: string;
  role: 'customer' | 'admin';
  membership_type: 'basic' | 'premium' | 'vip';
  status: 'active' | 'inactive' | 'cancelled';
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

interface AdminStats {
  totalRevenue: number;
  totalCustomers: number;
  totalMembers: number;
  newMembersThisWeek: number;
  totalProfit: number;
  averageOrderValue: number;
  totalExpenses: number;
  netProfit: number;
}

interface AdminData {
  dailySales: DailySale[];
  expenses: Expense[];
  memberships: Membership[];
  stats: AdminStats;
  isLoading: boolean;
  error: string | null;
}

interface AdminContextType {
  adminData: AdminData;
  refreshSales: () => Promise<void>;
  refreshExpenses: () => Promise<void>;
  refreshMemberships: () => Promise<void>;
  refreshAllData: () => Promise<void>;
  addDailySale: (sale: Omit<DailySale, 'id'>) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
}

const defaultAdminData: AdminData = {
  dailySales: [],
  expenses: [],
  memberships: [],
  stats: {
    totalRevenue: 0,
    totalCustomers: 0,
    totalMembers: 0,
    newMembersThisWeek: 0,
    totalProfit: 0,
    averageOrderValue: 0,
    totalExpenses: 0,
    netProfit: 0
  },
  isLoading: true,
  error: null
};

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [adminData, setAdminData] = useState<AdminData>(defaultAdminData);

  // Calculate stats from raw data
  const calculateStats = (sales: DailySale[], expenses: Expense[], memberships: Membership[]): AdminStats => {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.gross_sales, 0);
    const totalCustomers = sales.reduce((sum, sale) => sum + sale.customer_count, 0);
    const totalMembers = memberships.length;
    
    // Calculate new members this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newMembersThisWeek = memberships.filter(membership => 
      new Date(membership.created_at) >= oneWeekAgo
    ).length;
    
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.price, 0);
    const totalProfit = totalRevenue - totalExpenses;
    const averageOrderValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
    const netProfit = totalProfit; // Same as totalProfit for consistency

    return {
      totalRevenue,
      totalCustomers,
      totalMembers,
      newMembersThisWeek,
      totalProfit,
      averageOrderValue,
      totalExpenses,
      netProfit
    };
  };

  // Fetch all sales data
  const fetchSales = async () => {
    try {
      const { data: sales, error } = await supabase
        .from('daily_sales')
        .select('*')
        .order('sales_date', { ascending: false });

      if (error) throw error;

      return sales || [];
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }
  };

  // Fetch all expenses data
  const fetchExpenses = async () => {
    try {
      const { data: expenses, error } = await supabase
        .from('expenses')
        .select('*')
        .order('purchased_at', { ascending: false });

      if (error) throw error;

      return expenses || [];
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  };

  // Fetch all memberships data
  const fetchMemberships = async () => {
    try {
      const { data: memberships, error } = await supabase
        .from('memberships')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return memberships || [];
    } catch (error) {
      console.error('Error fetching memberships:', error);
      throw error;
    }
  };

  // Load all data on initial mount
  const loadAllData = async () => {
    try {
      setAdminData(prev => ({ ...prev, isLoading: true, error: null }));

      // Fetch all data in parallel
      const [sales, expenses, memberships] = await Promise.all([
        fetchSales(),
        fetchExpenses(),
        fetchMemberships()
      ]);

      const stats = calculateStats(sales, expenses, memberships);

      setAdminData({
        dailySales: sales,
        expenses: expenses,
        memberships: memberships,
        stats,
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Error loading admin data:', error);
      setAdminData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load data'
      }));
    }
  };

  // Refresh sales data
  const refreshSales = async () => {
    try {
      const sales = await fetchSales();
      const stats = calculateStats(sales, adminData.expenses, adminData.memberships);
      
      setAdminData(prev => ({
        ...prev,
        dailySales: sales,
        stats
      }));
    } catch (error) {
      console.error('Error refreshing sales:', error);
      toast.error('Failed to refresh sales data');
    }
  };

  // Refresh expenses data
  const refreshExpenses = async () => {
    try {
      const expenses = await fetchExpenses();
      const stats = calculateStats(adminData.dailySales, expenses, adminData.memberships);
      
      setAdminData(prev => ({
        ...prev,
        expenses: expenses,
        stats
      }));
    } catch (error) {
      console.error('Error refreshing expenses:', error);
      toast.error('Failed to refresh expenses data');
    }
  };

  // Refresh memberships data
  const refreshMemberships = async () => {
    try {
      const memberships = await fetchMemberships();
      const stats = calculateStats(adminData.dailySales, adminData.expenses, memberships);
      
      setAdminData(prev => ({
        ...prev,
        memberships: memberships,
        stats
      }));
    } catch (error) {
      console.error('Error refreshing memberships:', error);
      toast.error('Failed to refresh memberships data');
    }
  };

  // Refresh all data
  const refreshAllData = async () => {
    await loadAllData();
  };

  // Add new daily sale
  const addDailySale = async (sale: Omit<DailySale, 'id'>) => {
    try {
      const { error } = await supabase
        .from('daily_sales')
        .insert(sale);

      if (error) throw error;

      toast.success('Daily sale added successfully!');
      await refreshSales(); // Refresh to get updated data
    } catch (error) {
      console.error('Error adding daily sale:', error);
      toast.error('Error adding daily sale: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  // Add new expense
  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .insert(expense);

      if (error) throw error;

      toast.success('Expense added successfully!');
      await refreshExpenses(); // Refresh to get updated data
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Error adding expense: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    // Subscribe to sales changes
    const salesSubscription = supabase
      .channel('sales_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_sales',
        },
        () => {
          refreshSales();
        }
      )
      .subscribe();

    // Subscribe to expense changes
    const expensesSubscription = supabase
      .channel('expenses_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses',
        },
        () => {
          refreshExpenses();
        }
      )
      .subscribe();

    // Subscribe to membership changes
    const membershipsSubscription = supabase
      .channel('memberships_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'memberships',
        },
        () => {
          refreshMemberships();
        }
      )
      .subscribe();

    return () => {
      salesSubscription.unsubscribe();
      expensesSubscription.unsubscribe();
      membershipsSubscription.unsubscribe();
    };
  }, []);

  const value: AdminContextType = {
    adminData,
    refreshSales,
    refreshExpenses,
    refreshMemberships,
    refreshAllData,
    addDailySale,
    addExpense
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
