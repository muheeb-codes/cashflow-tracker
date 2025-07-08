export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

export interface Salary {
  id: string;
  amount: number;
  date: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface ExpenseSummary {
  total: number;
  average: number;
  highestExpense: Expense | null;
  recentExpense: Expense | null;
  categoryTotals: Record<string, number>;
  monthlySalary: number;
  remainingBudget: number;
}

export type Currency = 'USD' | 'INR' | 'PKR';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  name: string;
  rate: number; // Exchange rate relative to USD
}