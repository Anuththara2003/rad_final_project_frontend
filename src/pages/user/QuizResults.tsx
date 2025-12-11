import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { getRecommendations } from '../../services/productService'; 
import { toggleWishListItem } from '../../services/user'; 
import { useSnackbar } from 'notistack'

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

 
  const answers = location.state; 
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    
    const loadRecommendations = async () => {
      try {
        const res = await getRecommendations(answers);
        
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (answers) {
      loadRecommendations();
    } else {
      setLoading(false);
    }
  }, [answers]);

 
  const handleAddToWishlist = async (productId: string) => {
    if(!user.email) return alert("Please login first!");
    
    try {
      await toggleWishListItem(user.email, productId);
      enqueueSnackbar("Wishlist updated!❤️", { variant: 'success' });
    } catch (error) {
      console.error("Wishlist Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-10 font-sans text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Recommended for You 🎁</h1>
          <p className="text-gray-400 mt-1">Based on your preferences.</p>
        </div>
        <Link to="/dashboard" className="text-gray-400 hover:text-white underline">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
          <p className="text-xl text-gray-300">Finding the perfect gifts... 🤖</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center bg-gray-800 p-10 rounded-2xl border border-gray-700 max-w-2xl mx-auto">
          <p className="text-4xl mb-4">🤷‍♂️</p>
          <h2 className="text-2xl font-bold text-white mb-2">No perfect matches found.</h2>
          <p className="text-gray-400 mb-6">We couldn't find gifts matching that exact criteria.</p>
          <Link to="/quiz" className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-bold transition inline-block">
            Try Quiz Again
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
          {products.map((product) => (
            <div key={product._id} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden hover:scale-105 transition duration-300 shadow-xl group">
              
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:opacity-90 transition"
                  onError={(e) => {(e.target as HTMLImageElement).src = 'https://placehold.co/150?text=Gift'}} 
                />
                <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-md border border-white/10">
                  {product.category}
                </span>
              </div>

              {/* Details */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-1 truncate">{product.name}</h3>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-green-400 font-extrabold text-lg">${product.price}</p>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAddToWishlist(product._id)}
                      className="bg-gray-700 p-2 rounded-lg text-gray-300 hover:bg-pink-500 hover:text-white transition" 
                      title="Add to Wishlist"
                    >
                      ❤️
                    </button>
                    <button 
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="bg-red-600 p-2 rounded-lg text-white hover:bg-red-500 transition text-sm font-bold px-3"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizResults;