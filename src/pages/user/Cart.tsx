import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../../services/order';
import { useAuth } from '../../context/authContex'; 
interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isSelected: boolean;
  giftWrap: boolean;
  message: string;
}

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    if (user && user.email) {
      const cartKey = `cart_${user.email}`;
      
      console.log("🔍 Checking Cart for Key:", cartKey); 

      const items = JSON.parse(localStorage.getItem(cartKey) || '[]');
      
      console.log("📦 Items Found:", items);

      const updatedItems = items.map((item: any) => ({
        ...item,
        isSelected: item.isSelected || false,
        giftWrap: item.giftWrap || false,
        message: item.message || ''
      }));
      
      setCartItems(updatedItems);
    }
    setLoading(false);
  }, [user]); 

  const selectedItems = cartItems.filter(item => item.isSelected);
  const subtotal = selectedItems.reduce((acc, item) => acc + item.price, 0);
  const wrappingCost = selectedItems.reduce((acc, item) => acc + (item.giftWrap ? 5 : 0), 0);
  const total = subtotal + wrappingCost;

 
  const toggleSelection = (id: string) => {
    setCartItems(cartItems.map(item => 
      item._id === id ? { ...item, isSelected: !item.isSelected } : item
    ));
  };

  const toggleGiftWrap = (id: string) => {
    setCartItems(cartItems.map(item => 
      item._id === id ? { ...item, giftWrap: !item.giftWrap } : item
    ));
  };

  const updateMessage = (id: string, text: string) => {
    setCartItems(cartItems.map(item => 
      item._id === id ? { ...item, message: text } : item
    ));
  };

  const removeFromCart = (id: string) => {
    if (!user?.email) return;
    const cartKey = `cart_${user.email}`;
    const newCart = cartItems.filter(item => item._id !== id);
    
    setCartItems(newCart);
    localStorage.setItem(cartKey, JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage"));
  };

  const handleCheckout = async () => {
    if (!user?.email) return alert("Please login to place an order!");
    if (selectedItems.length === 0) return alert("Please select at least one item to order!");

    const orderData = {
      customerName: user.username,
      userEmail: user.email, 
      items: selectedItems.map(item => ({ 
        productName: item.name, 
        quantity: 1, 
        price: item.price,
        image: item.image,
        giftWrap: item.giftWrap,
        message: item.message
      })),
      totalAmount: total,
      status: "Pending"
    };

    try {
      const res = await placeOrder(orderData);

      if (res.status === 200 || res.status === 201) {
        alert("Order Placed Successfully! 🎉");
        

        const remainingItems = cartItems.filter(item => !item.isSelected);
        setCartItems(remainingItems);
        
        const cartKey = `cart_${user.email}`;
        localStorage.setItem(cartKey, JSON.stringify(remainingItems));
        
        window.dispatchEvent(new Event("storage"));
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Failed to place order.");
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty 🛒</h2>
        <button onClick={() => navigate('/dashboard')} className="bg-red-600 px-6 py-2 rounded-lg font-bold hover:bg-red-500">Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-10 font-sans text-white">
      
      <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition">← Back</button>

      <h1 className="text-3xl font-bold mb-8">Shopping Cart 🛍️</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div key={item._id} className={`p-5 rounded-xl border transition duration-300 ${item.isSelected ? 'bg-gray-800 border-red-500 shadow-lg shadow-red-900/20' : 'bg-gray-800/50 border-gray-700'}`}>
              
              <div className="flex items-start gap-4">
                <input 
                  type="checkbox" 
                  checked={item.isSelected}
                  onChange={() => toggleSelection(item._id)}
                  className="w-5 h-5 mt-2 accent-red-500 cursor-pointer"
                />
                
                <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 rounded-lg object-cover border border-gray-600" 
                    onError={(e) => {(e.target as HTMLImageElement).src = 'https://placehold.co/150'}}
                />
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-white">{item.name}</h3>
                      <p className="text-green-400 font-bold">${item.price}</p>
                    </div>
                    <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-300 text-sm font-bold">Remove</button>
                  </div>

                  {item.isSelected && (
                    <div className="mt-4 pt-4 border-t border-gray-700 space-y-3 animate-fade-in">
                      <label className="flex items-center gap-2 cursor-pointer w-fit">
                        <input 
                          type="checkbox" 
                          checked={item.giftWrap} 
                          onChange={() => toggleGiftWrap(item._id)}
                          className="w-4 h-4 accent-pink-500"
                        />
                        <span className="text-sm text-pink-300 font-medium">Add Gift Wrap (+$5.00) 🎁</span>
                      </label>

                      <input 
                        type="text" 
                        placeholder={`Message for ${item.name}...`}
                        value={item.message}
                        onChange={(e) => updateMessage(item._id, e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-sm text-white focus:border-red-500 outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Checkout Summary */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-fit shadow-xl sticky top-10">
          <h2 className="text-xl font-bold mb-6 text-white border-b border-gray-700 pb-2">Order Summary</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-300">
              <span>Selected Items</span>
              <span>{selectedItems.length}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-pink-400">
              <span>Wrapping Cost</span>
              <span>+${wrappingCost}</span>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4 mb-6">
            <div className="flex justify-between text-2xl font-extrabold mt-2 text-white">
              <span>Total</span>
              <span className="text-green-400">${total}</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={selectedItems.length === 0}
            className={`w-full py-4 rounded-xl font-bold shadow-lg transition transform ${
              selectedItems.length === 0 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white hover:scale-105'
            }`}
          >
            {selectedItems.length === 0 ? "Select Items" : "Confirm Order ✅"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;