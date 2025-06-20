"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calculator, Plus, Search } from "lucide-react";
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

  const categories = [
    {
      id: "transport",
      name: "Transportation",
      icon: "🚌",
      color: "bg-gray-500",
    },
    { id: "groceries", name: "Groceries", icon: "🛒", color: "bg-blue-500" },
    { id: "beauty", name: "Peluquería", icon: "✂️", color: "bg-pink-500" },
    { id: "food", name: "Food", icon: "🍔", color: "bg-green-500" },
    {
      id: "rent",
      name: "Alquiler y Expensas",
      icon: "🏠",
      color: "bg-green-600",
    },
    { id: "health", name: "Psicólogo", icon: "❤️", color: "bg-red-500" },
    { id: "services", name: "Servicios", icon: "💰", color: "bg-blue-600" },
    { id: "more", name: "More", icon: "+", color: "bg-gray-600" },
  ];

  const dates = [
    { id: "today", label: "5/6\ntoday", active: true },
    { id: "yesterday", label: "5/5\nyesterday", active: false },
    { id: "twoDays", label: "5/4\ntwo days ago", active: false },
  ];

  const handleAmountChange = (value) => {
    if (value === "C") {
      setAmount("0");
    } else if (value === "⌫") {
      setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    } else {
      setAmount((prev) => {
        if (prev === "0") return value;
        return prev + value;
      });
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
        {/*         <div className="px-4 mb-6">
          <div className="flex gap-4">
            {dates.map((date) => (
              <button
                key={date.id}
                onClick={() => setSelectedDate(date.id)}
                className={`px-4 py-3 rounded-xl text-sm whitespace-pre-line ${
                  selectedDate === date.id
                    ? "bg-green-500 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {date.label}
              </button>
            ))}
            <button className="px-4 py-3 bg-gray-700 rounded-xl">
              <Calculator size={16} className="text-gray-300" />
            </button>
          </div>
        </div> */}
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
              setTempDate(selectedDate); // mantiene consistencia
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

        {/* Add Button */}
        <div className="sticky bottom-4 left-0 right-0 px-4 mt-8">
          <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-4 rounded-2xl text-lg transition-colors shadow-lg">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
