'use client';

import React, { useState } from 'react';
import { FormData } from '../types';
import { MENU_DATA } from '../utils/optimizer';

interface MenuFormProps {
  onSubmit: (data: FormData) => void;
}

export default function MenuForm({ onSubmit }: MenuFormProps) {
  const [formData, setFormData] = useState<FormData>({
    budget: 0,
    people: 2,
    priority: 'food',
    mustHaveItems: [],
    drinkRequirements: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // メニューをカテゴリ別に分ける
  const appetizerItems = MENU_DATA.filter(item => item.category === 'appetizer');
  const grilledItems = MENU_DATA.filter(item => item.category === 'grilled');
  const riceItems = MENU_DATA.filter(item => item.category === 'rice');

  // 数量変更のヘルパー関数
  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    const newRequirements = formData.mustHaveItems.filter(req => req.itemId !== itemId);
    if (newQuantity > 0) {
      newRequirements.push({ itemId, quantity: newQuantity });
    }
    setFormData({
      ...formData,
      mustHaveItems: newRequirements
    });
  };

  // メニューセクションのコンポーネント
  const MenuSection = ({ title, items, emoji }: { title: string; items: any[]; emoji: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {emoji} {title}（数量指定可）
      </label>
      <div className="space-y-3 border border-gray-300 rounded-md p-4 max-h-48 overflow-y-auto">
        {items.map(item => {
          const currentRequirement = formData.mustHaveItems.find(req => req.itemId === item.id);
          const currentQuantity = currentRequirement ? currentRequirement.quantity : 0;
          
          return (
            <div key={item.id} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                {item.name} ({item.price.toLocaleString()} VND)
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => updateItemQuantity(item.id, Math.max(0, currentQuantity - 1))}
                  className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-semibold">
                  {currentQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateItemQuantity(item.id, currentQuantity + 1)}
                  className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
        
        {/* 選択中の表示 */}
        {formData.mustHaveItems.filter(req => items.some(item => item.id === req.itemId)).length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>選択中:</strong> {formData.mustHaveItems
                .filter(req => items.some(item => item.id === req.itemId))
                .map(req => {
                  const item = items.find(menuItem => menuItem.id === req.itemId);
                  return `${item?.name} ${req.quantity}${item?.category === 'rice' ? '個' : '皿'}`;
                }).join(', ')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              小計: {formData.mustHaveItems
                .filter(req => items.some(item => item.id === req.itemId))
                .reduce((sum, req) => {
                  const item = items.find(menuItem => menuItem.id === req.itemId);
                  return sum + (item ? item.price * req.quantity : 0);
                }, 0).toLocaleString()} VND
            </p>
          </div>
        )}
      </div>
    </div>
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
                const value = e.target.value.replace(/,/g, '');
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

        {/* 前菜セクション */}
        <MenuSection title="前菜メニュー" items={appetizerItems} emoji="🥗" />

        {/* 焼きセクション */}
        <MenuSection title="焼きメニュー" items={grilledItems} emoji="🔥" />

        {/* ご飯系セクション */}
        <MenuSection title="ご飯・基本メニュー" items={riceItems} emoji="🍚" />

        {/* ドリンク指定 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🍺 ドリンク指定（○杯飲みたい）
          </label>
          <div className="space-y-3 border border-gray-300 rounded-md p-4">
            {MENU_DATA.filter(item => item.category === 'drink').map(drink => {
              const currentRequirement = formData.drinkRequirements.find(req => req.itemId === drink.id);
              const currentQuantity = currentRequirement ? currentRequirement.quantity : 0;
              
              return (
                <div key={drink.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    {drink.name} ({drink.price.toLocaleString()} VND)
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        const newRequirements = formData.drinkRequirements.filter(req => req.itemId !== drink.id);
                        if (currentQuantity > 0) {
                          newRequirements.push({ itemId: drink.id, quantity: Math.max(0, currentQuantity - 1) });
                        }
                        setFormData({
                          ...formData,
                          drinkRequirements: newRequirements.filter(req => req.quantity > 0)
                        });
                      }}
                      className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {currentQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newRequirements = formData.drinkRequirements.filter(req => req.itemId !== drink.id);
                        newRequirements.push({ itemId: drink.id, quantity: currentQuantity + 1 });
                        setFormData({
                          ...formData,
                          drinkRequirements: newRequirements
                        });
                      }}
                      className="w-8 h-8 bg-primary hover:bg-secondary text-white rounded-full flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
            
            {formData.drinkRequirements.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  指定ドリンク: {formData.drinkRequirements.map(req => {
                    const drink = MENU_DATA.find(item => item.id === req.itemId);
                    return `${drink?.name} ${req.quantity}杯`;
                  }).join(', ')}
                </p>
              </div>
            )}
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
