import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      // Console එකේ බලන්න දත්ත එන විදිය (Testing වලට)
      console.log("Login Response Data:", data); 

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));

        // Role එක check කරන තැන
        if (data.user.role.toUpperCase() === 'ADMIN') {
            console.log("Redirecting to Admin Dashboard...");
            navigate('/admin-dashboard'); 
        } else {
            console.log("Redirecting to User Dashboard...");
            // මෙතන කලින් තිබ්බේ '/' වෙන්න ඇති. ඒක '/dashboard' කරන්න.
            navigate('/dashboard'); 
        }

      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
};

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Glass Form Box */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl max-w-md w-full text-center border border-white/50">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back! 🎁</h2>
        <p className="text-gray-500 mb-8">Login to find the perfect gift.</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
              required
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Password</label>
            <input 
              type="password" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
              required
            />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transform transition active:scale-95 shadow-lg">
            Login
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600">
          Don't have an account? <Link to="/signup" className="text-red-500 font-bold hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;