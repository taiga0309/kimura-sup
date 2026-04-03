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
  riceSize: 'L' | 'M' | 'S';
  includesSoup: boolean;
  priority: 'drink' | 'food';
  mustHaveItems: string[];
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
