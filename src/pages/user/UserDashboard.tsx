import React from 'react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  // Mock Data (පස්සේ Backend එකෙන් ගන්න)
  const recentOrders = [
    { id: '#ORD001', item: 'Gaming Headset', status: 'Shipped', giftWrap: true, message: 'Happy B day!' },
    { id: '#ORD002', item: 'Spa Kit', status: 'Delivered', giftWrap: false, message: '' },
  ];

  const wishlist = [
    { id: 1, name: 'Smart Watch', price: '$150', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=100' },
    { id: 2, name: 'Leather Wallet', price: '$45', image: 'https://images.unsplash.com/photo-1627123424574-181ce5171c98?auto=format&fit=crop&q=80&w=100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans text-gray-800">
      
      {/* 1. Welcome Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hello, Kasun! 👋</h1>
          <p className="text-gray-500">Ready to find the perfect gift today?</p>
        </div>
        <Link to="/quiz" className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transform transition hover:-translate-y-1 flex items-center gap-2">
          <span>🎁</span> Start Gift Quiz
        </Link>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-pink-100 text-pink-500 rounded-full text-2xl">❤️</div>
          <div>
            <p className="text-sm text-gray-500">My Wishlist</p>
            <h3 className="text-2xl font-bold">12 Items</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-500 rounded-full text-2xl">📦</div>
          <div>
            <p className="text-sm text-gray-500">Total Orders</p>
            <h3 className="text-2xl font-bold">5 Orders</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-purple-100 text-purple-500 rounded-full text-2xl">🛒</div>
          <div>
            <p className="text-sm text-gray-500">In Cart</p>
            <h3 className="text-2xl font-bold">2 Items</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. Recent Orders (With Gift Wrap Details) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-400 text-sm">
                  <th className="py-2">Order ID</th>
                  <th className="py-2">Item</th>
                  <th className="py-2">Gift Wrap?</th>
                  <th className="py-2">Message</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                    <td className="py-3 font-medium">{order.id}</td>
                    <td className="py-3">{order.item}</td>
                    <td className="py-3">
                      {order.giftWrap ? <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-bold">Yes 🎀</span> : <span className="text-gray-400 text-xs">No</span>}
                    </td>
                    <td className="py-3 text-sm text-gray-500 italic">"{order.message || 'None'}"</td>
                    <td className="py-3">
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Quick Wishlist Preview */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Wishlist Favorites</h2>
            <Link to="/wishlist" className="text-red-500 text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {wishlist.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <h4 className="font-semibold text-sm">{item.name}</h4>
                  <p className="text-red-500 text-xs font-bold">{item.price}</p>
                </div>
                <button className="ml-auto bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-red-500 hover:text-white transition">
                  🛒
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