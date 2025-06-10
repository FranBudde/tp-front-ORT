// components/DateRangeNavigator.jsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DateRangeNavigator({ dateRange = "Apr 20 - Apr 26" }) {
  return (
    <div className="flex items-center justify-center mb-8">
      <ChevronLeft
        size={20}
        className="text-gray-400 cursor-pointer"
        // Aquí podrías poner handlers si quieres cambiar rango
      />
      <span className="mx-4 text-lg font-medium underline">
        {dateRange}
      </span>
      <ChevronRight
        size={20}
        className="text-gray-400 cursor-pointer"
        // Aquí también handlers opcionales
      />
    </div>
  );
}