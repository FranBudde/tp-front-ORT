import React from "react";

// Componente para seleccionar categorías
export default function CategorySelector({
  categories,
  selectedCategory,
  onSelect,
}) {
  return (
    <div className="grid grid-cols-4 gap-3 mb-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`flex flex-col items-center p-3 rounded-2xl transition-all hover:scale-105 ${
            selectedCategory === category.id ? "ring-2 ring-green-400" : ""
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
  );
}
