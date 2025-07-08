import React from 'react';
import { TrendingUp, DollarSign, Calendar, AlertTriangle, Wallet } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useCurrency } from '../context/CurrencyContext';
import { formatDate } from '../utils/calculations';

const ExpenseSummary: React.FC = () => {
  const { summary } = useExpenses();
  const { formatAmount } = useCurrency();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Spent</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{formatAmount(summary.total)}</p>
          </div>
          <div className="p-2 bg-blue-100 rounded-md">
            <DollarSign size={24} className="text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Monthly Salary</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{formatAmount(summary.monthlySalary)}</p>
          </div>
          <div className="p-2 bg-green-100 rounded-md">
            <Wallet size={24} className="text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Remaining Budget</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{formatAmount(summary.remainingBudget)}</p>
          </div>
          <div className="p-2 bg-indigo-100 rounded-md">
            <Calendar size={24} className="text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-purple-500 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Highest Expense</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {summary.highestExpense 
                ? formatAmount(summary.highestExpense.amount) 
                : formatAmount(0)}
            </p>
            {summary.highestExpense && (
              <p className="mt-1 text-xs text-gray-500">
                {summary.highestExpense.description} ({formatDate(summary.highestExpense.date)})
              </p>
            )}
          </div>
          <div className="p-2 bg-purple-100 rounded-md">
            <TrendingUp size={24} className="text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-amber-500 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Recent Expense</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {summary.recentExpense 
                ? formatAmount(summary.recentExpense.amount) 
                : formatAmount(0)}
            </p>
            {summary.recentExpense && (
              <p className="mt-1 text-xs text-gray-500">
                {summary.recentExpense.description} ({summary.recentExpense.category})
              </p>
            )}
          </div>
          <div className="p-2 bg-amber-100 rounded-md">
            <AlertTriangle size={24} className="text-amber-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummary;