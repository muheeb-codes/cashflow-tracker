import { Expense, Category, Salary } from '../types';

const EXPENSES_KEY = 'expense-tracker-expenses';
const CATEGORIES_KEY = 'expense-tracker-categories';
const SALARIES_KEY = 'expense-tracker-salaries';

// Expense Storage
export const getStoredExpenses = (): Expense[] => {
  const storedData = localStorage.getItem(EXPENSES_KEY);
  return storedData ? JSON.parse(storedData) : [];
};

export const storeExpenses = (expenses: Expense[]): void => {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
};

// Category Storage
export const getStoredCategories = (): Category[] => {
  const storedData = localStorage.getItem(CATEGORIES_KEY);
  if (storedData) {
    return JSON.parse(storedData);
  }
  
  // Default categories if none exist
  const defaultCategories: Category[] = [
    { id: '1', name: 'Food', color: '#EF4444' },
    { id: '2', name: 'Transport', color: '#3B82F6' },
    { id: '3', name: 'Entertainment', color: '#EC4899' },
    { id: '4', name: 'Shopping', color: '#8B5CF6' },
    { id: '5', name: 'Housing', color: '#10B981' },
    { id: '6', name: 'Utilities', color: '#F59E0B' },
    { id: '7', name: 'Healthcare', color: '#06B6D4' },
    { id: '8', name: 'Other', color: '#6B7280' },
  ];
  
  storeCategories(defaultCategories);
  return defaultCategories;
};

export const storeCategories = (categories: Category[]): void => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

// Salary Storage
export const getStoredSalaries = (): Salary[] => {
  const storedData = localStorage.getItem(SALARIES_KEY);
  return storedData ? JSON.parse(storedData) : [];
};

export const storeSalaries = (salaries: Salary[]): void => {
  localStorage.setItem(SALARIES_KEY, JSON.stringify(salaries));
};