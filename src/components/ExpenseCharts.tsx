import React, { useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { useExpenses } from '../context/ExpenseContext';
import { getExpensesByMonth } from '../utils/calculations';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement,
  PointElement,
  LineElement,
  Title, 
  Tooltip, 
  Legend
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
};

const chartTypes = ['category', 'timeline', 'pie'] as const;
type ChartType = typeof chartTypes[number];

const ExpenseCharts: React.FC = () => {
  const { expenses, categories, summary } = useExpenses();
  const [activeChart, setActiveChart] = useState<ChartType>('category');
  
  // Skip rendering charts if no expenses
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Expense Analysis</h2>
        <div className="text-center py-10 text-gray-500">
          <p>Add expenses to see charts and analysis</p>
        </div>
      </div>
    );
  }
  
  // Prepare data for Category Chart
  const categoryChartData = {
    labels: Object.keys(summary.categoryTotals),
    datasets: [
      {
        label: 'Spending by Category',
        data: Object.values(summary.categoryTotals),
        backgroundColor: categories
          .filter(cat => Object.keys(summary.categoryTotals).includes(cat.name))
          .map(cat => cat.color),
        borderWidth: 1,
      },
    ],
  };
  
  // Prepare data for Timeline Chart
  const monthlyData = getExpensesByMonth(expenses);
  const timelineChartData = {
    labels: monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Monthly Spending',
        data: monthlyData.map(d => d.total),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.2,
      },
    ],
  };
  
  // Prepare data for pie chart
  const pieChartData = {
    labels: Object.keys(summary.categoryTotals),
    datasets: [
      {
        label: 'Spending by Category',
        data: Object.values(summary.categoryTotals),
        backgroundColor: categories
          .filter(cat => Object.keys(summary.categoryTotals).includes(cat.name))
          .map(cat => cat.color),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Expense Analysis</h2>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {chartTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveChart(type)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeChart === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {type === 'category' && 'By Category'}
              {type === 'timeline' && 'Timeline'}
              {type === 'pie' && 'Distribution'}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-80">
        {activeChart === 'category' && (
          <Bar options={chartOptions} data={categoryChartData} />
        )}
        
        {activeChart === 'timeline' && (
          <Line 
            options={{
              ...chartOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return '$' + value;
                    }
                  }
                }
              }
            }} 
            data={timelineChartData} 
          />
        )}
        
        {activeChart === 'pie' && (
          <div className="flex justify-center h-full">
            <div className="w-72">
              <Pie options={chartOptions} data={pieChartData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseCharts;