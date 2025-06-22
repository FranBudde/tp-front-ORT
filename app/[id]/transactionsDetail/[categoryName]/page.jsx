"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';

import { ArrowLeft, Trash2 } from 'lucide-react';

import categoryMapping from '../../../utils/categoryMapping';

export default function CategoryTransactionsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryName = params.categoryName;
  const dateFilterString = searchParams.get('date');
  const transacDsc = searchParams.get('transac_dsc');

  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  // Obtengo la info de mapeo de categoría (icono, color)
  const categoryInfo = categoryMapping[categoryName]

  const fetchCategoryTransactions = async () => {
    const token = localStorage.getItem("token");

    try {
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/transactions/get_transaction_by_user_category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
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
  };

  useEffect(() => {
    fetchCategoryTransactions();
  }, [categoryName, dateFilterString, transacDsc]);

  const handleDeleteTransaction = async (transactionId, amount) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar esta transacción?");
    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token de autenticación no disponible. Por favor, inicie sesión.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/transactions/delete_transaction`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id_transaction: transactionId
        })
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Error al eliminar la transacción.");
      }

      if (response.ok) {
        const finalAmount = transacDsc == "expenses" ? amount : -amount
        const responseUpdate = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/transactions/update_balance`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            operacion: "$inc",
            monto: finalAmount
          })
        });

        if (responseUpdate.ok) {
          console.log("Transacción eliminada exitosamente:", resData.message);
          fetchCategoryTransactions();
        }


      }


    } catch (err) {
      console.error("Error al eliminar la transacción:", err);
      setError(err.message || "Error desconocido al eliminar la transacción.");
    }
  };


  const totalAmount = useMemo(() => {
    return transactions.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
  }, [transactions]);

  const formatComment = (comment, maxLength = 30) => {
    if (!comment) return '';
    return comment.length > maxLength ? comment.substring(0, maxLength) + '...' : comment;
  };

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
          {error && <p className="text-center text-red-400">Error: {error}</p>}
          {!error && transactions.length === 0 && (
            <p className="text-center text-gray-400">No hay transacciones para esta categoría en este período.</p>
          )}

          {!error && transactions.length > 0 && (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction._id} className="bg-gray-700/60 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex flex-col items-start gap-0 flex-grow">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${categoryInfo.bgColor} flex items-center justify-center text-xl`}>
                        {categoryInfo.icon}
                      </div>
                      <span className="text-lg font-medium">{categoryInfo.name}</span>
                    </div>
                    {transaction.comment && (
                      <p className="text-xs text-gray-400 mt-0.5 ml-[48px]">
                        Concepto: {formatComment(transaction.comment)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xl font-semibold">${transaction.amount.toLocaleString('es-AR')}</span>
                    <button
                      onClick={() => handleDeleteTransaction(transaction._id, transaction.amount)}
                      className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-full focus:outline-none"
                      aria-label={`Eliminar transacción de ${categoryInfo.name}`}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
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