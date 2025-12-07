import React, { useState } from 'react';
import { useShop } from '../App';
import { generateProductDescription } from '../services/geminiService';
import { Sparkles, Loader2 } from 'lucide-react';
import { Product } from '../types';

export const Admin: React.FC = () => {
  const { products, addProduct } = useShop();
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'Lifestyle',
    image: 'https://picsum.photos/600/600',
    description: '',
    sizes: [7,8,9,10,11],
    colors: ['Black']
  });
  const [loadingAI, setLoadingAI] = useState(false);
  const [features, setFeatures] = useState('');

  const handleGenerateDescription = async () => {
    if (!formData.name) {
        alert("Please enter a product name first.");
        return;
    }
    setLoadingAI(true);
    const desc = await generateProductDescription(formData.name || '', features || 'comfortable, stylish, durable');
    setFormData(prev => ({ ...prev, description: desc || '' }));
    setLoadingAI(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newProduct: Product = {
          id: Date.now().toString(),
          name: formData.name!,
          price: Number(formData.price),
          category: formData.category!,
          sizes: formData.sizes!,
          colors: formData.colors!,
          image: formData.image!,
          description: formData.description!,
          isFeatured: false
      };
      addProduct(newProduct);
      alert("Product Added!");
      setFormData({ name: '', price: 0, category: 'Lifestyle', image: 'https://picsum.photos/600/600', description: '', sizes: [7,8,9], colors: ['Black'] });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[#0b0c0f]">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Add Product Form */}
        <div className="bg-[#15171c] p-6 rounded-lg shadow-sm border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-white">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400">Product Name</label>
                    <input 
                        type="text" 
                        required
                        className="mt-1 block w-full bg-[#0b0c0f] border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#1ce783] focus:border-[#1ce783]"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400">Category</label>
                    <select 
                        className="mt-1 block w-full bg-[#0b0c0f] border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#1ce783] focus:border-[#1ce783]"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                        <option>Running</option>
                        <option>Lifestyle</option>
                        <option>Basketball</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400">Price ($)</label>
                    <input 
                        type="number" 
                        required
                        className="mt-1 block w-full bg-[#0b0c0f] border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#1ce783] focus:border-[#1ce783]"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    />
                </div>
                
                <div className="bg-[#0b0c0f] p-4 rounded-md border border-gray-700">
                    <label className="block text-sm font-medium text-gray-400">AI Description Generator</label>
                    <p className="text-xs text-gray-500 mb-2">Enter features separated by commas (e.g. breathable mesh, carbon plate) and click generate.</p>
                    <div className="flex gap-2 mb-2">
                        <input 
                            type="text" 
                            placeholder="Key features..."
                            className="flex-1 block w-full bg-[#15171c] border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#1ce783]"
                            value={features}
                            onChange={e => setFeatures(e.target.value)}
                        />
                        <button 
                            type="button"
                            onClick={handleGenerateDescription}
                            disabled={loadingAI}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loadingAI ? <Loader2 className="h-4 w-4 animate-spin"/> : <Sparkles className="h-4 w-4 mr-2" />}
                            Generate
                        </button>
                    </div>
                    <textarea 
                        required
                        rows={3}
                        className="block w-full bg-[#15171c] border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#1ce783] focus:border-[#1ce783]"
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Product description..."
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#1ce783] hover:bg-[#15bd6b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1ce783]"
                >
                    Add Product
                </button>
            </form>
        </div>

        {/* Product List */}
        <div className="bg-[#15171c] p-6 rounded-lg shadow-sm border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-white">Existing Inventory</h2>
            <ul className="divide-y divide-gray-700">
                {products.map(p => (
                    <li key={p.id} className="py-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <img className="h-10 w-10 rounded-full object-cover border border-gray-700" src={p.image} alt="" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-white">{p.name}</p>
                                <p className="text-sm text-gray-500">${p.price}</p>
                            </div>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-[#1ce783] border border-green-800">
                            Active
                        </span>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};