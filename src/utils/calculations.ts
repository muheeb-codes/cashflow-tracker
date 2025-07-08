import { Expense, ExpenseSummary, Salary } from '../types';

export const calculateSummary = (expenses: Expense[], salaries: Salary[]): ExpenseSummary => {
  // Calculate total expenses
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Find highest expense
  const highestExpense = expenses.length > 0 
    ? [...expenses].sort((a, b) => b.amount - a.amount)[0]
    : null;
  
  // Find most recent expense
  const recentExpense = expenses.length > 0
    ? [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;
  
  // Calculate average (per day if there are multiple days)
  const uniqueDays = new Set(expenses.map(e => e.date.split('T')[0])).size;
  const average = uniqueDays > 0 ? total / uniqueDays : total;
  
  // Calculate totals by category
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(expense => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }
    categoryTotals[expense.category] += expense.amount;
  });

  // Calculate monthly salary (most recent)
  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  
  const monthlySalary = salaries
    .filter(salary => salary.date.startsWith(currentMonth))
    .reduce((sum, salary) => sum + salary.amount, 0);

  // Calculate remaining budget
  const monthlyExpenses = expenses
    .filter(expense => expense.date.startsWith(currentMonth))
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const remainingBudget = monthlySalary - monthlyExpenses;
  
  return {
    total,
    average,
    highestExpense,
    recentExpense,
    categoryTotals,
    monthlySalary,
    remainingBudget,
  };
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getExpensesByMonth = (expenses: Expense[]) => {
  const monthlyData: Record<string, number> = {};
  
  expenses.forEach(expense => {
    const month = expense.date.substring(0, 7); // Format: YYYY-MM
    if (!monthlyData[month]) {
      monthlyData[month] = 0;
    }
    monthlyData[month] += expense.amount;
  });
  
  return Object.entries(monthlyData)
    .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
    .map(([month, total]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      total
    }));
};