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
} from 'date-fns';
import { es } from 'date-fns/locale';
import Link from "next/link";
import { Plus } from "lucide-react";

// Import utils
import categoryMapping from "../../utils/categoryMapping";

// Importo los componentes necesarios para el home
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
  const [activeTimeframe, setActiveTimeframe] = useState("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [totalAmount, setTotalAmount] = useState(0);
  const [expenseData, setExpenseData] = useState([]);
  const [hasData, setHasData] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener el rango de fechas formateado
  const getFormattedDateRange = () => {
    switch (activeTimeframe) {
      case "day":
        return format(currentDate, "MMM dd, yyyy", { locale: es });
      case "month":
        return format(currentDate, "MMMM yyyy", { locale: es });
      case "year":
        return format(currentDate, "yyyy", { locale: es });
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

  // Funcion para obtener el balance total del usuario
  useEffect(() => {
    async function fetchTotalBalance() {
      if (!userId) return;
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
  }, [userId]);

  // Funcion para obtener las transacciones por categoria del usuario:
  useEffect(() => {
    async function fetchUserTransactions() {
      if (!userId) {
        setExpenseData([]);
        setHasData(false);
        return;
      }

      let dateToEndpoint = "";
      switch (activeTimeframe) {
        case "day":
          dateToEndpoint = format(currentDate, "yyyy-MM-dd")
          break;
        case "month":
          dateToEndpoint = format(currentDate, "yyyy-MM")
          break;
        case "year":
          dateToEndpoint = format(currentDate, "yyyy")
          break;
        default:
          dateToEndpoint = format(currentDate, "yyyy-MM-dd");
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/transactions/get_transaction_by_user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            "id_user": userId,
            "date": dateToEndpoint,
            "transac_dsc": activeTab
          })
        });

        const resData = await response.json();

        if (!response.ok) {
          throw new Error(resData.message || "Error al obtener transacciones por categoría");
        }

        const transactions = resData.data;
        console.log("Transactions", transactions)

        if (!Array.isArray(transactions)) {
          console.warn("La respuesta del backend no es un array en data.data:", transactions);
          setExpenseData([]);
          setHasData(false);
          setError("Formato de datos de transacciones inesperado.");
          return;
        }

        const transformedData = transactions.map(item => {
          const mappedCategory = categoryMapping[item.name];

          if (!mappedCategory) {
            console.warn(`Categoría '${item.name}' no encontrada en categoryMapping. Usando valores por defecto.`);
          }

          return {
            id: item.name,
            name: mappedCategory.name,
            icon: mappedCategory.icon,
            color: mappedCategory.color,
            bgColor: mappedCategory.bgColor,
            value: item.amount,
          };
        });

        setExpenseData(transformedData);
        setHasData(transformedData.length > 0);
        setError(null);

      } catch (error) {
        console.error("Error al obtener y transformar transacciones:", error);
        setError(error.message || "Error al conectar con el servidor para obtener transacciones.");
        setExpenseData([]);
        setHasData(false);
      }
    }
    fetchUserTransactions();
  }, [currentDate, userId, activeTimeframe, activeTab]);

  // Funcion para actualizar el Total Balance del usuario cuando toca el lapicito.
  const handleSaveTotalAmount = async (newAmount) => {
    setTotalAmount(newAmount);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/transactions/update_balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_user: userId,
          operacion: "$set",
          monto: newAmount
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el balance en el backend.");
      }
      console.log("Balance actualizado exitosamente en el backend.");
      // Si quisieramos podriamos llamar a fetchTotalBalance() pero no es necesario. Mientras el componente no se actualice
      // usamos el estado actual, si se llega a actualizar, hace solo el llamado a fetchTotalBalance()
    } catch (err) {
      console.error("Error al guardar el balance:", err);

    }
  };


  // Reseteo la fecha cuando cambia el timeframe
  useEffect(() => {
    const today = new Date();
    switch (activeTimeframe) {
      case "day":
        setCurrentDate(today);
        break;
      case "month":
        setCurrentDate(startOfMonth(today));
        break;
      case "year":
        setCurrentDate(startOfYear(today));
        break;
      default:
        setCurrentDate(today);
        break;
    }
  }, [activeTimeframe]);

  // Calculo el total de los gastos desde expenseData
  const totalExpenseAmount = expenseData.reduce((acc, item) => {
    return acc + (typeof item.value === 'number' ? item.value : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-gray-900 text-white flex justify-center">
      <div className="w-full max-w-md mx-auto relative">
        <Header />
        <TotalAmountDisplay amount={totalAmount} onSaveAmount={handleSaveTotalAmount} />
        <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="mx-4 bg-gray-800/80 rounded-3xl p-6 mb-4 flex flex-col relative">
          <TimeframeSelector activeTimeframe={activeTimeframe} setActiveTimeframe={setActiveTimeframe} />
          <DateRangeNavigator
            dateRange={getFormattedDateRange()}
            onPrev={handlePrevPeriod}
            onNext={handleNextPeriod}
          />
          {hasData && (
            <DonutChartSection
              data={expenseData}
            />
          )}
          {!hasData && (
            <div className="text-white text-center py-8">
              No hay transacciones para mostrar en este período.
            </div>
          )}
          <div className="absolute bottom-4 right-4">
            <Link href={`/${userId}/transaction`}>
              <button className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-600 transition-colors">
                <Plus size={24} className="text-black" />
              </button>
            </Link>
          </div>
        </main>
        {hasData && (
          <CategoryList categories={expenseData} totalAmount={totalExpenseAmount} />
        )}
      </div>
    </div>
  );
}