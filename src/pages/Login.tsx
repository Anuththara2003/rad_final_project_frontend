import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, googleAuth } from '../services/auth'; // googleAuth import කරන්න
import { getMyDetails } from '../services/user';
import { useAuth } from '../context/authContex';
import { GoogleLogin } from '@react-oauth/google'; // Google Button Import

const Login = () => {
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 1. සාමාන්‍ය Login Logic
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill in all fields!');
      return;
    }

    try {
      const res: any = await loginUser(email, password);

      await localStorage.setItem("accessToken", res.data.accessToken);
      await localStorage.setItem("refreshToken", res.data.refreshToken);

      // User විස්තර ගෙන්වා ගැනීම
      const details = await getMyDetails();
      setUser(details.data);

      alert('User logged in successfully!');

      // Redirect Logic
      // Role එක Array එකක්ද String එකක්ද කියලා බලලා Redirect කරනවා
      const role = details.data.role;
      if (role === 'ADMIN' || (Array.isArray(role) && role.includes('ADMIN'))) {
        console.log("Redirecting to Admin Dashboard...");
        navigate('/admin-dashboard'); 
      } else {
        console.log("Redirecting to User Dashboard...");
        navigate('/dashboard'); 
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Invalid Email or Password");
    }
  };

 
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
        if (credentialResponse.credential) {
           
            const res: any = await googleAuth(credentialResponse.credential);

            
            await localStorage.setItem("accessToken", res.data.accessToken);
            await localStorage.setItem("refreshToken", res.data.refreshToken);

            const details = await getMyDetails();
            setUser(details.data);

            alert("Google Login Successful! 🎉");

            
            const role = details.data.role;
            if (role === 'ADMIN' || (Array.isArray(role) && role.includes('ADMIN'))) {
                navigate('/admin-dashboard');
            } else {
                navigate('/dashboard');
            }
        }
    } catch (error) {
        console.error("Google Auth Failed:", error);
        alert("Google Sign-In Failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Glass Form Box */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl max-w-md w-full text-center border border-white/50">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back! 🎁</h2>
        <p className="text-gray-500 mb-6">Login to find the perfect gift.</p>

        <form onSubmit={handleLogin} className="space-y-5">
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

        {/* --- OR Divider --- */}
        <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm font-medium">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* --- Google Button --- */}
        <div className="flex justify-center w-full">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                    console.log('Login Failed');
                    alert("Google Login Failed");
                }}
                shape="circle"
                theme="outline"
                width="100%"
                size="large"
            />
        </div>

        <div className="mt-6 text-sm text-gray-600">
          Don't have an account? <Link to="/signup" className="text-red-500 font-bold hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;