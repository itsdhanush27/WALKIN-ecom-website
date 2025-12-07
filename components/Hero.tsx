import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative bg-[#0b0c0f] overflow-hidden">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover opacity-30"
          src="https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Sneaker background"
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0f] via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c0f] via-[#0b0c0f]/70 to-transparent"></div>
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl uppercase">
          Walk Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1ce783] to-green-500">Own Path</span>
        </h1>
        <p className="mt-6 text-xl text-gray-300 max-w-2xl font-light">
          Discover the latest in urban footwear technology. Engineered for comfort, designed for the streets. 
          Experience the Walkin.it difference today.
        </p>
        <div className="mt-10 max-w-sm sm:flex sm:max-w-none gap-4">
            <Link
              to="/shop"
              className="flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-md shadow-sm text-black bg-[#1ce783] hover:bg-[#15bd6b] transition-all transform hover:scale-105"
            >
              Shop Collection
            </Link>
            <Link
              to="/about"
              className="mt-3 sm:mt-0 flex items-center justify-center px-8 py-4 border border-gray-600 text-base font-medium rounded-md text-white bg-transparent hover:bg-white/10 transition-all"
            >
              Our Story <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </div>
      </div>
    </div>
  );
};