"use client";
import React, { useState } from "react";
import { CalendarDays } from "lucide-react";
import { getTodayString, formatDateLocal } from "../../utils/date";

export default function DateSelector({ selectedDate, onChange }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(null);

  const handleOK = () => {
    const finalDate = tempDate || selectedDate;
    onChange(finalDate);
    setShowDatePicker(false);
    setTempDate(null);
  };

  return (
    <div className="flex gap-4 items-center justify-center mb-8">
      <button
        onClick={() => onChange(getTodayString())}
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
              Select Date
            </h2>

            <input
              type="date"
              value={tempDate || selectedDate}
              onChange={(e) => setTempDate(e.target.value)}
              className="w-full text-center bg-gray-800 text-white p-2 rounded-md focus:outline-none"
            />

            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={handleOK}
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
  );
}
