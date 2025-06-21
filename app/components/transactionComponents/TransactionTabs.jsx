import React from "react";

// Componente para seleccionar entre las pestañas EXPENSES e INCOME
export default function TransactionTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex mx-4 mb-6">
      {["expenses", "income"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors duration-150 ${
            activeTab === tab
              ? "border-white text-white"
              : "border-transparent text-gray-400"
          }`}
        >
          {tab.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
