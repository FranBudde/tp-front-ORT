// app/[id]/transactions/[categoryName]/page.jsx
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import categoryMapping from '../../../utils/categoryMapping';

export default function CategoryTransactionsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const userId = params.id;
  const categoryName = params.categoryName;
  const dateFilterString = searchParams.get('date');
  const transacDsc = searchParams.get('transac_dsc');

  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  // Obtengo la info de mapeo de categoría (icono, color)
  const categoryInfo = categoryMapping[categoryName];

  useEffect(() => {
    async function fetchCategoryTransactions() {

      try {
        setError(null); // Reseteamos el error antes de una nueva solicitud

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/transactions/get_transaction_by_user_category`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_user: userId,
            category_name: categoryName,
            date: dateFilterString,
            transac_dsc: transacDsc,
          }),
        });

        const resData = await response.json();

        if (!response.ok) {
          throw new Error(resData.message || "Error al obtener transacciones de la categoría.");
        }

        if (Array.isArray(resData.data)) {
          setTransactions(resData.data);
        } else {
          setTransactions([]);
          setError("Formato de datos inesperado.");
        }
      } catch (err) {
        console.error("Error al cargar transacciones por categoría:", err);
        setError(err.message || "Error desconocido al cargar transacciones.");
        setTransactions([]);
      }
    }
    fetchCategoryTransactions();

  }, [userId, categoryName, dateFilterString, transacDsc]);

  const totalAmount = useMemo(() => {
    return transactions.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
  }, [transactions]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-gray-900 text-white flex justify-center">
      <div className="w-full max-w-md mx-auto relative p-4">
        <header className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-center flex-grow">
            Total: ${totalAmount.toLocaleString('es-AR')}
          </h1>
          <div className="w-10"></div>
        </header>

        <p className="text-lg text-gray-300 text-left mb-4">
          Fecha: {dateFilterString}
        </p>

        <main className="bg-gray-800/80 rounded-3xl p-6">
          {!error && transactions.length > 0 && ( // Si no hay error y sí hay transacciones
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <div key={index} className="bg-gray-700/60 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${categoryInfo.bgColor} flex items-center justify-center text-xl`}>
                      {categoryInfo.icon}
                    </div>
                    <span className="text-lg font-medium">{transaction.name}</span>
                  </div>
                  <span className="text-xl font-semibold">${transaction.amount.toLocaleString('es-AR')}</span>
                </div>
              ))}
            </div>
          )}
        </main>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Mostrando transacciones para la categoría {categoryInfo.name}.</p>
        </footer>
      </div>
    </div>
  );
}