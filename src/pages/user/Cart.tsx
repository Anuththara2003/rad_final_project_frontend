import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../../services/order';
import { useAuth } from '../../context/authContex'; 

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [giftWrap, setGiftWrap] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && user.email) {
      const cartKey = `cart_${user.email}`;
      const items = JSON.parse(localStorage.getItem(cartKey) || '[]');
      setCartItems(items);
    }
  }, [user]); 

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const total = subtotal + (giftWrap ? 5 : 0);

  const removeFromCart = (id: string) => {
    if (!user || !user.email) return;
    
    const cartKey = `cart_${user.email}`;
    const newCart = cartItems.filter(item => item._id !== id);
    setCartItems(newCart);
    localStorage.setItem(cartKey, JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage"));
  };

  const handleCheckout = async () => {
    if (!user || !user.email) return alert("Please login to place an order!");

    const orderData = {
      customerName: user.username,
      userEmail: user.email, 
      items: cartItems.map(item => ({ productName: item.name, quantity: 1, price: item.price })),
      totalAmount: total,
      giftWrap,
      message,
      status: "Pending"
    };

    try {
      const res = await placeOrder(orderData);
      if (res.status === 200 || res.status === 201) {
        alert("Order Placed Successfully! 🎉");
        
      
        localStorage.removeItem(`cart_${user.email}`);
        
        window.dispatchEvent(new Event("storage"));
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-10 font-sans text-white">
      
      {/* --- Back Button Added --- */}
      <button 
        onClick={() => navigate(-1)} 
        className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-8">Shopping Cart 🛍️</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="bg-gray-800 p-4 rounded-xl flex items-center justify-between border border-gray-700 shadow-md">
              <div className="flex items-center gap-4">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-20 h-20 rounded-lg object-cover border border-gray-600" 
                  onError={(e) => {(e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'}}
                />
                <div>
                  <h3 className="font-bold text-lg text-white">{item.name}</h3>
                  <p className="text-green-400 font-bold">${item.price}</p>
                  <p className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded w-fit mt-1">{item.category}</p>
                </div>
              </div>
              <button 
                onClick={() => removeFromCart(item._id)} 
                className="text-red-400 hover:text-red-300 text-sm font-bold border border-red-500/30 px-3 py-1 rounded hover:bg-red-500/10 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Right: Checkout & Gift Options */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-fit shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-white border-b border-gray-700 pb-2">Order Summary</h2>
          
          <div className="mb-6 space-y-4">
            <label className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition border border-gray-600">
              <input 
                type="checkbox" 
                checked={giftWrap} 
                onChange={(e) => setGiftWrap(e.target.checked)}
                className="w-5 h-5 accent-red-500 rounded"
              />
              <div>
                <span className="font-bold text-white">Add Gift Wrap 🎁</span>
                <span className="block text-xs text-gray-400">+$5.00 extra charge</span>
              </div>
            </label>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Custom Message (Optional)</label>
              <textarea 
                rows={3}
                placeholder="Ex: Happy Birthday! Love from..."
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-red-500 outline-none transition"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4 mb-6">
            <div className="flex justify-between mb-2 text-gray-300">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            {giftWrap && (
              <div className="flex justify-between mb-2 text-pink-400 font-medium">
                <span>Gift Wrap</span>
                <span>+$5</span>
              </div>
            )}
            <div className="flex justify-between text-2xl font-extrabold mt-4 text-white">
              <span>Total</span>
              <span className="text-green-400">${total}</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-500/30 transition transform hover:-translate-y-1 active:scale-95"
          >
            Confirm Order ✅
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;