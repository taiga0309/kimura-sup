import React from 'react';
import { OptimizedResult } from '../types';
import ResultCard from './ResultCard';

interface AlternativePlansProps {
  drinkFocused: OptimizedResult;
  foodFocused: OptimizedResult;
}

export default function AlternativePlans({ drinkFocused, foodFocused }: AlternativePlansProps) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🔄 代替プラン</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResultCard
          result={drinkFocused}
          title="🍺 飲み重視プラン"
          className="border-l-4 border-blue-500"
        />
        
        <ResultCard
          result={foodFocused}
          title="🍖 食事重視プラン"
          className="border-l-4 border-green-500"
        />
      </div>
    </div>
  );
}
