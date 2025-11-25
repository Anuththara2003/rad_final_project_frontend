import React from 'react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  // Mock Data
  const recentOrders = [
    { id: '#ORD001', item: 'Gaming Headset', status: 'Shipped', giftWrap: true, message: 'Happy B day!' },
    { id: '#ORD002', item: 'Spa Kit', status: 'Delivered', giftWrap: false, message: '' },
  ];

  const wishlist = [
    { id: 1, name: 'Smart Watch', price: '$150', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=100' },
    { id: 2, name: 'Leather Wallet', price: '$45', image: 'https://images.unsplash.com/photo-1627123424574-181ce5171c98?auto=format&fit=crop&q=80&w=100' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-10 font-sans text-gray-100">
      
      {/* 1. Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Hello, Dilsha! <span className="animate-pulse">👋</span>
          </h1>
          <p className="text-gray-400 mt-1">Ready to find the perfect gift today?</p>
        </div>
        <Link 
          to="/quiz" 
          className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-500/30 transform transition hover:-translate-y-1 active:scale-95 flex items-center gap-2"
        >
          <span className="text-xl">🎁</span> Start Gift Quiz
        </Link>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Card 1 */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl hover:border-gray-600 transition duration-300 group">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-pink-500/10 text-pink-500 rounded-xl border border-pink-500/20 group-hover:bg-pink-500 group-hover:text-white transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">My Wishlist</p>
              <h3 className="text-3xl font-bold text-white">12 Items</h3>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl hover:border-gray-600 transition duration-300 group">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-500/10 text-blue-500 rounded-xl border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Total Orders</p>
              <h3 className="text-3xl font-bold text-white">5 Orders</h3>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl hover:border-gray-600 transition duration-300 group">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-purple-500/10 text-purple-500 rounded-xl border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">In Cart</p>
              <h3 className="text-3xl font-bold text-white">2 Items</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. Recent Orders Table */}
        <div className="lg:col-span-2 bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="py-4 font-semibold">Order ID</th>
                  <th className="py-4 font-semibold">Item</th>
                  <th className="py-4 font-semibold">Gift Wrap?</th>
                  <th className="py-4 font-semibold">Message</th>
                  <th className="py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-700/50 transition duration-200">
                    <td className="py-4 font-medium text-red-400">{order.id}</td>
                    <td className="py-4 text-gray-200">{order.item}</td>
                    <td className="py-4">
                      {order.giftWrap ? (
                        <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                          Yes 🎀
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs">No</span>
                      )}
                    </td>
                    <td className="py-4 text-sm text-gray-400 italic">"{order.message || 'None'}"</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        order.status === 'Shipped' 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Quick Wishlist Preview */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
            <h2 className="text-2xl font-bold text-white">Wishlist</h2>
            <Link to="/wishlist" className="text-red-400 text-sm font-bold hover:text-red-300 transition">View All →</Link>
          </div>
          <div className="space-y-4">
            {wishlist.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-xl hover:bg-gray-700 border border-gray-700 transition duration-200 group">
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover border border-gray-600" />
                <div>
                  <h4 className="font-bold text-gray-200 group-hover:text-white">{item.name}</h4>
                  <p className="text-red-400 text-sm font-bold">{item.price}</p>
                </div>
                <button className="ml-auto bg-gray-700 p-2.5 rounded-full text-gray-400 hover:bg-red-500 hover:text-white transition shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;