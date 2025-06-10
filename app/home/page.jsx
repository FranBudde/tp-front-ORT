// ExpenseDashboard.jsx
"use client";
import React, { useState, useEffect } from "react";

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
  const [activeTimeframe, setActiveTimeframe] = useState("day");
  const [totalAmount, setTotalAmount] = useState(0);

  // Datos categorías gastos
  const expenseData = [
    {
      id: "food",
      name: "Food",
      icon: "🍔",
      color: "#22c55e",
      bgColor: "bg-green-500",
      value: 1000,
    },
    {
      id: "groceries",
      name: "Groceries",
      icon: "🛒",
      color: "#3b82f6",
      bgColor: "bg-blue-500",
      value: 500,
    },
  ];

    useEffect(async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/transactions/get_total_balance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            "id_user": "6834f5324645517fd2cb49a1"
          })
        });
    
        const data = await response.json();
  
    
        if (!response.ok) {
          
            throw new Error(data.message);
        }
    
        if (data) {
          setTotalAmount(data.data)
        }
      } catch (err) {
        setError(err.message || "Error al conectar con el servidor");
      }
    }, []);

  // Calculo el total de los gastos desde expenseData
  const totalExpenseAmount = expenseData.reduce((acc, item) => {
    // Asegurarse de que el valor sea un número para la suma
    return acc + (typeof item.value === 'number' ? item.value : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-gray-900 text-white flex justify-center">
      <div className="w-full max-w-md mx-auto relative">
        <Header />
        <TotalAmountDisplay amount={totalAmount} /> 
        <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="mx-4 bg-gray-800/80 rounded-3xl p-6 mb-4 flex flex-col">
          <TimeframeSelector activeTimeframe={activeTimeframe} setActiveTimeframe={setActiveTimeframe} />
          <DateRangeNavigator dateRange="Apr 20 - Apr 26" />
          <DonutChartSection data={expenseData} /> 
        </main>
        <CategoryList categories={expenseData} totalAmount={totalExpenseAmount} />
      </div>
    </div>
  );
}