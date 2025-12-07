import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { useShop } from '../App';

export const ProductList: React.FC = () => {
  const { products } = useShop();
  const [category, setCategory] = useState<string | 'All'>('All');
  const [maxPrice, setMaxPrice] = useState<number>(250);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = category === 'All' || p.category === category;
      const matchesPrice = p.price <= maxPrice;
      return matchesCategory && matchesPrice;
    });
  }, [products, category, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-baseline border-b border-gray-800 pb-6 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">New Arrivals</h1>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center text-sm font-medium text-gray-300 hover:text-white lg:hidden"
        >
          <Filter className="mr-2 h-4 w-4" /> Filters
        </button>
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-x-8">
        {/* Filters Sidebar */}
        <div className={`lg:block ${showFilters ? 'block' : 'hidden'} mb-6 lg:mb-0`}>
           <div className="space-y-8 bg-[#15171c] p-6 rounded-lg border border-gray-800">
             <div>
               <h3 className="text-sm font-bold text-white mb-4 flex items-center tracking-wider uppercase"><SlidersHorizontal className="h-4 w-4 mr-2 text-[#1ce783]"/> Category</h3>
               <div className="space-y-3">
                 {categories.map(c => (
                   <div key={c} className="flex items-center group cursor-pointer" onClick={() => setCategory(c)}>
                     <div className={`w-4 h-4 rounded-full border border-gray-500 mr-3 flex items-center justify-center ${category === c ? 'border-[#1ce783]' : 'group-hover:border-white'}`}>
                        {category === c && <div className="w-2 h-2 rounded-full bg-[#1ce783]"></div>}
                     </div>
                     <span className={`text-sm ${category === c ? 'text-[#1ce783]' : 'text-gray-400 group-hover:text-white'}`}>
                       {c}
                     </span>
                   </div>
                 ))}
               </div>
             </div>

             <div>
                <h3 className="text-sm font-bold text-white mb-4 tracking-wider uppercase">Max Price: <span className="text-[#1ce783]">${maxPrice}</span></h3>
                <input 
                  type="range" 
                  min="0" 
                  max="300" 
                  step="10" 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#1ce783]"
                />
             </div>
           </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
            {filteredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group relative block">
                <div className="w-full aspect-w-1 aspect-h-1 bg-[#15171c] rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8 border border-gray-800 transition-all duration-300 group-hover:border-[#1ce783]/50 group-hover:shadow-[0_0_20px_rgba(28,231,131,0.15)] transform group-hover:-translate-y-1">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-center object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  {product.isFeatured && (
                    <span className="absolute top-2 left-2 bg-[#1ce783] text-black text-xs font-bold px-2 py-1 rounded">
                      HOT
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-sm text-gray-300 group-hover:text-white transition-colors">{product.name}</h3>
                <p className="mt-1 text-lg font-bold text-white">${product.price}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>
              </Link>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-[#15171c] rounded-lg border border-gray-800">
              <p className="text-gray-400 text-lg">No products found within this range.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};