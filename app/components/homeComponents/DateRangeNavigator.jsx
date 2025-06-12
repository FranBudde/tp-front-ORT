// components/homeComponents/DateRangeNavigator.jsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DateRangeNavigator({ dateRange, onPrev, onNext }) { // Recibe las nuevas props
  return (
    <div className="flex items-center justify-center mb-8">
      <ChevronLeft
        size={20}
        className="text-gray-400 cursor-pointer"
        onClick={onPrev} // Llama a la función para retroceder
      />
      <span className="mx-4 text-lg font-medium underline">
        {dateRange} {/* Muestra el rango formateado que viene del padre */}
      </span>
      <ChevronRight
        size={20}
        className="text-gray-400 cursor-pointer"
        onClick={onNext} // Llama a la función para avanzar
      />
    </div>
  );
}