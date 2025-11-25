import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  tags: string[];
  stock: number;
  image: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  
  // Edit කරන Product එකේ ID එක (null නම් Add Mode)
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    tags: '',
    stock: '',
    image: ''
  });

  // Data ගෙන්වා ගැනීම
  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Form Submit (Add හෝ Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedTags = typeof formData.tags === 'string' 
      ? formData.tags.split(',').map((tag: string) => tag.trim()) 
      : formData.tags;

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      tags: formattedTags
    };

    try {
      let url = 'http://localhost:5000/api/products';
      let method = 'POST';

      if (editingId) {
        url = `http://localhost:5000/api/products/${editingId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(editingId ? "Product Updated! 🔄" : "Product Added! 🎉");
        closeModal();
        fetchProducts();
      } else {
        alert("Operation Failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Edit Click
  const handleEditClick = (product: Product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      tags: product.tags.join(', '),
      stock: product.stock.toString(),
      image: product.image
    });
    setShowModal(true);
  };

  // Delete Click
  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: '', category: '', price: '', tags: '', stock: '', image: '' });
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col border-r border-gray-700 fixed h-full">
        <h2 className="text-2xl font-extrabold mb-10 tracking-wide">Giftify🎁 <span className="text-red-500">Admin</span></h2>
        
        <nav className="flex-1 space-y-2">
          <button className="w-full text-left py-3 px-4 hover:bg-gray-700 rounded-lg transition text-gray-300 flex items-center gap-3">
            <span>📊</span> Dashboard
          </button>
          <button className="w-full text-left py-3 px-4 bg-red-600 rounded-lg font-bold text-white flex items-center gap-3 shadow-lg shadow-red-900/50">
            <span>🎁</span> Manage Products
          </button>
          <button className="w-full text-left py-3 px-4 hover:bg-gray-700 rounded-lg transition text-gray-300 flex items-center gap-3">
            <span>📦</span> Customer Orders
          </button>
          <button className="w-full text-left py-3 px-4 hover:bg-gray-700 rounded-lg transition text-gray-300 flex items-center gap-3">
            <span>👥</span> Users
          </button>
        </nav>

        <button onClick={handleLogout} className="text-left py-2 px-4 text-red-400 hover:text-red-300 mt-auto flex items-center gap-2">
           🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 ml-64 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Product Management</h1>
            <p className="text-gray-400 text-sm mt-1">Add, Edit or Remove gift items.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="bg-red-500 px-5 py-2 rounded-lg font-bold hover:bg-red-600 transition shadow-lg shadow-red-500/30 flex items-center gap-2"
          >
            <span>+</span> Add New Product
          </button>
        </div>

        {/* Product Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
          <table className="w-full text-left">
            <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase border-b border-gray-700">
              <tr>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Stock</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 text-gray-300">
              {products.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">No products found.</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-700/50 transition">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-12 h-12 rounded-lg object-cover border border-gray-600 bg-gray-700"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50?text=No+Img'; }}
                      />
                      <div>
                        <span className="font-bold text-white block">{product.name}</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {product.tags.map((tag, idx) => (
                                <span key={idx} className="text-[10px] bg-gray-700 px-1 rounded text-gray-300">{tag}</span>
                            ))}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">{product.category}</td>
                    <td className="py-4 px-6 text-green-400 font-bold">${product.price}</td>
                    <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded text-xs ${product.stock < 5 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                            {product.stock} Left
                        </span>
                    </td>
                    <td className="py-4 px-6 flex justify-center gap-3">
                      <button 
                        onClick={() => handleEditClick(product)}
                        className="bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/20 text-xs font-bold hover:bg-blue-500 hover:text-white transition"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg border border-red-500/20 text-xs font-bold hover:bg-red-500 hover:text-white transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal (Add / Edit) with Placeholders */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm p-4">
          <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-lg border border-gray-700 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
            
            <h2 className="text-2xl font-bold mb-6 text-white">
              {editingId ? "Edit Product ✏️" : "Add New Product 🎁"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Product Name</label>
                <input 
                    type="text" 
                    placeholder="Ex: Wireless Gaming Headset" // Placeholder 1
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Category</label>
                  <select 
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none"
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})} 
                    required
                  >
                    <option value="">Select Category...</option> {/* Placeholder 2 */}
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Toys">Toys</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Home">Home</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Price ($)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 49.99" // Placeholder 3
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none"
                    value={formData.price} 
                    onChange={(e) => setFormData({...formData, price: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1">Tags (Comma separated)</label>
                <input 
                    type="text" 
                    placeholder="Ex: Teen, Birthday, Gaming, Male" // Placeholder 4
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none"
                    value={formData.tags} 
                    onChange={(e) => setFormData({...formData, tags: e.target.value})} 
                    required 
                />
                <p className="text-xs text-gray-500 mt-1">Used for AI recommendations.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Stock</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 50" // Placeholder 5
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none"
                    value={formData.stock} 
                    onChange={(e) => setFormData({...formData, stock: e.target.value})} 
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Image URL</label>
                  <input 
                    type="text" 
                    placeholder="Ex: https://example.com/image.jpg" // Placeholder 6
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none"
                    value={formData.image} 
                    onChange={(e) => setFormData({...formData, image: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg transition mt-4 shadow-lg shadow-red-500/20">
                {editingId ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;