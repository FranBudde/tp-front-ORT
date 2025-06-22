"use client";

import React, { useState, useEffect } from 'react';
import { PencilLine } from 'lucide-react';

export default function TotalAmountDisplay({ amount, onSaveAmount }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  // Me aseguro que el monto sea numerico, de lo contrario lo formateo.
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(String(amount)?.replace(/[^0-9.-]+/g,"")) || 0;

  // Color condicional dependiendo si es mayor o menor que cero
  const textColorClass = numericAmount < 0 ? 'text-red-500' : 'text-white';

  // Formatear el monto para asegurar el signo negativo y el formato de moneda
  const formattedAmount = `${Math.abs(numericAmount).toLocaleString('es-AR')}`;
  const displayAmount = numericAmount < 0 ? `-$${formattedAmount}` : `$${formattedAmount}`;

  useEffect(() => {
    setEditValue(numericAmount.toFixed(2));
  }, [amount]);


  const handleEditClick = () => {
    setIsEditing(true);
    setEditValue(numericAmount.toFixed(2));
  };

  const handleInputChange = (e) => {
    // Permito solo números y un punto decimal
    const value = e.target.value;
    if (/^-?\d*\.?\d*$/.test(value) || value === '-' || value === '') {
      setEditValue(value);
    }
  };

  const handleInputBlur = () => {
    const parsedValue = parseFloat(editValue);
    if (!isNaN(parsedValue)) {
      if (onSaveAmount) {
        onSaveAmount(parsedValue); 
      }
    } else {
      setEditValue(numericAmount.toFixed(2));
    }
    setIsEditing(false); // Salir del modo de edición
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.target.blur(); 
    }
  };

  return (
    <section className="text-center mb-6">
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-lg">$</span>
        </div>
        <span className="text-lg font-medium">Total</span>
      </div>
      <div className="flex items-center justify-center gap-2"> 
        {isEditing ? (
          <input
            type="text" 
            value={editValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyPress={handleKeyPress}
            className={`text-4xl font-light bg-gray-700 text-white border-b border-gray-500 outline-none w-32 text-center ${textColorClass}`}
            autoFocus
          />
        ) : (
          <div className={`text-4xl font-light ${textColorClass}`}>
            {displayAmount}
          </div>
        )}
        {!isEditing && (
          <button
            onClick={handleEditClick}
            className="p-1 rounded-full text-gray-400 hover:text-white transition-colors focus:outline-none"
            aria-label="Editar monto total"
          >
            <PencilLine size={24} />
          </button>
        )}
      </div>
    </section>
  );
}