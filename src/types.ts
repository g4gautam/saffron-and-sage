export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  time: string;
  calories: string;
  level: 'Easy' | 'Intermediate' | 'Hard';
  tags: string[];
  ingredients: Ingredient[];
  steps: Step[];
  trending?: boolean;
  featured?: boolean;
  youtubeVideoId?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  amountMetric?: string;
  amountImperial?: string;
  category: 'Produce' | 'Pantry' | 'Dairy' | 'Meat' | 'Other';
  inStock?: boolean;
}

export interface Step {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  imageUrl?: string;
}

export interface PantryItem {
  id: string;
  name: string;
  category: string;
  level: 'Low' | 'Half' | 'Full';
  quantity: number;
  unit: string;
  icon: string;
  active: boolean;
}
