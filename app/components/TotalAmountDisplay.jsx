// components/TotalAmountDisplay.jsx
import React from 'react';

export default function TotalAmountDisplay({ amount }) {
  return (
    <section className="text-center mb-6">
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-lg">$</span>
        </div>
        <span className="text-lg font-medium">Total</span>
      </div>
      <div className="text-4xl font-light">{amount}</div>
    </section>
  );
}