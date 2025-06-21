import React from "react";
import { Calculator } from "lucide-react";
import CalculatorPad from "./CalculatorPad";

// Componente para ingreso de monto.

export default function AmountInput({
  amount,
  setAmount,
  showCalculator,
  setShowCalculator,
  calculatorExpression,
  setCalculatorExpression,
  calcResult,
  setCalcResult,
}) {
  return (
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
          <CalculatorPad
            calculatorExpression={calculatorExpression}
            setCalculatorExpression={setCalculatorExpression}
            calcResult={calcResult}
            setCalcResult={setCalcResult}
            setAmount={setAmount}
            setShowCalculator={setShowCalculator}
          />
        )}

        <span className="text-2xl text-green-400 font-medium">ARS</span>
        <Calculator
          size={28}
          className="text-gray-400 cursor-pointer"
          onClick={() => setShowCalculator((prev) => !prev)}
        />
      </div>
    </div>
  );
}
