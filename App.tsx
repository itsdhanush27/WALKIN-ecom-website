import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductList } from './components/ProductList';
import { ProductDetail } from './components/ProductDetail';
import { Cart } from './components/Cart';
import { Admin } from './components/Admin';
import { AIChat } from './components/AIChat';
import { INITIAL_PRODUCTS, MOCK_USER } from './constants';
import { Product, CartItem, User } from './types';

// Context Definition
interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  addToCart: (product: Product, size: number, color: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  addProduct: (product: Product) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within a ShopProvider");
  return context;
};

const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(MOCK_USER);

  const addToCart = (product: Product, selectedSize: number, selectedColor: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, selectedSize, selectedColor, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  return (
    <ShopContext.Provider value={{ products, cart, user, addToCart, removeFromCart, clearCart, addProduct }}>
      {children}
    </ShopContext.Provider>
  );
};

// Pages
const Home: React.FC = () => (
  <div className="flex flex-col gap-12">
    <Hero />
    
    <div className="py-12 bg-[#0b0c0f] mb-12">
      <div className="text-center mb-16 px-4">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Featured Kicks</h2>
        <p className="mt-4 text-gray-400">Curated for the modern sneakerhead.</p>
      </div>
      <ProductList /> 
    </div>
    
    <div className="bg-[#15171c] py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-800 mt-12">
       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
              <h2 className="text-3xl font-bold text-white mb-4">Join the Walkin.it Community</h2>
              <p className="text-gray-400 mb-6">Get early access to drops, exclusive colorways, and member-only events. Sign up now and get 15% off your first order.</p>
              <div className="flex gap-2">
                 <input type="email" placeholder="Enter your email" className="px-4 py-3 rounded-md w-full max-w-xs focus:outline-none bg-gray-800 border border-gray-700 text-white focus:border-[#1ce783]" />
                 <button className="bg-[#1ce783] text-black px-6 py-3 rounded-md font-bold hover:bg-[#15bd6b] transition-colors">Subscribe</button>
              </div>
          </div>
          <div className="hidden md:block">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" alt="Shoe detail" className="rounded-xl opacity-90 shadow-2xl shadow-green-900/20" />
          </div>
       </div>
    </div>
  </div>
);

const TrackOrder: React.FC = () => (
  <div className="max-w-md mx-auto py-24 px-4 text-center">
    <h1 className="text-3xl font-bold mb-6 text-white">Track Your Order</h1>
    <p className="text-gray-400 mb-8">Enter your order ID to see where your kicks are at.</p>
    <input type="text" placeholder="Order ID (e.g. WLK-9921)" className="w-full bg-[#1a1c24] border border-gray-700 text-white p-3 rounded mb-4 focus:outline-none focus:border-[#1ce783]" />
    <button className="w-full bg-[#1ce783] text-black font-bold p-3 rounded hover:bg-[#15bd6b] transition-colors">Track</button>
  </div>
);

const Footer: React.FC = () => (
  <footer className="bg-[#0b0c0f] border-t border-gray-800 mt-auto pt-12 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
      <div className="flex justify-center space-x-6 md:order-2">
        <span className="text-gray-400 hover:text-[#1ce783] cursor-pointer transition-colors">Instagram</span>
        <span className="text-gray-400 hover:text-[#1ce783] cursor-pointer transition-colors">Twitter</span>
        <span className="text-gray-400 hover:text-[#1ce783] cursor-pointer transition-colors">TikTok</span>
      </div>
      <div className="mt-8 md:mt-0 md:order-1">
        <p className="text-center text-base text-gray-500">&copy; 2024 Walkin.it, Inc. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <ShopProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col font-sans bg-[#0b0c0f] text-gray-100">
          <Navbar />
          {/* Main content wrapper with padding at bottom to separate from footer */}
          <div className="flex-grow pb-24">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/login" element={<Navigate to="/" replace />} /> {/* Mock login redirect */}
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </div>
          <Footer />
          <AIChat />
        </div>
      </HashRouter>
    </ShopProvider>
  );
};

export default App;