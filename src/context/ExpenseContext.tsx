import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, Category, ExpenseSummary, Salary } from '../types';
import { getStoredExpenses, storeExpenses, getStoredCategories, storeCategories, getStoredSalaries, storeSalaries } from '../utils/localStorage';
import { calculateSummary } from '../utils/calculations';

interface ExpenseContextType {
  expenses: Expense[];
  categories: Category[];
  salaries: Salary[];
  summary: ExpenseSummary;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addSalary: (salary: Omit<Salary, 'id'>) => void;
  updateSalary: (salary: Salary) => void;
  deleteSalary: (id: string) => void;
  filteredExpenses: Expense[];
  setFilter: (filter: ExpenseFilter) => void;
}

interface ExpenseFilter {
  category?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary>({
    total: 0,
    average: 0,
    highestExpense: null,
    recentExpense: null,
    categoryTotals: {},
    monthlySalary: 0,
    remainingBudget: 0,
  });
  const [filter, setFilter] = useState<ExpenseFilter>({});
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    setExpenses(getStoredExpenses());
    setCategories(getStoredCategories());
    setSalaries(getStoredSalaries());
  }, []);

  // Update summary and apply filter when expenses, salaries, or filter change
  useEffect(() => {
    setSummary(calculateSummary(expenses, salaries));
    applyFilter();
  }, [expenses, salaries, filter]);

  // Save expenses to localStorage when they change
  useEffect(() => {
    storeExpenses(expenses);
  }, [expenses]);

  // Store categories when they change
  useEffect(() => {
    storeCategories(categories);
  }, [categories]);

  // Store salaries when they change
  useEffect(() => {
    storeSalaries(salaries);
  }, [salaries]);

  // Apply filters to expenses
  const applyFilter = () => {
    let result = [...expenses];

    if (filter.category) {
      result = result.filter(expense => expense.category === filter.category);
    }

    if (filter.startDate) {
      result = result.filter(expense => expense.date >= filter.startDate);
    }

    if (filter.endDate) {
      result = result.filter(expense => expense.date <= filter.endDate);
    }

    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      result = result.filter(expense =>
        expense.description.toLowerCase().includes(term) ||
        expense.category.toLowerCase().includes(term)
      );
    }

    setFilteredExpenses(result);
  };

  // Expense management
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: uuidv4() };
    setExpenses(prev => [...prev, newExpense]);
  };

  const updateExpense = (updatedExpense: Expense) => {
    setExpenses(prev =>
      prev.map(expense =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  // Category management
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: uuidv4() };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(prev =>
      prev.map(category =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
  };

  // Salary management
  const addSalary = (salary: Omit<Salary, 'id'>) => {
    const newSalary = { ...salary, id: uuidv4() };
    setSalaries(prev => [...prev, newSalary]);
  };

  const updateSalary = (updatedSalary: Salary) => {
    setSalaries(prev =>
      prev.map(salary =>
        salary.id === updatedSalary.id ? updatedSalary : salary
      )
    );
  };

  const deleteSalary = (id: string) => {
    setSalaries(prev => prev.filter(salary => salary.id !== id));
  };

  const value = {
    expenses,
    categories,
    salaries,
    summary,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    updateCategory,
    deleteCategory,
    addSalary,
    updateSalary,
    deleteSalary,
    filteredExpenses,
    setFilter,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};