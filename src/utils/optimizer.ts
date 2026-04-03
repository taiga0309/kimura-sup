import { MenuItem, FormData, OptimizedResult } from '../types';

// メニューデータ
export const MENU_DATA: MenuItem[] = [
  // 前菜
  { id: 'liver-sashimi', name: 'レバ刺し', price: 139000, category: 'appetizer', satisfaction: 10 },
  { id: 'heart-sashimi', name: 'ハツ刺し', price: 139000, category: 'appetizer', satisfaction: 9 },
  { id: 'karaage', name: '唐揚げ', price: 79000, category: 'appetizer', satisfaction: 8 },
  { id: 'moyashi', name: 'もやし', price: 39000, category: 'appetizer', satisfaction: 5 },
  { id: 'seseri-ponzu', name: 'せせりポン酢', price: 69000, category: 'appetizer', satisfaction: 7 },
  { id: 'smotsu', name: 'スモツ', price: 59000, category: 'appetizer', satisfaction: 6 },
  { id: 'kimchi', name: 'キムチ', price: 39000, category: 'appetizer', satisfaction: 6 },
  { id: 'sausage', name: 'シャウエッセン', price: 62000, category: 'appetizer', satisfaction: 7 },

  // 焼き
  { id: 'abura', name: 'あぶら', price: 79000, category: 'grilled', satisfaction: 8 },
  { id: 'harami', name: 'はらみ', price: 89000, category: 'grilled', satisfaction: 9 },
  { id: 'beef-bara', name: '牛ばら', price: 89000, category: 'grilled', satisfaction: 8 },
  { id: 'sagari', name: 'さがり', price: 129000, category: 'grilled', satisfaction: 9 },
  { id: 'nakaochi', name: '中おち', price: 119000, category: 'grilled', satisfaction: 8 },
  { id: 'pork-bara', name: '豚バラ', price: 69000, category: 'grilled', satisfaction: 7 },
  { id: 'pork-tan', name: '豚たん', price: 89000, category: 'grilled', satisfaction: 8 },
  { id: 'dice-steak', name: 'サイコロステーキ', price: 149000, category: 'grilled', satisfaction: 10 },
  { id: 'levanira', name: 'レバニラ', price: 89000, category: 'grilled', satisfaction: 7 },
  { id: 'saba-fry', name: '鯖フライ', price: 69000, category: 'grilled', satisfaction: 7 },
  { id: 'hormone-mix', name: 'ホルモンMIX', price: 149000, category: 'grilled', satisfaction: 9 },

  // ご飯
  { id: 'rice-s', name: 'ご飯S', price: 30000, category: 'rice', satisfaction: 4 },
  { id: 'rice-m', name: 'ご飯M', price: 40000, category: 'rice', satisfaction: 5 },
  { id: 'rice-l', name: 'ご飯L', price: 50000, category: 'rice', satisfaction: 6 },
  { id: 'egg', name: '卵', price: 10000, category: 'rice', satisfaction: 3 },
  { id: 'soup', name: 'スープ', price: 24000, category: 'rice', satisfaction: 4 },

  // ドリンク
  { id: 'happy', name: 'ハッピー', price: 30000, category: 'drink', satisfaction: 6 },
  { id: 'unhappy', name: 'アンハッピー', price: 59000, category: 'drink', satisfaction: 8 },
  { id: 'cola', name: 'コーラ', price: 30000, category: 'drink', satisfaction: 5 },
];

export function optimizeMenu(formData: FormData): OptimizedResult {
  const { budget, people, riceSize, includesSoup, priority, mustHaveItems, drinkRequirements } = formData;
  
  // 必須コスト計算（ご飯 + 卵）
  const riceItem = MENU_DATA.find(item => item.id === `rice-${riceSize.toLowerCase()}`)!;
  const eggItem = MENU_DATA.find(item => item.id === 'egg')!;
  const soupItem = MENU_DATA.find(item => item.id === 'soup')!;
  
  let mandatoryCost = (riceItem.price + eggItem.price) * people;
  let selectedItems: { item: MenuItem; quantity: number }[] = [
    { item: riceItem, quantity: people },
    { item: eggItem, quantity: people }
  ];
  
  // スープを含める場合
  if (includesSoup) {
    mandatoryCost += soupItem.price * people;
    selectedItems.push({ item: soupItem, quantity: people });
  }
  
  // 必須メニューのコスト（数量指定対応）
  let mustHaveCost = 0;
  mustHaveItems.forEach(req => {
    const item = MENU_DATA.find(menuItem => menuItem.id === req.itemId);
    if (item) {
      mustHaveCost += item.price * req.quantity;
      selectedItems.push({ item, quantity: req.quantity });
    }
  });
  
  // 指定ドリンクのコスト
  let specifiedDrinkCost = 0;
  drinkRequirements.forEach(req => {
    const drink = MENU_DATA.find(item => item.id === req.itemId);
    if (drink) {
      specifiedDrinkCost += drink.price * req.quantity;
      selectedItems.push({ item: drink, quantity: req.quantity });
    }
  });
  
  // 指定ドリンクで足りない分の最低ドリンクを計算
  const totalSpecifiedDrinks = drinkRequirements.reduce((sum, req) => sum + req.quantity, 0);
  const remainingDrinksNeeded = Math.max(0, people - totalSpecifiedDrinks);
  
  let minDrinkCost = 0;
  if (remainingDrinksNeeded > 0) {
    const cheapestDrink = MENU_DATA.filter(item => 
      item.category === 'drink' && 
      !drinkRequirements.some(req => req.itemId === item.id)
    ).sort((a, b) => a.price - b.price)[0];
    
    if (cheapestDrink) {
      minDrinkCost = cheapestDrink.price * remainingDrinksNeeded;
      selectedItems.push({ item: cheapestDrink, quantity: remainingDrinksNeeded });
    }
  }
  
  // 残り予算
  let remainingBudget = budget - mandatoryCost - mustHaveCost - specifiedDrinkCost - minDrinkCost;
  
  // 残り予算でアイテムを最適化
  if (remainingBudget > 0) {
    const availableItems = MENU_DATA.filter(item => 
      !mustHaveItems.some(req => req.itemId === item.id) && 
      item.category !== 'rice' && 
      item.id !== 'egg' && 
      item.id !== 'soup' &&
      !drinkRequirements.some(req => req.itemId === item.id)
    );
    
    // 優先度に基づいてアイテムを選択
    const prioritizedItems = priority === 'drink' 
      ? availableItems.filter(item => item.category === 'drink').concat(
          availableItems.filter(item => item.category !== 'drink')
        )
      : availableItems.filter(item => item.category !== 'drink').concat(
          availableItems.filter(item => item.category === 'drink')
        );
    
    // 満足度/価格比でソート
    prioritizedItems.sort((a, b) => (b.satisfaction / b.price) - (a.satisfaction / a.price));
    
    for (const item of prioritizedItems) {
      if (remainingBudget >= item.price) {
        const existingItem = selectedItems.find(si => si.item.id === item.id);
        if (existingItem) {
          existingItem.quantity++;
        } else {
          selectedItems.push({ item, quantity: 1 });
        }
        remainingBudget -= item.price;
      }
    }
  }
  
  // 結果を整理
  const totalCost = selectedItems.reduce((sum, si) => sum + (si.item.price * si.quantity), 0);
  const totalDrinks = selectedItems
    .filter(si => si.item.category === 'drink')
    .reduce((sum, si) => sum + si.quantity, 0);
  
  const breakdown = {
    rice: selectedItems.filter(si => si.item.category === 'rice' || si.item.id === 'egg' || si.item.id === 'soup'),
    appetizers: selectedItems.filter(si => si.item.category === 'appetizer'),
    grilled: selectedItems.filter(si => si.item.category === 'grilled'),
    drinks: selectedItems.filter(si => si.item.category === 'drink'),
  };
  
  return {
    items: selectedItems,
    totalCost,
    costPerPerson: Math.round(totalCost / people),
    totalDrinks,
    drinksPerPerson: Math.round((totalDrinks / people) * 10) / 10,
    breakdown
  };
}

// 代替プラン生成
export function generateAlternativePlans(formData: FormData): {
  drinkFocused: OptimizedResult;
  foodFocused: OptimizedResult;
} {
  const drinkFocused = optimizeMenu({ ...formData, priority: 'drink' });
  const foodFocused = optimizeMenu({ ...formData, priority: 'food' });
  
  return { drinkFocused, foodFocused };
}
