import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Componente de encabezado con botón para volver y título
export default function Header({ userID }) {
  return (
    <div className="flex items-center justify-between p-4 pt-12">
      <Link href={`/${userID}/home`}>
        <ArrowLeft
          size={24}
          className="text-white cursor-pointer hover:text-gray-300"
        />
      </Link>
      <h1 className="text-xl font-semibold">Add Transactions</h1>
      <div className="w-6" />{" "}
      {/* Espaciado para balancear el header visualmente */}
    </div>
  );
}
