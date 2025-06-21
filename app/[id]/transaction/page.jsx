"use client";
import categoryMapping from "../../utils/categoryMapping";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calculator } from "lucide-react";
import { CalendarDays } from "lucide-react";

const getTodayString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localDate = new Date(today.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
};

const formatDateLocal = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

export default function AddTransactionForm() {
  const params = useParams();
  const userID = params.id;
  const [activeTab, setActiveTab] = useState("expenses");
  const [amount, setAmount] = useState("0.00");
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorExpression, setCalculatorExpression] = useState("");
  const [calcResult, setCalcResult] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(null);
  const [comment, setComment] = useState("");

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

    // Mapeo temporal para probar, sacar al tener endpoint getCategoryByName
    const categoryToMongoId = {
      food: "681a9c68bac0c229cdf72195",
      groceries: "681a9b32bac0c229cdf72194",
      other: "684e1e2d162d6ad7c8c91099",
    };

    const mongoCategoryId =
      categoryToMongoId[selectedCategory] || "665e6ef1f05f98a679d9a347";

    const transaction = {
      amount,
      id_categoria: mongoCategoryId,
      transac_dsc: activeTab,
      comment: comment.trim(),
      fecha: selectedDate,
    };

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

      setAmount("0.00");
      setSelectedCategory(null);
      setSelectedDate(getTodayString());
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al guardar la transacción.");
    }
  };

  const renderKey = (key, wide = false) => (
    <button
      key={key}
      onClick={() => {
        if (key === "⌫") {
          if (calcResult !== null) {
            setCalculatorExpression(calcResult.toString().slice(0, -1));
            setCalcResult(null);
          } else {
            setCalculatorExpression((prev) => prev.slice(0, -1));
          }
        } else if (key === "C") {
          setCalculatorExpression("");
          setCalcResult(null);
        } else if (key === "=") {
          try {
            const result = eval(calculatorExpression);
            setCalcResult(result);
            setCalculatorExpression(result.toString());
          } catch {
            alert("Operación inválida");
          }
        } else if (key === "OK") {
          if (calculatorExpression !== "") {
            try {
              const result = eval(calculatorExpression);
              const formatted = parseFloat(result).toFixed(2);
              setAmount(formatted);
            } catch {
              alert("Operación inválida");
            }
          }
          setShowCalculator(false);
          setCalculatorExpression("");
          setCalcResult(null);
        } else {
          setCalculatorExpression((prev) =>
            calcResult !== null ? calcResult.toString() + key : prev + key
          );
          setCalcResult(null);
        }
      }}
      className={`${
        wide ? "col-span-2" : ""
      } bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-xl text-lg font-medium transition-all duration-150`}
    >
      {key}
    </button>
  );

  const categories = Object.values(categoryMapping);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-gray-900 text-white flex justify-center">
      <div className="w-full max-w-md mx-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pt-12">
          <Link href={`/${userID}/home`}>
            <ArrowLeft
              size={24}
              className="text-white cursor-pointer hover:text-gray-300"
            />
          </Link>
          <h1 className="text-xl font-semibold">Add Transactions</h1>
          <div className="w-6" />
        </div>

        {/* Tabs */}
        <div className="flex mx-4 mb-6">
          <button
            onClick={() => setActiveTab("expenses")}
            className={`flex-1 py-3 text-center font-medium border-b-2 ${
              activeTab === "expenses"
                ? "border-white text-white"
                : "border-transparent text-gray-400"
            }`}
          >
            EXPENSES
          </button>
          <button
            onClick={() => setActiveTab("income")}
            className={`flex-1 py-3 text-center font-medium border-b-2 ${
              activeTab === "income"
                ? "border-white text-white"
                : "border-transparent text-gray-400"
            }`}
          >
            INCOME
          </button>
        </div>

        {/* Amount Display */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              placeholder="0.00"
              onFocus={() => {
                if (amount === "0.00") setAmount("");
              }}
              onChange={(e) => {
                const value = e.target.value;
                // Permitir solo números y hasta 2 decimales
                if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
                  setAmount(value);
                }
              }}
              onBlur={() => {
                const num = parseFloat(amount) || 0;
                setAmount(num.toFixed(2));
              }}
              className="text-5xl font-light text-center bg-transparent border-b border-green-400 focus:outline-none w-40"
            />
            {showCalculator && (
              <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs flex items-center justify-center">
                <div className="bg-gray-900 rounded-2xl p-4 w-64 shadow-2xl transform -translate-y-60">
                  <div className="text-right text-green-300 font-mono text-xl mb-4">
                    {calcResult !== null
                      ? `= ${calcResult}`
                      : calculatorExpression || "0"}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {["7", "8", "9", "+"].map((key) => renderKey(key))}
                    {["4", "5", "6", "-"].map((key) => renderKey(key))}
                    {["1", "2", "3", "*"].map((key) => renderKey(key))}
                    {["0", ".", "⌫", "/"].map((key) => renderKey(key))}
                    {["C", "="].map((key) => renderKey(key, true))}

                    <div className="col-span-4 flex justify-center">
                      <div className="w-24">{renderKey("OK", true)}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCalculator(false)}
                    className="mt-4 text-sm text-gray-400 hover:text-white w-full"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <span className="text-2xl text-green-400 font-medium">ARS</span>
            <Calculator
              size={28}
              className="text-gray-400 cursor-pointer"
              onClick={() => setShowCalculator((prev) => !prev)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 mb-6">
          <div className="text-gray-400 text-sm mb-4">Categories</div>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-col items-center p-3 rounded-2xl transition-all hover:scale-105 ${
                  selectedCategory === category.id
                    ? "ring-2 ring-green-400"
                    : ""
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center text-xl mb-2`}
                >
                  {category.icon}
                </div>
                <span className="text-xs text-center text-gray-300 leading-tight">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        <div className="flex gap-4 items-center justify-center mb-8">
          <button
            onClick={() => setSelectedDate(getTodayString())}
            className={`px-4 py-3 rounded-xl text-sm ${
              selectedDate === getTodayString()
                ? "bg-green-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Today
          </button>

          {showDatePicker && (
            <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-gray-900 rounded-2xl p-6 w-72 shadow-2xl transform -translate-y-60">
                <h2 className="text-white text-center mb-4 text-sm font-medium">
                  Seleccionar Fecha
                </h2>

                <input
                  type="date"
                  value={tempDate || selectedDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  className="w-full text-center bg-gray-800 text-white p-2 rounded-md focus:outline-none"
                />

                <div className="mt-4 flex justify-center gap-4">
                  <button
                    onClick={() => {
                      const finalDate = tempDate || selectedDate;
                      setSelectedDate(finalDate);
                      setShowDatePicker(false);
                      setTempDate(null);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-green-500"
                  >
                    OK
                  </button>
                  <button
                    onClick={() => {
                      setShowDatePicker(false);
                      setTempDate(null);
                    }}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setTempDate(selectedDate);
              setShowDatePicker(true);
            }}
            className={`px-4 py-3 rounded-xl text-sm ${
              selectedDate !== getTodayString()
                ? "bg-green-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {selectedDate !== getTodayString() ? (
              formatDateLocal(selectedDate)
            ) : (
              <CalendarDays size={16} />
            )}
          </button>
        </div>

        {/* Comentario */}
        <div className="px-4 mb-6">
          <label htmlFor="comment" className="text-sm text-gray-300 block mb-2">
            Comentario (opcional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={1}
            placeholder="..."
            className="w-full p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* Add Button */}
        <div className="sticky bottom-4 left-0 right-0 px-4 mt-8">
          <button
            onClick={handleAddTransaction}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-4 rounded-2xl text-lg transition-colors shadow-lg"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
