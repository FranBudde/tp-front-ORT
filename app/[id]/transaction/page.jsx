"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import categoryMapping from "../../utils/categoryMapping";
import { getTodayString } from "../../utils/date";

// Componentes
import CategorySelector from "../../components/transactionComponents/CategorySelector";
import DateSelector from "../../components/transactionComponents/DateSelector";
import CommentBox from "../../components/transactionComponents/CommentBox";
import AddButton from "../../components/transactionComponents/AddButton";
import TransactionTabs from "../../components/transactionComponents/TransactionTabs";
import AmountInput from "../../components/transactionComponents/AmountInput";
import Header from "../../components/transactionComponents/Header";

// Componente principal para registrar una nueva transacción
export default function AddTransactionForm() {
  const params = useParams(); // Extraigo el ID del usuario desde la URL
  const userID = params.id;

  // Estados
  const [activeTab, setActiveTab] = useState("expenses");
  const [amount, setAmount] = useState("0.00");
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorExpression, setCalculatorExpression] = useState("");
  const [calcResult, setCalcResult] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [comment, setComment] = useState("");

  // Maneja creación de la transacción
  const handleAddTransaction = async () => {
    if (!selectedCategory) {
      alert("Por favor seleccioná una categoría.");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert("Ingresá un monto mayor a cero.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert(
        "No se encontró un token de sesión. Por favor, iniciá sesión nuevamente."
      );
      return;
    }

    // Obtengo ID de la categoría
    let mongoCategoryId;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/categories/get_by_name/${selectedCategory}`
      );

      if (!res.ok) {
        throw new Error("No se encontró la categoría en el servidor.");
      }

      const data = await res.json();
      mongoCategoryId = data.id;
    } catch (error) {
      alert(
        "Error al obtener la categoría. Verificá el nombre o probá más tarde."
      );
      console.error("Error obteniendo ID de categoría:", error);
      return;
    }

    const transaction = {
      amount,
      id_categoria: mongoCategoryId,
      transac_dsc: activeTab,
      comment: comment.trim(),
      date: selectedDate,
    };

    // Envio al backend
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/transactions/create_transaccion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(transaction),
        }
      );

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Error del servidor: ${error}`);
      }

      const data = await res.json();
      console.log("✔ Transacción creada:", data);

      alert("Transacción registrada exitosamente.");
      
      // Restablesco valores
      setAmount("0.00");
      setSelectedCategory(null);
      setSelectedDate(getTodayString());
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al guardar la transacción.");
    }
  };

  // Lista de categorías disponibles
  const categories = Object.values(categoryMapping);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-gray-900 text-white flex justify-center">
      <div className="w-full max-w-md mx-auto relative">
        {/* Header */}
        <Header userID={userID} />

        {/* Tabs */}
        <TransactionTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Amount Display */}
        <AmountInput
          amount={amount}
          setAmount={setAmount}
          showCalculator={showCalculator}
          setShowCalculator={setShowCalculator}
          calculatorExpression={calculatorExpression}
          setCalculatorExpression={setCalculatorExpression}
          calcResult={calcResult}
          setCalcResult={setCalcResult}
        />

        {/* Categories */}
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={(id) => setSelectedCategory(id)}
        />

        {/* Date Selection */}
        <DateSelector
          selectedDate={selectedDate}
          onChange={(date) => setSelectedDate(date)}
        />

        {/* Comentario */}
        <CommentBox comment={comment} onChange={setComment} />

        {/* Add Button */}
        <AddButton onClick={handleAddTransaction} />
      </div>
    </div>
  );
}
