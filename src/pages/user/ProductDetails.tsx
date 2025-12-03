import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllProducts } from '../../services/productService';
import { toggleWishListItem } from '../../services/user';
import { useAuth } from '../../context/authContex'; 

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth(); 
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getAllProducts();
        
     
        const allProducts = Array.isArray(res.data) ? res.data : [];
        const foundProduct = allProducts.find((p: any) => p._id === id);
        setProduct(foundProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

 

  const addToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = existingCart.find((item: any) => item._id === product._id);

    if (existingItem) {
      alert("Item already in Cart! 🛒");
    } else {
      existingCart.push({ ...product, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(existingCart));
      window.dispatchEvent(new Event("storage")); 
      
      if(confirm("Item added to Cart! Go to Cart now?")) {
        navigate('/cart');
      }
    }
  };

  const addToWishlist = async () => {
   
    console.log("Current User:", user);

    if (!user || !user.email) {
        return alert("Please login first!");
    }

    try {
      await toggleWishListItem(user.email, product._id);
      alert("Wishlist Updated! ❤️");
    } catch (error) {
      console.error("Wishlist Error:", error);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Product not found.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
      <div className="max-w-5xl w-full bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-700">
        
        {/* Left Side: Image */}
        <div className="md:w-1/2 h-96 md:h-auto relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            onError={(e) => {(e.target as HTMLImageElement).src = 'https://placehold.co/400?text=Product+Image'}} 
          />
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-md transition"
          >
            ← Back
          </button>
        </div>

        {/* Right Side: Details */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <span className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-2">
            {product.category}
          </span>
          
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            {product.name}
          </h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags.map((tag: string, index: number) => (
              <span key={index} className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full border border-gray-600">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-end gap-4 mb-8">
            <p className="text-4xl text-green-400 font-bold">${product.price}</p>
            <p className="text-gray-400 text-sm mb-2">
              {product.stock > 0 ? `${product.stock} items left` : 'Out of Stock'}
            </p>
          </div>

          <p className="text-gray-400 mb-8 leading-relaxed">
            This represents the best choice for your selected preferences. 
            Perfect for <b>{product.tags.join(', ')}</b>.
          </p>

          <div className="flex gap-4">
            <button 
              onClick={addToCart}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-500/30 transition transform hover:-translate-y-1"
            >
              Add to Cart 🛒
            </button>
            
            <button 
              onClick={addToWishlist}
              className="bg-gray-700 hover:bg-pink-500 hover:text-white text-gray-300 p-4 rounded-xl transition shadow-lg border border-gray-600"
              title="Add to Wishlist"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;