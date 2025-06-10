// components/TabsNavigation.jsx
import React from 'react';

export default function TabsNavigation({ activeTab, setActiveTab }) {
  return (
    <nav className="flex mx-4 mb-6">
      <button
        onClick={() => setActiveTab("expenses")}
        className={`flex-1 py-3 text-center font-medium border-b-2 ${
          activeTab === "expenses"
            ? "border-green-400 text-white"
            : "border-transparent text-gray-400"
        }`}
      >
        EXPENSES
      </button>
      <button
        onClick={() => setActiveTab("income")}
        className={`flex-1 py-3 text-center font-medium border-b-2 ${
          activeTab === "income"
            ? "border-green-400 text-white"
            : "border-transparent text-gray-400"
        }`}
      >
        INCOME
      </button>
    </nav>
  );
}