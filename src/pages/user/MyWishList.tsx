import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // User විස්තර ගන්න
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!user.email) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, []);

  // 1. Wishlist Items Backend එකෙන් ගෙන්වා ගැනීම
  const fetchWishlist = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/wishlist/${user.email}`);
      const data = await res.json();
      
      // ආරක්ෂිතව Array එකක්ද කියලා බලලා set කරනවා
      if (Array.isArray(data)) {
        setWishlist(data);
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Wishlist එකෙන් අයින් කරන Function එක
  const removeFromWishlist = async (productId: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/users/wishlist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, productId })
      });

      if (res.ok) {
        // අයින් කළාට පස්සේ UI එකෙන් ඒක අයින් කරනවා (Refresh නොවී)
        setWishlist(wishlist.filter(item => item._id !== productId));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // 3. Cart එකට දාන Function එක
  const addToCart = (product: Product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = existingCart.find((item: any) => item._id === product._id);

    if (existingItem) {
      alert("Item already in Cart! 🛒");
    } else {
      existingCart.push({ ...product, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(existingCart));
      
      if(confirm("Added to Cart! Go to Cart?")) {
        navigate('/cart');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-10 font-sans text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">My Wishlist ❤️</h1>
          <p className="text-gray-400 mt-1">Saved items you want to buy later.</p>
        </div>
        <Link to="/dashboard" className="text-gray-400 hover:text-white underline">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center text-xl text-gray-500">Loading your favorites...</p>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-20 bg-gray-800 rounded-2xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-2">Your wishlist is empty 💔</h2>
          <p className="text-gray-400 mb-6">Go find some amazing gifts!</p>
          <Link to="/quiz" className="bg-red-600 px-6 py-2 rounded-lg font-bold hover:bg-red-500 text-white">
            Find Gifts
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-lg group hover:border-gray-600 transition">
              
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {(e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'}}
                />
                <button 
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition"
                  title="Remove"
                >
                  ✕
                </button>
              </div>

              {/* Details */}
              <div className="p-5">
                <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded uppercase font-bold">
                  {product.category}
                </span>
                <h3 className="text-lg font-bold mt-2 truncate">{product.name}</h3>
                <p className="text-green-400 font-bold text-xl mt-1">${product.price}</p>
                
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-bold text-sm transition"
                  >
                    Add to Cart 🛒
                  </button>
                  <button 
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg font-bold text-sm transition"
                  >
                    View
                  </button>
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