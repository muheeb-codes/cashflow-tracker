import React, { useState, useEffect } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useCurrency } from '../context/CurrencyContext';
import { Expense } from '../types';

interface ExpenseFormProps {
  editingExpense: Expense | null;
  setEditingExpense: (expense: Expense | null) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ editingExpense, setEditingExpense }) => {
  const { categories, addExpense, updateExpense } = useExpenses();
  const { currency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: '',
    description: '',
  });

  useEffect(() => {
    if (editingExpense) {
      setIsOpen(true);
      setFormData({
        amount: editingExpense.amount.toString(),
        category: editingExpense.category,
        date: editingExpense.date.split('T')[0],
        description: editingExpense.description,
      });
    }
  }, [editingExpense]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const expenseData = {
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      description: formData.description,
    };

    if (editingExpense) {
      updateExpense({ ...expenseData, id: editingExpense.id });
      setEditingExpense(null);
    } else {
      addExpense(expenseData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
    });
    setIsOpen(false);
  };

  const handleCancel = () => {
    resetForm();
    if (editingExpense) {
      setEditingExpense(null);
    }
  };

  useEffect(() => {
    if (isOpen && !editingExpense) {
      setFormData(prev => ({
        ...prev,
        date: new Date().toISOString().split('T')[0],
      }));
    }
  }, [isOpen, editingExpense]);

  return (
    <div className="relative">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
        >
          <PlusCircle size={20} />
          <span>Add Expense</span>
        </button>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount ({currency.symbol})
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Groceries, Dinner, etc."
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  {editingExpense ? 'Update Expense' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseForm;