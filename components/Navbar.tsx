import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, Menu, Search, X } from 'lucide-react';
import { useShop } from '../App';

export const Navbar: React.FC = () => {
  const { cart, user } = useShop();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-[#0b0c0f]/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-2xl font-black italic tracking-tighter text-white">
              WALKIN<span className="text-[#1ce783]">.IT</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white font-medium transition-colors">Home</Link>
            <Link to="/shop" className="text-gray-300 hover:text-white font-medium transition-colors">Shop All</Link>
            <Link to="/track-order" className="text-gray-300 hover:text-white font-medium transition-colors">Track Order</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-[#1ce783] hover:text-[#15bd6b] font-medium transition-colors">Admin</Link>
            )}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <button className="text-gray-300 hover:text-white transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <Link to="/cart" className="relative text-gray-300 hover:text-[#1ce783] transition-colors">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#1ce783] text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
               <UserIcon className="h-5 w-5" />
            </Link>
            <button 
              className="md:hidden text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#15171c] border-b border-gray-800 animate-fade-in-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-md">Home</Link>
             <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-md">Shop</Link>
             <Link to="/track-order" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-md">Track Order</Link>
             {user?.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-[#1ce783] hover:bg-gray-800 rounded-md">Admin Dashboard</Link>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};