import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useShop } from '../App';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useShop();
  
  const product = products.find(p => p.id === id);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  if (!product) {
    return <div className="p-10 text-center text-white">Product not found</div>;
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
        alert("Please select a size and color.");
        return;
    }
    addToCart(product, selectedSize, selectedColor);
    // Directly navigate to cart to proceed with checkout
    navigate('/cart');
  };

  return (
    <div className="bg-[#0b0c0f] text-gray-100">
      <div className="pt-6 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </button>
        </div>

        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:gap-x-12">
          {/* Image */}
          <div className="lg:max-w-lg lg:self-end">
            <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border border-gray-800 shadow-2xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-center object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-black tracking-tight text-white uppercase">{product.name}</h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-[#1ce783] font-bold">${product.price}</p>
            </div>

            {/* Reviews Mock */}
            <div className="mt-3">
               <div className="flex items-center">
                  <div className="flex items-center text-[#1ce783]">
                     {[0, 1, 2, 3, 4].map((rating) => (
                       <Star key={rating} className="h-4 w-4 fill-current" />
                     ))}
                  </div>
                  <p className="sr-only">5 out of 5 stars</p>
                  <a href="#" className="ml-3 text-sm font-medium text-gray-400 hover:text-white transition-colors">117 reviews</a>
               </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-300 space-y-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>

            <div className="mt-8 border-t border-gray-800 pt-8">
               {/* Colors */}
               <h3 className="text-sm font-medium text-gray-200">Color</h3>
               <div className="mt-2 flex items-center space-x-3">
                  {product.colors.map((color) => (
                    <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            selectedColor === color 
                                ? 'bg-[#1ce783] text-black font-bold ring-2 ring-offset-2 ring-offset-black ring-[#1ce783]' 
                                : 'bg-[#15171c] border border-gray-700 text-gray-300 hover:bg-gray-800'
                        }`}
                    >
                        {color}
                    </button>
                  ))}
               </div>
            </div>

            <div className="mt-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-200">Size</h3>
                    <a href="#" className="text-sm font-medium text-[#1ce783] hover:text-[#15bd6b]">Size guide</a>
                </div>
                <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 mt-2">
                    {product.sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-800 focus:outline-none sm:flex-1 transition-all ${
                                selectedSize === size 
                                ? 'border-[#1ce783] ring-1 ring-[#1ce783] text-[#1ce783] bg-[#1ce783]/10'
                                : 'border-gray-700 bg-[#15171c] text-gray-300'
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-10 flex sm:flex-col1">
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-[#1ce783] border border-transparent rounded-md py-4 px-8 flex items-center justify-center text-base font-bold text-black hover:bg-[#15bd6b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#1ce783] transition-all transform hover:scale-[1.02]"
                >
                    ADD TO BAG
                </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
               <div className="flex items-center text-gray-500 text-sm">
                 <Truck className="h-5 w-5 mr-2" /> Free shipping over $100
               </div>
               <div className="flex items-center text-gray-500 text-sm">
                 <ShieldCheck className="h-5 w-5 mr-2" /> 2-year warranty
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};