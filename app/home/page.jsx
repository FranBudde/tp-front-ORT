// ExpenseDashboard.jsx (o donde tengas tu componente principal)
"use client";
import React, { useState } from "react";

// Importar los nuevos componentes
import Header from "../components/Header";
import TotalAmountDisplay from "../components/TotalAmountDisplay";
import TabsNavigation from "../components/TabsNavigation";
import TimeframeSelector from "../components/TimeframeSelector";
import DateRangeNavigator from "../components/DateRangeNavigator";
import DonutChartSection from "../components/DonutChartSection";
import CategoryList from "../components/CategoryList";

export default function ExpenseDashboard() {
  // Estados
  const [activeTab, setActiveTab] = useState("expenses");
  const [activeTimeframe, setActiveTimeframe] = useState("week");

  // Datos categorías gastos (permanecen aquí ya que son los datos del dashboard)
  const expenseData = [
    {
      id: "food",
      name: "Food",
      icon: "🍔",
      color: "#22c55e",
      bgColor: "bg-green-500",
      percentage: 84,
      amount: "$38,150",
      value: 1000,
    },
    {
      id: "groceries",
      name: "Groceries",
      icon: "🛒",
      color: "#3b82f6",
      bgColor: "bg-blue-500",
      percentage: 16,
      amount: "$7,140",
      value: 500,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-gray-900 text-white flex justify-center">
      <div className="w-full max-w-md mx-auto relative">
        <Header />
        <TotalAmountDisplay amount="$39,749" /> 
        <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="mx-4 bg-gray-800/80 rounded-3xl p-6 mb-4 flex flex-col">
          <TimeframeSelector activeTimeframe={activeTimeframe} setActiveTimeframe={setActiveTimeframe} />
          <DateRangeNavigator dateRange="Apr 20 - Apr 26" /> 
          <DonutChartSection data={expenseData} centerAmount="$45,290" /> 
        </main>

        {/* <CategoryList categories={expenseData} /> */}
      </div>
    </div>
  );
}