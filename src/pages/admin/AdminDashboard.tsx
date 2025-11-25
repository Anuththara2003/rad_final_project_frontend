import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Types
interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  tags: string[];
  stock: number;
  image: string;
}

interface Order {
  _id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  giftWrap: boolean;
  message: string;
  createdAt: string;
  items: { productName: string }[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // ================= STATE MANAGEMENT =================
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'users'>('products');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Order View Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [formData, setFormData] = useState({
    name: '', category: '', price: '', tags: '', stock: '', image: ''
  });

  // ================= API CALLS =================
  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) { console.error("Error products:", error); }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) { console.error("Error orders:", error); }
  };

  useEffect(() => {
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  // ================= HANDLERS (PRODUCTS) =================
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedTags = typeof formData.tags === 'string' ? formData.tags.split(',').map((tag: string) => tag.trim()) : formData.tags;
    const payload = { ...formData, price: Number(formData.price), stock: Number(formData.stock), tags: formattedTags };

    try {
      let url = 'http://localhost:5000/api/products';
      let method = 'POST';
      if (editingId) { url = `http://localhost:5000/api/products/${editingId}`; method = 'PUT'; }

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { alert(editingId ? "Updated!" : "Added!"); closeModal(); fetchProducts(); }
    } catch (error) { console.error(error); }
  };

  const handleDeleteProduct = async (id: string) => {
    if(!confirm("Are you sure?")) return;
    await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product._id);
    setFormData({ name: product.name, category: product.category, price: product.price.toString(), tags: product.tags.join(', '), stock: product.stock.toString(), image: product.image });
    setShowModal(true);
  };

  // ================= HANDLERS (ORDERS) =================
  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        alert("Order Status Updated!");
        fetchOrders();
        setSelectedOrder(null); // Close modal if open
      }
    } catch (error) { console.error(error); }
  };

  const closeModal = () => { setShowModal(false); setEditingId(null); setFormData({ name: '', category: '', price: '', tags: '', stock: '', image: '' }); };
  const handleLogout = () => { localStorage.removeItem('user'); navigate('/login'); };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col border-r border-gray-700 fixed h-full">
        <h2 className="text-2xl font-extrabold mb-10 tracking-wide">Giftify <span className="text-red-500">Admin</span></h2>
        
        <nav className="flex-1 space-y-2">
          {/* Products Tab */}
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full text-left py-3 px-4 rounded-lg font-bold flex items-center gap-3 transition ${activeTab === 'products' ? 'bg-red-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-300'}`}
          >
            <span>🎁</span> Manage Products
          </button>

          {/* Orders Tab */}
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left py-3 px-4 rounded-lg font-bold flex items-center gap-3 transition ${activeTab === 'orders' ? 'bg-red-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-300'}`}
          >
            <span>📦</span> Customer Orders
          </button>

          {/* Users Tab */}
          <button 
             onClick={() => setActiveTab('users')}
             className={`w-full text-left py-3 px-4 rounded-lg font-bold flex items-center gap-3 transition ${activeTab === 'users' ? 'bg-red-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-300'}`}
          >
            <span>👥</span> Users
          </button>
        </nav>

        <button onClick={handleLogout} className="text-left py-2 px-4 text-red-400 hover:text-red-300 mt-auto flex items-center gap-2">🚪 Logout</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 ml-64 overflow-y-auto">
        
        {/* ================= PRODUCTS VIEW ================= */}
        {activeTab === 'products' && (
          <>
            <div className="flex justify-between items-center mb-8">
              <div><h1 className="text-3xl font-bold">Product Management</h1><p className="text-gray-400 text-sm mt-1">Add, Edit or Remove gift items.</p></div>
              <button onClick={() => setShowModal(true)} className="bg-red-500 px-5 py-2 rounded-lg font-bold hover:bg-red-600 transition shadow-lg shadow-red-500/30">+ Add New Product</button>
            </div>
            
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
              <table className="w-full text-left">
                <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase border-b border-gray-700">
                  <tr><th className="py-4 px-6">Product</th><th className="py-4 px-6">Category</th><th className="py-4 px-6">Price</th><th className="py-4 px-6">Stock</th><th className="py-4 px-6 text-center">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-700 text-gray-300">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-700/50 transition">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-gray-600 bg-gray-700" onError={(e) => {(e.target as HTMLImageElement).src = 'https://via.placeholder.com/50'}} />
                        <div><span className="font-bold text-white block">{product.name}</span></div>
                      </td>
                      <td className="py-4 px-6">{product.category}</td>
                      <td className="py-4 px-6 text-green-400 font-bold">${product.price}</td>
                      <td className="py-4 px-6"><span className={`px-2 py-1 rounded text-xs ${product.stock < 5 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>{product.stock} Left</span></td>
                      <td className="py-4 px-6 flex justify-center gap-3">
                        <button onClick={() => handleEditClick(product)} className="text-blue-400 text-xs font-bold hover:underline">Edit</button>
                        <button onClick={() => handleDeleteProduct(product._id)} className="text-red-400 text-xs font-bold hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ================= ORDERS VIEW ================= */}
        {activeTab === 'orders' && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Customer Orders</h1>
              <p className="text-gray-400 text-sm mt-1">Track and update order status.</p>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
              <table className="w-full text-left">
                <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase border-b border-gray-700">
                  <tr>
                    <th className="py-4 px-6">Order ID</th>
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Total</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Gift Wrap</th>
                    <th className="py-4 px-6 text-center">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 text-gray-300">
                  {orders.length === 0 ? <tr><td colSpan={6} className="text-center py-8">No orders yet.</td></tr> : 
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-700/50 transition">
                      <td className="py-4 px-6 font-mono text-sm text-gray-400">#{order._id.slice(-6)}</td>
                      <td className="py-4 px-6 font-bold text-white">{order.customerName}</td>
                      <td className="py-4 px-6 text-green-400 font-bold">${order.totalAmount}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {order.giftWrap ? <span className="text-pink-400 text-xs font-bold border border-pink-500/30 px-2 py-1 rounded">Yes 🎀</span> : <span className="text-gray-500 text-xs">No</span>}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button onClick={() => setSelectedOrder(order)} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-bold transition">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {/* ================= MODALS ================= */}
      
      {/* Product Modal (Add/Edit) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm p-4">
          <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-lg border border-gray-700 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
            <h2 className="text-2xl font-bold mb-6 text-white">{editingId ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleProductSubmit} className="space-y-4">
               {/* Form Inputs (Same as before) */}
               <div><label className="text-sm text-gray-400">Name</label><input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} required /></div>
               <div><label className="text-sm text-gray-400">Category</label><select className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} required><option value="">Select...</option><option value="Electronics">Electronics</option><option value="Fashion">Fashion</option><option value="Toys">Toys</option></select></div>
               <div className="grid grid-cols-2 gap-4">
                 <div><label className="text-sm text-gray-400">Price</label><input type="number" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} required /></div>
                 <div><label className="text-sm text-gray-400">Stock</label><input type="number" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" value={formData.stock} onChange={e=>setFormData({...formData, stock: e.target.value})} required /></div>
               </div>
               <div><label className="text-sm text-gray-400">Tags</label><input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" value={formData.tags} onChange={e=>setFormData({...formData, tags: e.target.value})} required /></div>
               <div><label className="text-sm text-gray-400">Image</label><input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" value={formData.image} onChange={e=>setFormData({...formData, image: e.target.value})} required /></div>
               <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg mt-4">{editingId ? "Update" : "Add"}</button>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm p-4">
          <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl relative">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
            
            <h2 className="text-xl font-bold mb-1 text-white">Order Details</h2>
            <p className="text-sm text-gray-500 mb-6">ID: #{selectedOrder._id}</p>

            <div className="space-y-4">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-xs uppercase">Customer Message</p>
                <p className="text-white italic mt-1">"{selectedOrder.message || 'No message'}"</p>
              </div>

              <div className="flex justify-between items-center bg-gray-900 p-4 rounded-lg border border-gray-700">
                <span className="text-gray-400">Gift Wrap</span>
                {selectedOrder.giftWrap ? <span className="text-pink-400 font-bold">Yes, Please! 🎀</span> : <span className="text-gray-500">No</span>}
              </div>

              <div className="pt-4 border-t border-gray-700">
                <label className="text-sm text-gray-400 block mb-2">Update Status</label>
                <div className="flex gap-2">
                  <button onClick={() => updateOrderStatus(selectedOrder._id, 'Pending')} className={`flex-1 py-2 rounded text-xs font-bold border ${selectedOrder.status === 'Pending' ? 'bg-yellow-500 text-black' : 'border-gray-600 text-gray-400 hover:bg-gray-700'}`}>Pending</button>
                  <button onClick={() => updateOrderStatus(selectedOrder._id, 'Shipped')} className={`flex-1 py-2 rounded text-xs font-bold border ${selectedOrder.status === 'Shipped' ? 'bg-blue-500 text-white' : 'border-gray-600 text-gray-400 hover:bg-gray-700'}`}>Shipped</button>
                  <button onClick={() => updateOrderStatus(selectedOrder._id, 'Delivered')} className={`flex-1 py-2 rounded text-xs font-bold border ${selectedOrder.status === 'Delivered' ? 'bg-green-500 text-white' : 'border-gray-600 text-gray-400 hover:bg-gray-700'}`}>Delivered</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;