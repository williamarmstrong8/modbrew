import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Types for our data
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
  purchaser: string;
}

interface SalesStats {
  totalRevenue: number;
  totalCustomers: number;
  avgOrderValue: number;
  weeklyRevenue: number;
  weeklyCustomers: number;
  todayCustomers: number;
}

interface ExpenseStats {
  totalExpenses: number;
  monthlyExpenses: number;
  weeklyExpenses: number;
  avgDailyExpenses: number;
}

type ModBrewData = {
  // Sales data
  sales: DailySale[];
  salesStats: SalesStats;
  salesLoading: boolean;
  salesError: string | null;
  
  // Expenses data
  expenses: Expense[];
  expenseStats: ExpenseStats;
  expensesLoading: boolean;
  expensesError: string | null;
};

type ModBrewContextType = {
  data: ModBrewData | null;
  isLoading: boolean;
  error: string | null;
  refreshSales: () => Promise<void>;
  refreshExpenses: () => Promise<void>;
  refreshAll: () => Promise<void>;
};

const defaultModBrewData: ModBrewData = {
  sales: [],
  salesStats: {
    totalRevenue: 0,
    totalCustomers: 0,
    avgOrderValue: 0,
    weeklyRevenue: 0,
    weeklyCustomers: 0,
    todayCustomers: 0,
  },
  salesLoading: true,
  salesError: null,
  expenses: [],
  expenseStats: {
    totalExpenses: 0,
    monthlyExpenses: 0,
    weeklyExpenses: 0,
    avgDailyExpenses: 0,
  },
  expensesLoading: true,
  expensesError: null,
};

const ModBrewContext = createContext<ModBrewContextType | null>(null);

export const ModBrewProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<ModBrewData>(defaultModBrewData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper functions for setting loading/success/error states
  const setSalesLoading = () => {
    setData(prev => ({ ...prev, salesLoading: true, salesError: null }));
  };

  const setSalesSuccess = (sales: DailySale[], stats: SalesStats) => {
    setData(prev => ({
      ...prev,
      sales,
      salesStats: stats,
      salesLoading: false,
      salesError: null
    }));
  };

  const setSalesError = (error: string) => {
    setData(prev => ({
      ...prev,
      sales: [],
      salesStats: defaultModBrewData.salesStats,
      salesLoading: false,
      salesError: error
    }));
  };

  const setExpensesLoading = () => {
    setData(prev => ({ ...prev, expensesLoading: true, expensesError: null }));
  };

  const setExpensesSuccess = (expenses: Expense[], stats: ExpenseStats) => {
    setData(prev => ({
      ...prev,
      expenses,
      expenseStats: stats,
      expensesLoading: false,
      expensesError: null
    }));
  };

  const setExpensesError = (error: string) => {
    setData(prev => ({
      ...prev,
      expenses: [],
      expenseStats: defaultModBrewData.expenseStats,
      expensesLoading: false,
      expensesError: error
    }));
  };

  // Calculate sales statistics
  const calculateSalesStats = (sales: DailySale[]): SalesStats => {
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.gross_sales || 0), 0);
    const totalCustomers = sales.reduce((sum, sale) => sum + (sale.customer_count || 0), 0);
    const avgOrderValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

    // Calculate today's customers
    const today = new Date().toISOString().split('T')[0];
    const todaySale = sales.find(sale => sale.sales_date === today);
    const todayCustomers = todaySale?.customer_count || 0;

    // Calculate weekly stats (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklySales = sales.filter(sale => {
      const saleDate = new Date(sale.sales_date);
      return saleDate >= weekAgo;
    });
    
    const weeklyRevenue = weeklySales.reduce((sum, sale) => sum + (sale.gross_sales || 0), 0);
    const weeklyCustomers = weeklySales.reduce((sum, sale) => sum + (sale.customer_count || 0), 0);

    return {
      totalRevenue,
      totalCustomers,
      avgOrderValue,
      weeklyRevenue,
      weeklyCustomers,
      todayCustomers,
    };
  };

  // Calculate expense statistics
  const calculateExpenseStats = (expenses: Expense[]): ExpenseStats => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.price || 0), 0);

    // Calculate monthly expenses (current month)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyData = expenses.filter(expense => {
      const expenseDate = new Date(expense.purchased_at);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
    
    const monthlyExpenses = monthlyData.reduce((sum, expense) => sum + (expense.price || 0), 0);

    // Calculate weekly expenses (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyData = expenses.filter(expense => {
      const expenseDate = new Date(expense.purchased_at);
      return expenseDate >= weekAgo;
    });
    
    const weeklyExpenses = weeklyData.reduce((sum, expense) => sum + (expense.price || 0), 0);

    // Calculate average daily expenses
    const daysWithExpenses = new Set(expenses.map(expense => 
      new Date(expense.purchased_at).toDateString()
    )).size;
    
    const avgDailyExpenses = daysWithExpenses > 0 ? totalExpenses / daysWithExpenses : 0;

    return {
      totalExpenses,
      monthlyExpenses,
      weeklyExpenses,
      avgDailyExpenses,
    };
  };

  // Fetch sales data
  const fetchSales = async () => {
    setSalesLoading();
    try {
      const { data: salesData, error } = await supabase
        .from('daily_sales')
        .select('*')
        .order('sales_date', { ascending: false });

      if (error) {
        console.error('Error fetching sales data:', error);
        throw error;
      }

      const sales = (salesData as DailySale[]) || [];
      const stats = calculateSalesStats(sales);
      setSalesSuccess(sales, stats);
    } catch (err) {
      console.error('Error in fetchSales:', err);
      setSalesError(err instanceof Error ? err.message : 'Failed to fetch sales data');
    }
  };

  // Fetch expenses data
  const fetchExpenses = async () => {
    setExpensesLoading();
    try {
      const { data: expensesData, error } = await supabase
        .from('expenses')
        .select('*')
        .order('purchased_at', { ascending: false });

      if (error) {
        console.error('Error fetching expenses data:', error);
        throw error;
      }

      const expenses = (expensesData as Expense[]) || [];
      const stats = calculateExpenseStats(expenses);
      setExpensesSuccess(expenses, stats);
    } catch (err) {
      console.error('Error in fetchExpenses:', err);
      setExpensesError(err instanceof Error ? err.message : 'Failed to fetch expenses data');
    }
  };

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch both sales and expenses data in parallel
      await Promise.all([
        fetchSales(),
        fetchExpenses(),
      ]);

    } catch (err) {
      console.error('Error fetching all data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh functions
  const refreshSales = async () => {
    await fetchSales();
  };

  const refreshExpenses = async () => {
    await fetchExpenses();
  };

  const refreshAll = async () => {
    await fetchAllData();
  };

  // Load data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const contextValue: ModBrewContextType = {
    data,
    isLoading,
    error,
    refreshSales,
    refreshExpenses,
    refreshAll,
  };

  return (
    <ModBrewContext.Provider value={contextValue}>
      {children}
    </ModBrewContext.Provider>
  );
};

// Custom hook to use the context
export const useModBrew = () => {
  const context = useContext(ModBrewContext);
  if (!context) {
    throw new Error('useModBrew must be used within a ModBrewProvider');
  }
  return context;
};
