import React, { useState } from 'react';
import { Trash2, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { useShop } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useShop();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
      name: '', email: '', address: '', city: '', zip: '', card: '', expiry: '', cvv: ''
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleCheckout = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
          // Prepare data for Supabase
          // NOTE: We do NOT store sensitive card details (cvv, card number) in the database for security.
          const orderPayload = {
              customer_name: formData.name,
              customer_email: formData.email,
              shipping_address: formData.address,
              city: formData.city,
              zip: formData.zip,
              total_amount: total,
              items: cart, // Stores the array of items as JSONB
              status: 'Paid', // Assuming instant mock payment success
              created_at: new Date().toISOString()
          };

          const { error } = await supabase
              .from('orders')
              .insert([orderPayload]);

          if (error) {
              throw error;
          }

          // On success
          setOrderComplete(true);
          clearCart();
      } catch (error) {
          console.error("Error saving order to Supabase:", error);
          alert("There was an issue processing your order. Please try again.");
      } finally {
          setIsLoading(false);
      }
  };

  if (orderComplete) {
      return (
          <div className="max-w-7xl mx-auto px-4 py-24 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-900/30 mb-6">
                 <CheckCircle className="h-10 w-10 text-[#1ce783]" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Order Confirmed!</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">Your fresh kicks are being prepared. You will receive an email confirmation at <span className="text-white">{formData.email}</span> shortly.</p>
              <button onClick={() => navigate('/shop')} className="bg-[#1ce783] text-black px-8 py-3 rounded font-bold hover:bg-[#15bd6b] transition-colors">
                  Continue Shopping
              </button>
          </div>
      );
  }

  if (cart.length === 0 && !isCheckingOut) {
      return (
          <div className="max-w-7xl mx-auto px-4 py-32 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">Looks like you haven't found your perfect pair yet.</p>
              <Link to="/shop" className="text-[#1ce783] hover:text-[#15bd6b] font-medium inline-flex items-center">
                  Continue Shopping <ArrowRight className="ml-2 h-4 w-4"/>
              </Link>
          </div>
      );
  }

  return (
    <div className="bg-[#0b0c0f]">
      <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl mb-12">
            {isCheckingOut ? 'Checkout' : 'Shopping Cart'}
        </h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
          
          {/* LEFT COLUMN: Cart Items OR Checkout Form */}
          <section className="lg:col-span-7">
            {!isCheckingOut ? (
                // CART ITEMS LIST
                <ul className="border-t border-gray-800 divide-y divide-gray-800">
                {cart.map((item, idx) => (
                    <li key={`${item.id}-${item.selectedSize}-${idx}`} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                        <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 rounded-md object-center object-cover sm:w-32 sm:h-32 border border-gray-800"
                        />
                    </div>
                    <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                            <div className="flex justify-between">
                            <h3 className="text-sm">
                                <Link to={`/product/${item.id}`} className="font-bold text-white hover:text-[#1ce783]">
                                {item.name}
                                </Link>
                            </h3>
                            </div>
                            <div className="mt-1 flex text-sm">
                            <p className="text-gray-400">{item.selectedColor}</p>
                            <p className="ml-4 pl-4 border-l border-gray-700 text-gray-400">Size {item.selectedSize}</p>
                            </div>
                            <p className="mt-1 text-sm font-medium text-[#1ce783]">${item.price}</p>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:pr-9">
                            <label className="sr-only">Quantity</label>
                            <p className="text-sm text-gray-400">Qty {item.quantity}</p>
                            <div className="absolute top-0 right-0">
                            <button 
                                type="button" 
                                onClick={() => removeFromCart(item.id)}
                                className="-m-2 p-2 inline-flex text-gray-500 hover:text-red-500 transition-colors"
                            >
                                <span className="sr-only">Remove</span>
                                <Trash2 className="h-5 w-5" />
                            </button>
                            </div>
                        </div>
                        </div>
                    </div>
                    </li>
                ))}
                </ul>
            ) : (
                // CHECKOUT FORM
                <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
                    <div className="bg-[#15171c] p-6 rounded-lg border border-gray-800">
                        <h3 className="text-lg font-medium text-white mb-4">Contact Information</h3>
                        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-400">Email</label>
                                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full bg-[#0b0c0f] border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:border-[#1ce783] focus:ring-1 focus:ring-[#1ce783]"/>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-400">Full Name</label>
                                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full bg-[#0b0c0f] border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:border-[#1ce783] focus:ring-1 focus:ring-[#1ce783]"/>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#15171c] p-6 rounded-lg border border-gray-800">
                        <h3 className="text-lg font-medium text-white mb-4">Shipping Address</h3>
                        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-3 sm:gap-x-4">
                             <div className="sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-400">Address</label>
                                <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="mt-1 block w-full bg-[#0b0c0f] border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:border-[#1ce783] focus:ring-1 focus:ring-[#1ce783]"/>
                            </div>
                             <div className="sm:col-span-1">
                                <label className="block text-sm font-medium text-gray-400">City</label>
                                <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="mt-1 block w-full bg-[#0b0c0f] border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:border-[#1ce783] focus:ring-1 focus:ring-[#1ce783]"/>
                            </div>
                             <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-400">Postal Code</label>
                                <input required type="text" name="zip" value={formData.zip} onChange={handleInputChange} className="mt-1 block w-full bg-[#0b0c0f] border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:border-[#1ce783] focus:ring-1 focus:ring-[#1ce783]"/>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#15171c] p-6 rounded-lg border border-gray-800">
                        <h3 className="text-lg font-medium text-white mb-4">Payment</h3>
                        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-4 sm:gap-x-4">
                             <div className="sm:col-span-4">
                                <label className="block text-sm font-medium text-gray-400">Card Number</label>
                                <input required type="text" name="card" placeholder="0000 0000 0000 0000" value={formData.card} onChange={handleInputChange} className="mt-1 block w-full bg-[#0b0c0f] border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:border-[#1ce783] focus:ring-1 focus:ring-[#1ce783]"/>
                            </div>
                             <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-400">Expiry</label>
                                <input required type="text" name="expiry" placeholder="MM/YY" value={formData.expiry} onChange={handleInputChange} className="mt-1 block w-full bg-[#0b0c0f] border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:border-[#1ce783] focus:ring-1 focus:ring-[#1ce783]"/>
                            </div>
                             <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-400">CVV</label>
                                <input required type="text" name="cvv" placeholder="123" value={formData.cvv} onChange={handleInputChange} className="mt-1 block w-full bg-[#0b0c0f] border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:border-[#1ce783] focus:ring-1 focus:ring-[#1ce783]"/>
                            </div>
                        </div>
                    </div>
                </form>
            )}
          </section>

          {/* RIGHT COLUMN: Order Summary */}
          <section className="mt-16 bg-[#15171c] rounded-lg border border-gray-800 px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5 sticky top-24">
            <h2 className="text-lg font-medium text-white">Order summary</h2>
            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-400">Subtotal</dt>
                <dd className="text-sm font-medium text-white">${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-700 pt-4">
                <dt className="flex items-center text-sm text-gray-400">
                  <span>Shipping estimate</span>
                </dt>
                <dd className="text-sm font-medium text-white">${shipping.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-700 pt-4">
                <dt className="text-base font-bold text-white">Order total</dt>
                <dd className="text-base font-bold text-[#1ce783]">${total.toFixed(2)}</dd>
              </div>
            </dl>

            <div className="mt-6">
              {!isCheckingOut ? (
                <button
                    type="button"
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full bg-[#1ce783] border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-bold text-black hover:bg-[#15bd6b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#1ce783] transition-colors"
                >
                    Proceed to Checkout
                </button>
              ) : (
                <div className="space-y-3">
                    <button
                        type="submit"
                        form="checkout-form"
                        disabled={isLoading}
                        className="w-full bg-[#1ce783] border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-bold text-black hover:bg-[#15bd6b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#1ce783] disabled:opacity-50 transition-colors flex justify-center items-center"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                Processing...
                            </>
                        ) : (
                            `Pay $${total.toFixed(2)}`
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsCheckingOut(false)}
                        disabled={isLoading}
                        className="w-full bg-transparent border border-gray-600 rounded-md py-3 px-4 text-base font-medium text-white hover:bg-gray-800 transition-colors"
                    >
                        Back to Cart
                    </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};