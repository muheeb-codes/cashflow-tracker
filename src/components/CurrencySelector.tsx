import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { Currency } from '../types';
import { Globe2 } from 'lucide-react';

const CurrencySelector: React.FC = () => {
  const { currency, setCurrencyCode } = useCurrency();

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm px-3 py-2 hover:bg-gray-50 transition-colors">
        <Globe2 className="h-4 w-4 text-gray-500" />
        <select
          value={currency.code}
          onChange={(e) => setCurrencyCode(e.target.value as Currency)}
          className="appearance-none bg-transparent border-none text-gray-700 text-sm font-medium focus:outline-none focus:ring-0 cursor-pointer"
        >
          <option value="USD">US Dollar ($)</option>
          <option value="INR">Indian Rupee (₹)</option>
          <option value="PKR">Pakistani Rupee (₨)</option>
        </select>
      </div>
    </div>
  );
};

export default CurrencySelector;