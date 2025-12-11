import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getWishList } from '../../services/user';
import { useAuth } from '../../context/authContex';
import { getUserOrdersByEmail } from '../../services/adminService';


// Types
interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  giftWrap: boolean;
  message: string;
  items: { productName: string }[];
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  

  // --- NEW: Tab State ---
  const [orderTab, setOrderTab] = useState<'active' | 'history'>('active');

  useEffect(() => {
    if (!user) {
      return;
    }

    fetchOrders(user.email);
    fetchWishlist(user.email); 

    const updateCartCount = () => {
        const cartKey = `cart_${user.email}`;
        const cartItems = JSON.parse(localStorage.getItem(cartKey) || '[]');
        setCartCount(cartItems.length);
    };

    updateCartCount(); 

    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
    };

  }, [user]);

  
  const fetchOrders = async (email: string) => {
    try {
        const res = await getUserOrdersByEmail(email);
        setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
    }
  };


  const fetchWishlist = async (email: string) => {
    try {
      console.log("Fetching Wishlist for:", email); 

      const res = await getWishList(email);
      
      console.log("Wishlist Response from Backend:", res); 

      if (res.data && Array.isArray(res.data)) {
        console.log("Setting Wishlist State:", res.data); 
        setWishlist(res.data);
      } else if (Array.isArray(res)) {
        console.log("Setting Wishlist State (Direct):", res);
        setWishlist(res);
      } else {
        console.error("Unknown Data Format:", res); 
        setWishlist([]);
      }

    } catch (error) {
      console.error("Error loading wishlist:", error);
      setWishlist([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  // --- NEW: Filter Logic for Tabs ---
  const displayedOrders = orders.filter(order => {
    if (orderTab === 'active') {
        return order.status !== 'Delivered'; 
    } else {
        return order.status === 'Delivered'; 
    }
  });

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-10 font-sans text-gray-100">
      
      {/* 1. Navbar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Hello, {user?.username || 'User'}! <span className="animate-pulse">👋</span>
          </h1>
          <p className="text-gray-400 mt-1">Ready to find the perfect gift today?</p>
        </div>
        
        <div className="flex gap-4">
            <Link 
            to="/quiz" 
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-500/30 transform transition hover:-translate-y-1 active:scale-95 flex items-center gap-2"
            >
            <span className="text-xl">🎁</span> Start Gift Quiz
            </Link>
            
            <button onClick={handleLogout} className="bg-gray-800 border border-gray-600 text-gray-300 px-4 py-3 rounded-xl font-bold hover:bg-gray-700 transition">
                Logout
            </button>
        </div>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Wishlist Count */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl hover:border-gray-600 transition duration-300 group">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-pink-500/10 text-pink-500 rounded-xl border border-pink-500/20 group-hover:bg-pink-500 group-hover:text-white transition duration-300">
              ❤️
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">My Wishlist</p>
              <h3 className="text-3xl font-bold text-white">{wishlist.length} Items</h3>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl hover:border-gray-600 transition duration-300 group">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-500/10 text-blue-500 rounded-xl border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition duration-300">
              📦
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">My Orders</p>
              <h3 className="text-3xl font-bold text-white">{orders.length} Orders</h3>
            </div>
          </div>
        </div>

        {/* Cart Count */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl hover:border-gray-600 transition duration-300 group">
          <div className="flex items-center gap-5">
            <Link to="/cart" className="p-4 bg-purple-500/10 text-purple-500 rounded-xl border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition duration-300 block">
              🛒
            </Link>
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">In Cart</p>
              <h3 className="text-3xl font-bold text-white">{cartCount} Items</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. Recent Orders Table (UPDATED WITH TABS) */}
        <div className="lg:col-span-2 bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
          
          <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
            <h2 className="text-2xl font-bold text-white">My Orders</h2>
            
            {/* Tabs UI Added Here */}
            <div className="flex gap-2">
                <button 
                    onClick={() => setOrderTab('active')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${orderTab === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'}`}
                >
                    Active
                </button>
                <button 
                    onClick={() => setOrderTab('history')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${orderTab === 'history' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'}`}
                >
                    History
                </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="py-4 font-semibold">Order ID</th>
                  <th className="py-4 font-semibold">Items</th>
                  <th className="py-4 font-semibold">Total</th>
                  <th className="py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {displayedOrders.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-6 text-gray-500">No {orderTab} orders found.</td></tr>
                ) : (
                    displayedOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-700/50 transition duration-200">
                        <td className="py-4 font-mono text-red-400 text-sm">#{order._id.slice(-6)}</td>
                        <td className="py-4 text-gray-200">{order.items.length} Items</td>
                        <td className="py-4 text-green-400 font-bold">${order.totalAmount}</td>
                        <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            order.status === 'Shipped' 
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                            : order.status === 'Delivered' 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                            {order.status}
                        </span>
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Wishlist Preview */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
            <h2 className="text-2xl font-bold text-white">Wishlist</h2>
            <Link to="/wishlist" className="text-red-400 text-sm font-bold hover:text-red-300 transition">View All →</Link>
          </div>
          <div className="space-y-4">
            {wishlist.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Your wishlist is empty.</p>
            ) : (
                wishlist.slice(0, 3).map((item) => (
                <div key={item._id} className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-xl hover:bg-gray-700 border border-gray-700 transition duration-200 group">
                    <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-14 h-14 rounded-lg object-cover border border-gray-600"
                        onError={(e) => {(e.target as HTMLImageElement).src = 'https://placehold.co/150'}} 
                    />
                    <div>
                    <h4 className="font-bold text-gray-200 group-hover:text-white truncate w-32">{item.name}</h4>
                    <p className="text-red-400 text-sm font-bold">${item.price}</p>
                    </div>
                    {/* View Button Link */}
                    <Link to={`/product/${item._id}`} className="ml-auto bg-gray-700 p-2.5 rounded-full text-gray-400 hover:bg-red-500 hover:text-white transition shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </Link>
                </div>
                ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;