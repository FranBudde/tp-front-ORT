"use client";
import React from "react";

export default function AddButton({ onClick }) {
  return (
    <div className="sticky bottom-4 left-0 right-0 px-4 mt-8">
      <button
        onClick={onClick}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-4 rounded-2xl text-lg transition-colors shadow-lg"
      >
        Add
      </button>
    </div>
  );
}
