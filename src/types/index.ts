export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'appetizer' | 'grilled' | 'rice' | 'drink';
  satisfaction: number;
}

export interface FormData {
  budget: number;
  people: number;
  priority: 'drink' | 'food';
  mustHaveItems: { itemId: string; quantity: number }[];
  drinkRequirements: { itemId: string; quantity: number }[];
}

export interface OptimizedResult {
  items: { item: MenuItem; quantity: number }[];
  totalCost: number;
  costPerPerson: number;
  totalDrinks: number;
  drinksPerPerson: number;
  breakdown: {
    rice: { item: MenuItem; quantity: number }[];
    appetizers: { item: MenuItem; quantity: number }[];
    grilled: { item: MenuItem; quantity: number }[];
    drinks: { item: MenuItem; quantity: number }[];
  };
}
