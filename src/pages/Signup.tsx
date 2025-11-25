import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        alert("Registration Successful! Please Login.");
        navigate('/login');
      } else {
        alert("Registration Failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl max-w-md w-full text-center border border-white/50">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Join Giftify 🎈</h2>
        <p className="text-gray-500 mb-8">Create an account to start gifting.</p>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Username</label>
            <input 
              type="text" 
              placeholder="Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Email Address</label>
            <input 
              type="email" 
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Password</label>
            <input 
              type="password" 
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transform transition active:scale-95 shadow-lg">
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-red-500 font-bold hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;