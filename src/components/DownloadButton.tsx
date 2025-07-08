import React from 'react';
import { Download } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useCurrency } from '../context/CurrencyContext';
import { formatDate } from '../utils/calculations';

const DownloadButton: React.FC = () => {
  const { summary } = useExpenses();
  const { formatAmount } = useCurrency();

  const handleDownload = async () => {
    try {
      // Dynamically import the required libraries
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');

      // Create a temporary div to hold the content
      const content = document.createElement('div');
      content.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #1a56db; margin-bottom: 20px;">Expense Summary Report</h1>
          
          <div style="margin-bottom: 20px;">
            <h2 style="color: #374151; margin-bottom: 10px;">Financial Overview</h2>
            <p><strong>Total Spent:</strong> ${formatAmount(summary.total)}</p>
            <p><strong>Monthly Salary:</strong> ${formatAmount(summary.monthlySalary)}</p>
            <p><strong>Remaining Budget:</strong> ${formatAmount(summary.remainingBudget)}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h2 style="color: #374151; margin-bottom: 10px;">Expense Details</h2>
            <p><strong>Highest Expense:</strong> ${summary.highestExpense ? formatAmount(summary.highestExpense.amount) : formatAmount(0)}</p>
            ${summary.highestExpense ? `<p>Description: ${summary.highestExpense.description} (${formatDate(summary.highestExpense.date)})</p>` : ''}
            
            <p><strong>Recent Expense:</strong> ${summary.recentExpense ? formatAmount(summary.recentExpense.amount) : formatAmount(0)}</p>
            ${summary.recentExpense ? `<p>Description: ${summary.recentExpense.description} (${summary.recentExpense.category})</p>` : ''}
          </div>

          <div style="margin-top: 20px; font-size: 12px; color: #6b7280;">
            Generated on: ${new Date().toLocaleDateString()}
          </div>
        </div>
      `;

      // Add the content to the document temporarily
      document.body.appendChild(content);

      // Generate PDF
      const canvas = await html2canvas(content);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('expense-summary.pdf');

      // Clean up
      document.body.removeChild(content);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
    >
      <Download size={20} />
      <span>Download PDF</span>
    </button>
  );
};

export default DownloadButton; 