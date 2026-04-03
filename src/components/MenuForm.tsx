'use client';

import React, { useState } from 'react';
import { FormData } from '../types';
import { MENU_DATA } from '../utils/optimizer';

interface MenuFormProps {
  onSubmit: (data: FormData) => void;
}

export default function MenuForm({ onSubmit }: MenuFormProps) {
  const [formData, setFormData] = useState<FormData>({
    budget: 500000,
    people: 2,
    riceSize: 'M',
    includesSoup: true,
    priority: 'food',
    mustHaveItems: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const availableMenuItems = MENU_DATA.filter(item => 
    item.category === 'appetizer' || item.category === 'grilled'
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🍺 メニュー最適化設定</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
　　　　{/* 予算と人数 */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      合計予算 (VND)
    </label>
    <input
      type="text"
      value={formData.budget === 0 ? '' : formData.budget.toLocaleString()}
      onChange={(e) => {
        const value = e.target.value.replace(/,/g, ''); // カンマを除去
        const numValue = value === '' ? 0 : Number(value);
        if (!isNaN(numValue)) {
          setFormData({
            ...formData, 
            budget: numValue
          });
        }
      }}
      placeholder="例: 500,000"
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>
  
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      人数
    </label>
    <input
      type="number"
      value={formData.people === 0 ? '' : formData.people}
      onChange={(e) => {
        const value = e.target.value;
        setFormData({
          ...formData, 
          people: value === '' ? 0 : Number(value)
        });
      }}
      placeholder="例: 2"
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      min="1"
      max="10"
    />
  </div>
</div>

        {/* ご飯サイズ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ご飯サイズ優先
          </label>
          <select
            value={formData.riceSize}
            onChange={(e) => setFormData({...formData, riceSize: e.target.value as 'L' | 'M' | 'S'})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="L">L (50,000 VND)</option>
            <option value="M">M (40,000 VND)</option>
            <option value="S">S (30,000 VND)</option>
          </select>
        </div>

        {/* スープ */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="soup"
            checked={formData.includesSoup}
            onChange={(e) => setFormData({...formData, includesSoup: e.target.checked})}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="soup" className="ml-2 block text-sm text-gray-700">
            スープを含める (+24,000 VND × 人数)
          </label>
        </div>

        {/* 優先設定 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            優先設定
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="food"
                checked={formData.priority === 'food'}
                onChange={(e) => setFormData({...formData, priority: e.target.value as 'food' | 'drink'})}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">食事重視</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="drink"
                checked={formData.priority === 'drink'}
                onChange={(e) => setFormData({...formData, priority: e.target.value as 'food' | 'drink'})}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">ドリンク重視</span>
            </label>
          </div>
        </div>

        {/* 絶対に頼みたいメニュー */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            絶対に頼みたいメニュー（複数選択可）
          </label>
          <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
            {availableMenuItems.map(item => (
              <label key={item.id} className="flex items-center py-1">
                <input
                  type="checkbox"
                  checked={formData.mustHaveItems.includes(item.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        mustHaveItems: [...formData.mustHaveItems, item.id]
                      });
                    } else {
                      setFormData({
                        ...formData,
                        mustHaveItems: formData.mustHaveItems.filter(id => id !== item.id)
                      });
                    }
                  }}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {item.name} ({item.price.toLocaleString()} VND)
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 px-4 rounded-lg transition duration-200"
        >
          🎯 最適プラン生成
        </button>
      </form>
    </div>
  );
}
