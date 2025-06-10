"use client";
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus } from 'lucide-react';
import Link from "next/link";

export default function DonutChartSection({ data, userID }) {
  const [currentCenterAmount, setCurrentCenterAmount] = useState(0);
  const [formattedCenterAmount, setFormattedCenterAmount] = useState("$0");

  const calcularCenterAmount = () => {
    let total = 0;
    if (Array.isArray(data)) {
      for (const element of data) {
        if (typeof element.value === 'number') {
          total += element.value;
        }
      }
    }
    setCurrentCenterAmount(total);
    setFormattedCenterAmount(`$${total.toLocaleString('en-US')}`);
  };

  useEffect(() => {
    calcularCenterAmount();
  }, [data]);

  return (
    <div className="relative mb-8 flex justify-center">
      <div className="relative" style={{ width: 256, height: 256 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
            >
              {Array.isArray(data) && data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>

            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-3xl font-light"
              style={{ fill: 'white', pointerEvents: 'none' }}
            >
              {formattedCenterAmount}
            </text>

            <Tooltip
              totalValue={currentCenterAmount}
              content={({ active, payload, totalValue }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;

                  // Calculo el porcentaje
                  const calculatedPercentage = totalValue > 0
                    ? ((item.value / totalValue) * 100).toFixed(2)
                    : 0;

                  return (
                    <div
                      className="p-3 rounded-lg shadow-lg text-sm border border-gray-700"
                      style={{
                        backgroundColor: '#000000',
                        color: '#FFFFFF',
                        zIndex: 9999,
                        position: 'relative'
                      }}
                    >
                      <div className="font-semibold mb-1">{item.icon} {item.name}</div>
                      <div>Amount: {item.value}</div>
                      <div>Percentage: {calculatedPercentage}%</div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Add Button */}
      <div className="absolute bottom-4 right-4">
        <Link href={`/${userID}/transaction`}>
          <button className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-600 transition-colors">
            <Plus size={24} className="text-black" />
          </button>
        </Link>
      </div>
    </div>
  );
}