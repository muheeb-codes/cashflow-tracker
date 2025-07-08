import React, { useState } from 'react';
import { Edit2, Trash2, Search, Filter } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useCurrency } from '../context/CurrencyContext';
import { Expense } from '../types';
import { formatDate } from '../utils/calculations';

interface ExpenseListProps {
  onEdit: (expense: Expense) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ onEdit }) => {
  const { filteredExpenses, deleteExpense, categories, setFilter } = useExpenses();
  const { formatAmount } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilter(prev => ({ ...prev, searchTerm: term }));
  };

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setCategoryFilter(category);
    setFilter(prev => ({ ...prev, category: category || undefined }));
  };

  const handleDateFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
    setFilter(prev => ({ 
      ...prev, 
      [name]: value || undefined 
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setDateRange({ startDate: '', endDate: '' });
    setFilter({});
  };

  const getCategoryColor = (categoryName: string): string => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#6B7280'; // Default gray if not found
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search expenses..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={categoryFilter}
                  onChange={handleCategoryFilter}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateFilter}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateFilter}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-3 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">No expenses found. Add your first expense!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.map(expense => (
                <tr 
                  key={expense.id} 
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(expense.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="px-2 py-1 text-xs font-medium rounded-full"
                      style={{ 
                        backgroundColor: `${getCategoryColor(expense.category)}20`,
                        color: getCategoryColor(expense.category)
                      }}
                    >
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                    {formatAmount(expense.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(expense)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;