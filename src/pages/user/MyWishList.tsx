import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContex';
import { getWishList, toggleWishListItem } from '../../services/user';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  stock: number;
}

const MyWishList = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    console.log("LOG-1: Current User in Wishlist Page:", user);

    if (!authLoading) {
        if (!user) {
            console.log("LOG-2: No User Found, Redirecting...");
            navigate('/login');
        } else {
            console.log("LOG-3: User Found, Fetching Wishlist for:", user.email);
            fetchWishlist(user.email);
        }
    }
  }, [user, authLoading]);

  const fetchWishlist = async (email: string) => {
    try {
      const res = await getWishList(email);
      
      
      console.log("LOG-4: API Response Full:", res); 
      console.log("LOG-5: res.data check:", res.data);

      if (res.data && Array.isArray(res.data)) {
        console.log("LOG-6: Setting Wishlist from res.data");
        setWishlist(res.data);
      } else if (Array.isArray(res)) {
        console.log("LOG-6: Setting Wishlist from res directly");
        setWishlist(res);
      } else {
        console.error("LOG-7: Unknown Data Format:", res);
        setWishlist([]);
      }

    } catch (error) {
      console.error("LOG-8: Error fetching wishlist:", error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    try {
      await toggleWishListItem(user.email, productId);
      setWishlist(wishlist.filter(item => item._id !== productId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const addToCart = (product: Product) => {
    const cartKey = `cart_${user.email}`;
    const existingCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    const existingItem = existingCart.find((item: any) => item._id === product._id);

    if (existingItem) {
      alert("Item already in Cart! 🛒");
    } else {
      existingCart.push({ ...product, quantity: 1 });
      localStorage.setItem(cartKey, JSON.stringify(existingCart));
      window.dispatchEvent(new Event("storage"));
      
      if(confirm("Added to Cart! Go to Cart?")) {
        navigate('/cart');
      }
    }
  };

  if (authLoading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Checking Auth...</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-10 font-sans text-white">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">My Wishlist ❤️</h1>
          <p className="text-gray-400 mt-1">Saved items you want to buy later.</p>
        </div>
        <Link to="/dashboard" className="text-gray-400 hover:text-white underline">← Back to Dashboard</Link>
      </div>

      {loading ? (
        <p className="text-center text-xl text-gray-500">Loading your favorites...</p>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-20 bg-gray-800 rounded-2xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-2">Your wishlist is empty 💔</h2>
          <p className="text-gray-400 mb-6">Go find some amazing gifts!</p>
          <Link to="/quiz" className="bg-red-600 px-6 py-2 rounded-lg font-bold hover:bg-red-500 text-white">Find Gifts</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-lg group hover:border-gray-600 transition">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {(e.target as HTMLImageElement).src = 'https://placehold.co/150'}}
                />
                <button onClick={() => removeFromWishlist(product._id)} className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition" title="Remove">✕</button>
              </div>
              <div className="p-5">
                <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded uppercase font-bold">{product.category}</span>
                <h3 className="text-lg font-bold mt-2 truncate">{product.name}</h3>
                <p className="text-green-400 font-bold text-xl mt-1">${product.price}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => addToCart(product)} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-bold text-sm transition">Add to Cart 🛒</button>
                  <button onClick={() => navigate(`/product/${product._id}`)} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg font-bold text-sm transition">View</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWishList;