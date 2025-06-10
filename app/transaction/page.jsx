"use client";
import React, { useState } from 'react';
import { ArrowLeft, Calculator, Plus, Search } from 'lucide-react';

export default function AddTransactionForm() {
  const [activeTab, setActiveTab] = useState('expenses');
  const [amount, setAmount] = useState('0');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDate, setSelectedDate] = useState('today');
  const [tags, setTags] = useState([]);
  const [comment, setComment] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');

  const categories = [
    { id: 'transport', name: 'Transportation', icon: '🚌', color: 'bg-gray-500' },
    { id: 'groceries', name: 'Groceries', icon: '🛒', color: 'bg-blue-500' },
    { id: 'beauty', name: 'Peluquería', icon: '✂️', color: 'bg-pink-500' },
    { id: 'food', name: 'Food', icon: '🍔', color: 'bg-green-500' },
    { id: 'rent', name: 'Alquiler y Expensas', icon: '🏠', color: 'bg-green-600' },
    { id: 'health', name: 'Psicólogo', icon: '❤️', color: 'bg-red-500' },
    { id: 'services', name: 'Servicios', icon: '💰', color: 'bg-blue-600' },
    { id: 'more', name: 'More', icon: '+', color: 'bg-gray-600' }
  ];

  const dates = [
    { id: 'today', label: '5/6\ntoday', active: true },
    { id: 'yesterday', label: '5/5\nyesterday', active: false },
    { id: 'twoDays', label: '5/4\ntwo days ago', active: false }
  ];

  const handleAmountChange = (value) => {
    if (value === 'C') {
      setAmount('0');
    } else if (value === '⌫') {
      setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else {
      setAmount(prev => {
        if (prev === '0') return value;
        return prev + value;
      });
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-gray-900 text-white flex justify-center">
      <div className="w-full max-w-md mx-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <ArrowLeft size={24} className="text-white cursor-pointer hover:text-gray-300" />
        <h1 className="text-xl font-semibold">Add Transactions</h1>
        <div className="w-6" />
      </div>

      {/* Tabs */}
      <div className="flex mx-4 mb-6">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex-1 py-3 text-center font-medium border-b-2 ${
            activeTab === 'expenses' 
              ? 'border-white text-white' 
              : 'border-transparent text-gray-400'
          }`}
        >
          EXPENSES
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`flex-1 py-3 text-center font-medium border-b-2 ${
            activeTab === 'income' 
              ? 'border-white text-white' 
              : 'border-transparent text-gray-400'
          }`}
        >
          INCOME
        </button>
      </div>

      {/* Amount Display */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="text-5xl font-light">{amount}</span>
          <span className="text-2xl text-green-400 font-medium">ARS</span>
          <Calculator size={28} className="text-gray-400" />
        </div>
      </div>

      {/* Account */}
      <div className="px-4 mb-6">
        <div className="text-gray-400 text-sm mb-1">Account</div>
        <div className="text-green-400 text-lg font-medium">Main</div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-6">
        <div className="text-gray-400 text-sm mb-4">Categories</div>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex flex-col items-center p-3 rounded-2xl transition-all hover:scale-105 ${
                selectedCategory === category.id 
                  ? 'ring-2 ring-green-400' 
                  : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center text-xl mb-2`}>
                {category.icon}
              </div>
              <span className="text-xs text-center text-gray-300 leading-tight">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Date Selection */}
      <div className="px-4 mb-6">
        <div className="flex gap-4">
          {dates.map((date) => (
            <button
              key={date.id}
              onClick={() => setSelectedDate(date.id)}
              className={`px-4 py-3 rounded-xl text-sm whitespace-pre-line ${
                selectedDate === date.id 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {date.label}
            </button>
          ))}
          <button className="px-4 py-3 bg-gray-700 rounded-xl">
            <Calculator size={16} className="text-gray-300" />
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-400 text-sm">Tags</span>
          <Search size={20} className="text-gray-400" />
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              onClick={() => removeTag(tag)}
              className="bg-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-600"
            >
              {tag} ×
            </span>
          ))}
        </div>

        {showTagInput ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
              placeholder="Escribe un tag..."
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
            />
            <button
              onClick={addTag}
              className="bg-green-500 px-4 py-2 rounded-lg"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowTagInput(true)}
            className="flex items-center gap-2 border-2 border-dashed border-gray-600 rounded-lg px-4 py-3 w-full justify-center text-gray-400"
          >
            <Plus size={20} />
            Add tag
          </button>
        )}
      </div>

      {/* Comment */}
      <div className="px-4 mb-6">
        <div className="text-gray-400 text-sm mb-2">Comment</div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 resize-none focus:border-green-400 focus:outline-none transition-colors"
          placeholder="Add comment..."
          rows={2}
        />
        <div className="text-right text-xs text-gray-500 mt-1">
          {comment.length}/4096
        </div>
      </div>

      {/* Photo Section */}
      <div className="px-4 mb-6">
        <div className="text-gray-400 text-sm mb-4">Photo</div>
        <button className="w-full border-2 border-dashed border-gray-600 rounded-lg py-6 flex flex-col items-center justify-center text-gray-400 hover:border-gray-500 transition-colors">
          <Plus size={24} className="mb-2" />
          <span>Add Photo</span>
        </button>
      </div>

      {/* Add Button */}
      <div className="sticky bottom-4 left-0 right-0 px-4 mt-8">
        <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-4 rounded-2xl text-lg transition-colors shadow-lg">
          Add
        </button>
      </div>
      </div>
    </div>
  );
}