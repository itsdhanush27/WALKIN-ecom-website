export interface Product {
  id: string;
  name: string;
  price: number;
  category: string; // 'Running', 'Lifestyle', 'Basketball'
  sizes: number[];
  colors: string[];
  image: string;
  description: string;
  isFeatured?: boolean;
}

export interface CartItem extends Product {
  selectedSize: number;
  selectedColor: string;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
}

export interface FilterState {
  category: string | null;
  minPrice: number;
  maxPrice: number;
}