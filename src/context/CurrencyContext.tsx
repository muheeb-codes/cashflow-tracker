import React, { createContext, useContext, useState } from 'react';
import type { Currency, CurrencyConfig } from '../types';

const CURRENCY_CONFIGS: Record<Currency, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rate: 1,
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    rate: 83.12,
  },
  PKR: {
    code: 'PKR',
    symbol: '₨',
    name: 'Pakistani Rupee',
    rate: 278.95,
  },
};

interface CurrencyContextType {
  currency: CurrencyConfig;
  setCurrencyCode: (code: Currency) => void;
  formatAmount: (amount: number) => string;
  convertAmount: (amount: number, fromCurrency?: Currency) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<CurrencyConfig>(CURRENCY_CONFIGS.USD);

  const setCurrencyCode = (code: Currency) => {
    setCurrency(CURRENCY_CONFIGS[code]);
  };

  const convertAmount = (amount: number, fromCurrency: Currency = 'USD'): number => {
    const usdAmount = amount / CURRENCY_CONFIGS[fromCurrency].rate;
    return usdAmount * currency.rate;
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrencyCode, formatAmount, convertAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};