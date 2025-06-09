"use client";
import React, { useState } from 'react';
import { Menu, Receipt, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function ExpenseDashboard() {
  const [activeTab, setActiveTab] = useState('expenses');
  const [activeTimeframe, setActiveTimeframe] = useState('week');

  const expenseData = [
    { 
      id: 'food', 
      name: 'Food', 
      icon: '🍔', 
      color: '#22c55e',
      bgColor: 'bg-green-500',
      percentage: 84,
      amount: '$38,150',
      value: 38150
    },
    { 
      id: 'groceries', 
      name: 'Groceries', 
      icon: '🛒', 
      color: '#3b82f6',
      bgColor: 'bg-blue-500',
      percentage: 16,
      amount: '$7,140',
      value: 7140
    }
  ];

  const COLORS = ['#22c55e', '#3b82f6'];

  const timeframes = ['Day', 'Week', 'Month', 'Year', 'Period'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-gray-900 text-white">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 pt-3 pb-2 text-sm">
        <div className="flex items-center gap-1">
          <span className="font-semibold">17:14</span>
          <div className="w-4 h-4 bg-white/20 rounded-sm flex items-center justify-center">
            <div className="w-2 h-2 bg-white/60 rounded-sm"></div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white/60 rounded-full"></div>
            <div className="w-1 h-3 bg-white/30 rounded-full"></div>
          </div>
          <div className="ml-2 flex gap-1">
            <div className="w-4 h-3 border border-white/60 rounded-sm">
              <div className="w-1 h-1 bg-white/60 rounded-full m-0.5"></div>
            </div>
            <div className="w-4 h-3 border border-white/60 rounded-sm">
              <div className="w-2 h-1 bg-white/60 rounded-full m-0.5"></div>
            </div>
          </div>
          <div className="bg-green-500 text-xs px-1 rounded text-black font-semibold">35%</div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <Menu size={24} className="text-white cursor-pointer" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-lg">$</span>
          </div>
          <span className="text-lg font-medium">Total</span>
          <ChevronLeft size={20} className="rotate-90" />
        </div>
        <Receipt size={24} className="text-white cursor-pointer" />
      </div>

      {/* Total Amount */}
      <div className="text-center mb-6">
        <div className="text-4xl font-light mb-2">$32,749</div>
      </div>

      {/* Tabs */}
      <div className="flex mx-4 mb-6">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex-1 py-3 text-center font-medium border-b-2 ${
            activeTab === 'expenses' 
              ? 'border-green-400 text-white' 
              : 'border-transparent text-gray-400'
          }`}
        >
          EXPENSES
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`flex-1 py-3 text-center font-medium border-b-2 ${
            activeTab === 'income' 
              ? 'border-green-400 text-white' 
              : 'border-transparent text-gray-400'
          }`}
        >
          INCOME
        </button>
      </div>

      {/* Main Content Card */}
      <div className="mx-4 bg-gray-800/80 rounded-3xl p-6 mb-4">
        {/* Timeframe Selector */}
        <div className="flex justify-center mb-6">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setActiveTimeframe(timeframe.toLowerCase())}
              className={`px-4 py-2 text-sm font-medium ${
                activeTimeframe === timeframe.toLowerCase()
                  ? 'text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>

        {/* Date Range */}
        <div className="flex items-center justify-center mb-8">
          <ChevronLeft size={20} className="text-gray-400 cursor-pointer" />
          <span className="mx-4 text-lg font-medium underline">Apr 20 - Apr 26</span>
          <ChevronRight size={20} className="text-gray-400 cursor-pointer" />
        </div>

        {/* Donut Chart */}
        <div className="relative mb-8 flex justify-center">
          <div className="relative w-64 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center amount */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-light text-white">$45,290</span>
            </div>
          </div>
          
          {/* Add Button */}
          <div className="absolute bottom-4 right-4">
            <button className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-600 transition-colors">
              <Plus size={24} className="text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* Category List */}
      <div className="mx-4 space-y-3">
        {expenseData.map((category) => (
          <div key={category.id} className="bg-gray-800/80 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${category.bgColor} flex items-center justify-center text-xl`}>
                {category.icon}
              </div>
              <span className="text-lg font-medium">{category.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-lg">{category.percentage}%</span>
              <span className="text-xl font-medium">{category.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}