import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Service Functions Import කරගන්න
import { 
  getAllProducts, createProduct, updateProduct, deleteProduct,
  getAllOrders, 
  getAllUsers, removeUser,
  getDashboardStats, 
  updateOrderStatus
} from '../../services/adminService';

// Types Definitions
interface Product { _id: string; name: string; category: string; price: number; tags: string[]; stock: number; image: string; }
interface Order { _id: string; customerName: string; totalAmount: number; status: string; giftWrap: boolean; message: string; createdAt: string; items: { productName: string }[]; }
interface User { _id: string; username: string; email: string; role: string; }
interface Stats { totalProducts: number; totalUsers: number; pendingOrders: number; totalRevenue: number; }

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // ================= STATE MANAGEMENT =================
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'users'>('dashboard');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({ totalProducts: 0, totalUsers: 0, pendingOrders: 0, totalRevenue: 0 });
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [formData, setFormData] = useState({
    name: '', category: '', price: '', tags: '', stock: '', image: ''
  });

  // ================= DATA FETCHING (USING SERVICES) =================
  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data);
    } catch (e) { console.error("Error fetching products:", e); }
  };

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data);
    } catch (e) { console.error("Error fetching orders:", e); }
  };

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (e) { console.error("Error fetching users:", e); }
  };

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data);
      console.log(res.data);
    } catch (e) { console.error("Error fetching stats:", e); }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') { fetchStats(); fetchOrders(); }
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  // ================= HANDLERS (PRODUCTS) =================
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedTags = typeof formData.tags === 'string' ? formData.tags.split(',').map((tag: string) => tag.trim()) : formData.tags;
    const payload = { ...formData, price: Number(formData.price), stock: Number(formData.stock), tags: formattedTags };

    try {
      if (editingId) {
        // Update Product Service
        await updateProduct(editingId, payload);
        alert("Product Updated! 🔄");
      } else {
        // Add Product Service
        await createProduct(payload);
        alert("Product Added! 🎉");
      }
      closeModal(); 
      fetchProducts();
    } catch (error) { console.error("Product Error:", error); }
  };

  const handleDeleteProduct = async (id: string) => {
    if(!confirm("Are you sure?")) return;
    try {
        await deleteProduct(id);
        fetchProducts();
    } catch (error) { console.error(error); }
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product._id);
    setFormData({ name: product.name, category: product.category, price: product.price.toString(), tags: product.tags.join(', '), stock: product.stock.toString(), image: product.image });
    setShowModal(true);
  };

  // ================= HANDLERS (ORDERS & USERS) =================
  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    try {
      await updateOrderStatus(id, newStatus);
      alert("Order Status Updated!"); 
      fetchOrders(); 
      setSelectedOrder(null);
    } catch (error) { console.error(error); }
  };

  const handleDeleteUser = async (id: string) => {
    if(!confirm("Delete this user?")) return;
    try {
        await removeUser(id);
        fetchUsers();
    } catch (error) { console.error(error); }
  };

  const closeModal = () => { setShowModal(false); setEditingId(null); setFormData({ name: '', category: '', price: '', tags: '', stock: '', image: '' }); };
  const handleLogout = () => { localStorage.removeItem('user'); localStorage.removeItem('accessToken'); navigate('/login'); };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col border-r border-gray-700 fixed h-full">
        <h2 className="text-2xl font-extrabold mb-10 tracking-wide">Giftify <span className="text-red-500">Admin</span></h2>
        
        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left py-3 px-4 rounded-lg font-bold flex items-center gap-3 transition ${activeTab === 'dashboard' ? 'bg-red-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-300'}`}>
            <span>📊</span> Dashboard
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full text-left py-3 px-4 rounded-lg font-bold flex items-center gap-3 transition ${activeTab === 'products' ? 'bg-red-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-300'}`}>
            <span>🎁</span> Manage Products
          </button>
          <button onClick={() => setActiveTab('orders')} className={`w-full text-left py-3 px-4 rounded-lg font-bold flex items-center gap-3 transition ${activeTab === 'orders' ? 'bg-red-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-300'}`}>
            <span>📦</span> Customer Orders
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full text-left py-3 px-4 rounded-lg font-bold flex items-center gap-3 transition ${activeTab === 'users' ? 'bg-red-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-300'}`}>
            <span>👥</span> Users
          </button>
        </nav>

        <button onClick={handleLogout} className="text-left py-2 px-4 text-red-400 hover:text-red-300 mt-auto flex items-center gap-2">🚪 Logout</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 ml-64 overflow-y-auto">
        
        {/* ================= DASHBOARD OVERVIEW ================= */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                <h3 className="text-gray-400 text-xs uppercase font-bold">Total Revenue</h3>
                <p className="text-3xl font-bold text-green-400 mt-2">${stats.totalRevenue}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                <h3 className="text-gray-400 text-xs uppercase font-bold">Active Users</h3>
                <p className="text-3xl font-bold text-blue-400 mt-2">{stats.totalUsers}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                <h3 className="text-gray-400 text-xs uppercase font-bold">Total Products</h3>
                <p className="text-3xl font-bold text-purple-400 mt-2">{stats.totalProducts}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                <h3 className="text-gray-400 text-xs uppercase font-bold">Pending Orders</h3>
                <p className="text-3xl font-bold text-yellow-400 mt-2">{stats.pendingOrders}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-sm text-blue-400 hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-gray-400 text-xs uppercase border-b border-gray-700">
                      <tr><th className="pb-3">Customer</th><th className="pb-3">Total</th><th className="pb-3">Status</th></tr>
                    </thead>
                    <tbody className="text-gray-300 divide-y divide-gray-700">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order._id} className="hover:bg-gray-700/30">
                          <td className="py-3">{order.customerName}</td>
                          <td className="py-3 text-green-400">${order.totalAmount}</td>
                          <td className="py-3">
                            <span className={`text-xs px-2 py-1 rounded border ${order.status === 'Pending' ? 'border-yellow-500 text-yellow-500' : 'border-green-500 text-green-500'}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && <tr><td colSpan={3} className="py-4 text-center text-gray-500">No orders yet.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= USERS VIEW ================= */}
        {activeTab === 'users' && (
          <>
            <h1 className="text-3xl font-bold mb-8">Registered Users</h1>
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
              <table className="w-full text-left">
                <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase border-b border-gray-700">
                  <tr><th className="py-4 px-6">Name</th><th className="py-4 px-6">Email</th><th className="py-4 px-6">Role</th><th className="py-4 px-6 text-center">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-700 text-gray-300">
                  {users.map(user => (
                    <tr key={user._id} className="hover:bg-gray-700/50">
                      <td className="py-4 px-6 font-bold">{user.username}</td>
                      <td className="py-4 px-6">{user.email}</td>
                      <td className="py-4 px-6"><span className={`px-2 py-1 rounded text-xs ${user.role === 'ADMIN' || user.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{user.role}</span></td>
                      <td className="py-4 px-6 text-center">
                        <button onClick={() => handleDeleteUser(user._id)} className="text-red-400 hover:text-white text-xs font-bold border border-red-500/30 px-3 py-1 rounded hover:bg-red-600 transition">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

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
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-gray-600 bg-gray-700" onError={(e) => {(e.target as HTMLImageElement).src = 'https://placehold.co/150'}} />
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
                  <tr><th className="py-4 px-6">Order ID</th><th className="py-4 px-6">Customer</th><th className="py-4 px-6">Total</th><th className="py-4 px-6">Status</th><th className="py-4 px-6">Gift Wrap</th><th className="py-4 px-6 text-center">Details</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-700 text-gray-300">
                  {orders.length === 0 ? <tr><td colSpan={6} className="text-center py-8">No orders yet.</td></tr> : 
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-700/50 transition">
                      <td className="py-4 px-6 font-mono text-sm text-gray-400">#{order._id.slice(-6)}</td>
                      <td className="py-4 px-6 font-bold text-white">{order.customerName}</td>
                      <td className="py-4 px-6 text-green-400 font-bold">${order.totalAmount}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' : order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
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
               <div><label className="text-sm text-gray-400">Name</label><input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} required /></div>
               <div><label className="text-sm text-gray-400">Category</label><select className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} required><option value="">Select...</option><option value="Electronics">Electronics</option><option value="Fashion">Fashion</option><option value="Toys">Toys</option><option value="Beauty">Beauty</option></select></div>
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
                  <button onClick={() => handleUpdateOrderStatus(selectedOrder._id, 'Pending')} className={`flex-1 py-2 rounded text-xs font-bold border ${selectedOrder.status === 'Pending' ? 'bg-yellow-500 text-black' : 'border-gray-600 text-gray-400 hover:bg-gray-700'}`}>Pending</button>
                  <button onClick={() => handleUpdateOrderStatus(selectedOrder._id, 'Shipped')} className={`flex-1 py-2 rounded text-xs font-bold border ${selectedOrder.status === 'Shipped' ? 'bg-blue-500 text-white' : 'border-gray-600 text-gray-400 hover:bg-gray-700'}`}>Shipped</button>
                  <button onClick={() => handleUpdateOrderStatus(selectedOrder._id, 'Delivered')} className={`flex-1 py-2 rounded text-xs font-bold border ${selectedOrder.status === 'Delivered' ? 'bg-green-500 text-white' : 'border-gray-600 text-gray-400 hover:bg-gray-700'}`}>Delivered</button>
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