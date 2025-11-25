import React from 'react';

const AdminDashboard = () => {
  // Mock Data for Products (JSON Catalog Representation)
  const products = [
    { id: 1, name: 'Gaming Mouse', category: 'Electronics', tags: ['Teen', 'Birthday'], price: '$40', stock: 12 },
    { id: 2, name: 'Teddy Bear', category: 'Toys', tags: ['Kids', 'Valentine'], price: '$25', stock: 5 },
    { id: 3, name: 'Gold Necklace', category: 'Jewelry', tags: ['Adult', 'Anniversary'], price: '$120', stock: 2 },
  ];

  return (
    <div className="min-h-screen flex bg-gray-900 text-white font-sans">
      
      {/* 1. Sidebar (Navigation) */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col hidden md:flex border-r border-gray-700">
        <h2 className="text-2xl font-extrabold mb-10 tracking-wide">Giftify <span className="text-red-500">Admin</span></h2>
        <nav className="flex-1 space-y-2">
          <a href="#" className="block py-3 px-4 bg-red-600 rounded-lg font-bold">Dashboard</a>
          <a href="#" className="block py-3 px-4 hover:bg-gray-700 rounded-lg transition text-gray-300">Manage Products</a>
          <a href="#" className="block py-3 px-4 hover:bg-gray-700 rounded-lg transition text-gray-300">Customer Orders</a>
          <a href="#" className="block py-3 px-4 hover:bg-gray-700 rounded-lg transition text-gray-300">Users</a>
        </nav>
        <button className="text-left py-2 px-4 text-red-400 hover:text-red-300">Logout</button>
      </aside>

      {/* 2. Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <button className="bg-red-500 px-5 py-2 rounded-lg font-bold hover:bg-red-600 transition">+ Add New Product</button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-gray-400 text-sm">Total Revenue</h3>
            <p className="text-2xl font-bold text-white">$4,250</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-gray-400 text-sm">Active Users</h3>
            <p className="text-2xl font-bold text-white">1,240</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-gray-400 text-sm">Total Products</h3>
            <p className="text-2xl font-bold text-white">56 Items</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-gray-400 text-sm">Pending Orders</h3>
            <p className="text-2xl font-bold text-yellow-400">12</p>
          </div>
        </div>

        {/* 3. Product Management Table (PDF Requirement: Product Catalog) */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold">Product Catalog & Tags</h2>
            <p className="text-sm text-gray-400">Manage gifts and their recommendation tags.</p>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-900 text-gray-400 text-sm uppercase">
              <tr>
                <th className="py-4 px-6">Product Name</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Tags (For Logic)</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Stock</th>
                <th className="py-4 px-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 text-gray-300">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-700/50 transition">
                  <td className="py-4 px-6 font-medium text-white">{product.name}</td>
                  <td className="py-4 px-6">{product.category}</td>
                  <td className="py-4 px-6">
                    {product.tags.map(tag => (
                      <span key={tag} className="bg-gray-700 text-xs px-2 py-1 rounded mr-1 border border-gray-600">{tag}</span>
                    ))}
                  </td>
                  <td className="py-4 px-6 text-green-400">{product.price}</td>
                  <td className="py-4 px-6">{product.stock}</td>
                  <td className="py-4 px-6 flex gap-2">
                    <button className="text-blue-400 hover:text-blue-300">Edit</button>
                    <button className="text-red-400 hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;