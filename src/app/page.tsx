'use client';

import React, { useState } from 'react';
import MenuForm from '../components/MenuForm';
import ResultCard from '../components/ResultCard';
import AlternativePlans from '../components/AlternativePlans';
import { FormData, OptimizedResult } from '../types';
import { optimizeMenu, generateAlternativePlans } from '../utils/optimizer';

export default function Home() {
  const [result, setResult] = useState<OptimizedResult | null>(null);
  const [alternatives, setAlternatives] = useState<{
    drinkFocused: OptimizedResult;
    foodFocused: OptimizedResult;
  } | null>(null);

  const handleFormSubmit = (formData: FormData) => {
    // メイン結果を生成
    const optimizedResult = optimizeMenu(formData);
    setResult(optimizedResult);

    // 代替プランを生成
    const alternativePlans = generateAlternativePlans(formData);
    setAlternatives(alternativePlans);
  };

  const handleRecalculate = (priority: 'drink' | 'food') => {
    if (result) {
      // 現在の設定で優先度だけ変更して再計算
      // この実装では簡略化のため、代替プランから選択
      if (alternatives) {
        if (priority === 'drink') {
          setResult(alternatives.drinkFocused);
        } else {
          setResult(alternatives.foodFocused);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🍺 木村屋SUP
          </h1>
          <p className="text-gray-600">
            予算内で最適なメニュー構成を提案します
          </p>
        </div>

        {/* フォーム */}
        <MenuForm onSubmit={handleFormSubmit} />

        {/* 結果表示 */}
        {result && (
          <div className="space-y-6">
            {/* メイン結果 */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">🎯 最適プラン</h2>
                <div className="space-x-2">
                  <button
                    onClick={() => handleRecalculate('drink')}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition duration-200"
                  >
                    🍺 飲み多め
                  </button>
                  <button
                    onClick={() => handleRecalculate('food')}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition duration-200"
                  >
                    🍖 食事多め
                  </button>
                </div>
              </div>
              
              <ResultCard
                result={result}
                title="推奨プラン"
                className="border-l-4 border-primary"
              />
            </div>

            {/* 代替プラン */}
            {alternatives && (
              <AlternativePlans
                drinkFocused={alternatives.drinkFocused}
                foodFocused={alternatives.foodFocused}
              />
            )}
          </div>
        )}

        {/* フッター */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2026 2024 木村屋SUP</p>
        </footer>
      </div>
    </div>
  );
}
