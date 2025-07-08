import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { ExpenseProvider } from './context/ExpenseContext';
import { CurrencyProvider } from './context/CurrencyContext';
import ExpenseForm from './components/ExpenseForm';
import SalaryForm from './components/SalaryForm';
import ExpenseSummary from './components/ExpenseSummary';
import ExpenseList from './components/ExpenseList';
import ExpenseCharts from './components/ExpenseCharts';
import CategoryManager from './components/CategoryManager';
import CurrencySelector from './components/CurrencySelector';
import DownloadButton from './components/DownloadButton';
import { Expense, Salary } from './types';

function App() {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingSalary, setEditingSalary] = useState<Salary | null>(null);

  return (
    <CurrencyProvider>
      <ExpenseProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-8 w-8 text-blue-500" />
                  <h1 className="text-2xl font-bold text-gray-900">Expense Tracker</h1>
                </div>
                <div className="flex items-center gap-4">
                  <CurrencySelector />
                  <CategoryManager />
                  <DownloadButton />
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ExpenseSummary />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="flex gap-4 mb-6">
                  <ExpenseForm
                    editingExpense={editingExpense}
                    setEditingExpense={setEditingExpense}
                  />
                  <SalaryForm
                    editingSalary={editingSalary}
                    setEditingSalary={setEditingSalary}
                  />
                </div>
                <ExpenseList onEdit={setEditingExpense} />
              </div>

              <div className="lg:col-span-1">
                <ExpenseCharts />
              </div>
            </div>
          </main>

          <footer className="bg-white py-4 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-gray-500">
              <a href="https://github.com/muheeb-codes/cashflow-tracker.git" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Expense Tracker
                </a> - Your personal finance assistant
              </p>
            </div>
          </footer>
        </div>
      </ExpenseProvider>
    </CurrencyProvider>
  );
}

export default App;