import React from 'react';
import { OptimizedResult } from '../types';

interface ResultCardProps {
  result: OptimizedResult;
  title: string;
  className?: string;
}

export default function ResultCard({ result, title, className = '' }: ResultCardProps) {
  const formatPrice = (price: number) => price.toLocaleString();

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      
      {/* サマリー */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">合計金額</p>
            <p className="text-2xl font-bold text-primary">{formatPrice(result.totalCost)} VND</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">1人あたり</p>
            <p className="text-xl font-semibold text-gray-800">{formatPrice(result.costPerPerson)} VND</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            ドリンク合計: <span className="font-semibold">{result.totalDrinks}杯</span>
            （1人あたり {result.drinksPerPerson}杯）
          </p>
        </div>
      </div>

      {/* 内訳 */}
      <div className="space-y-4">
        {/* ご飯・卵・スープ */}
        {result.breakdown.rice.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🍚 ご飯・基本</h4>
            <div className="space-y-1">
              {result.breakdown.rice.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.item.name} × {item.quantity}</span>
                  <span>{formatPrice(item.item.price * item.quantity)} VND</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 前菜 */}
        {result.breakdown.appetizers.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🥗 前菜</h4>
            <div className="space-y-1">
              {result.breakdown.appetizers.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.item.name} × {item.quantity}</span>
                  <span>{formatPrice(item.item.price * item.quantity)} VND</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 焼き */}
        {result.breakdown.grilled.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🔥 焼き</h4>
            <div className="space-y-1">
              {result.breakdown.grilled.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.item.name} × {item.quantity}</span>
                  <span>{formatPrice(item.item.price * item.quantity)} VND</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ドリンク */}
        {result.breakdown.drinks.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🍺 ドリンク</h4>
            <div className="space-y-1">
              {result.breakdown.drinks.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.item.name} × {item.quantity}</span>
                  <span>{formatPrice(item.item.price * item.quantity)} VND</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
