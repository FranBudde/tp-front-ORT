import React from "react";

// Componente de la calculadora
export default function CalculatorPad({
  calculatorExpression,
  setCalculatorExpression,
  calcResult,
  setCalcResult,
  setAmount,
  setShowCalculator,
}) {
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
    <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs flex items-center justify-center">
      <div className="bg-gray-900 rounded-2xl p-4 w-64 shadow-2xl">
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
  );
}
