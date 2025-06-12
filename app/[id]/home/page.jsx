// ExpenseDashboard.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import {
  format,
  startOfMonth,
  startOfYear,
  addDays,
  addMonths,
  addYears,
  subDays,
  subMonths,
  subYears,
} from 'date-fns'; // Importa las funciones necesarias de date-fns
import { es } from 'date-fns/locale'; // Importa el locale español si lo necesitas para el formato

// Importar los nuevos componentes
import Header from "../../components/homeComponents/Header";
import TotalAmountDisplay from "../../components/homeComponents/TotalAmountDisplay";
import TabsNavigation from "../../components/homeComponents/TabsNavigation";
import TimeframeSelector from "../../components/homeComponents/TimeframeSelector";
import DateRangeNavigator from "../../components/homeComponents/DateRangeNavigator";
import DonutChartSection from "../../components/homeComponents/DonutChartSection";
import CategoryList from "../../components/homeComponents/CategoryList";

export default function ExpenseDashboard() {
  const params = useParams();
  const userId = params.id;

  // Estados
  const [activeTab, setActiveTab] = useState("expenses");
  const [activeTimeframe, setActiveTimeframe] = useState("day"); // Estado para la selección de día/semana/mes/año
  const [currentDate, setCurrentDate] = useState(new Date()); // Nuevo estado: la fecha actual seleccionada
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null); // Añadimos estado para el error

  // Datos categorías gastos (simulados)
  const expenseData = [
    { id: "food", name: "Food", icon: "🍔", color: "#22c55e", bgColor: "bg-green-500", value: 1000 },
    { id: "groceries", name: "Groceries", icon: "🛒", color: "#3b82f6", bgColor: "bg-blue-500", value: 500 },
  ];

  // Función para obtener el rango de fechas formateado
  const getFormattedDateRange = () => {
    switch (activeTimeframe) {
      case "day":
        return format(currentDate, "MMM dd, yyyy", { locale: es }); // "Jun 12, 2025"
      case "month":
        return format(currentDate, "MMMM yyyy", { locale: es }); // "Junio 2025"
      case "year":
        return format(currentDate, "yyyy", { locale: es }); // "2025"
      default:
        return "";
    }
  };

  // Funciones para navegar entre periodos
  const handlePrevPeriod = () => {
    setCurrentDate((prevDate) => {
      switch (activeTimeframe) {
        case "day": return subDays(prevDate, 1);
        case "month": return subMonths(prevDate, 1);
        case "year": return subYears(prevDate, 1);
        default: return prevDate;
      }
    });
  };

  const handleNextPeriod = () => {
    setCurrentDate((prevDate) => {
      switch (activeTimeframe) {
        case "day": return addDays(prevDate, 1);
        case "month": return addMonths(prevDate, 1);
        case "year": return addYears(prevDate, 1);
        default: return prevDate;
      }
    });
  };

  // Efecto para obtener el balance total (se mantiene igual)
  useEffect(() => {
    async function fetchTotalBalance() {
      if (!userId) return; // Asegúrate de tener userId antes de hacer la llamada
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/transactions/get_total_balance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            "id_user": userId
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error desconocido al obtener el balance");
        }

        if (data && data.data !== undefined) {
          setTotalAmount(data.data);
        } else {
          console.warn("La respuesta no contiene 'data.data' como se esperaba:", data);
          setError("Formato de respuesta inesperado.");
        }
      } catch (err) {
        console.error("Error en fetchTotalBalance:", err);
        setError(err.message || "Error al conectar con el servidor");
      }
    }

    fetchTotalBalance();
  }, []);

  // Efecto para resetear la fecha a "hoy/este mes/este año" cuando cambia el timeframe
  useEffect(() => {
    const today = new Date();
    switch (activeTimeframe) {
      case "day":
        setCurrentDate(today);
        break;
      case "month":
        setCurrentDate(startOfMonth(today)); // Empieza al inicio del mes actual
        break;
      case "year":
        setCurrentDate(startOfYear(today)); // Empieza al inicio del año actual
        break;
      default:
        setCurrentDate(today);
        break;
    }
  }, [activeTimeframe]); // Este efecto se ejecuta cada vez que activeTimeframe cambia

  // Calculo el total de los gastos desde expenseData (simulado)
  const totalExpenseAmount = expenseData.reduce((acc, item) => {
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
          <DateRangeNavigator
            dateRange={getFormattedDateRange()}
            onPrev={handlePrevPeriod}
            onNext={handleNextPeriod}
          />
          <DonutChartSection
            data={expenseData}
            userID={userId}
          />
        </main>
        <CategoryList categories={expenseData} totalAmount={totalExpenseAmount} />
      </div>
    </div>
  );
}