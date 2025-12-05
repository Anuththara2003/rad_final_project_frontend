import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, googleAuth } from '../services/auth'; 
import { GoogleLogin } from '@react-oauth/google'; 
import { getMyDetails } from '../services/user';
import { useAuth } from '../context/authContex';


const Signup = () => {
    const { user, setUser } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser({ username, email, password });
      alert("Registration Successful! Please Login.");
      navigate('/login');
    } catch (error: any) {
      console.error("Signup Error:", error);
      const errorMessage = error.response?.data?.message || "Registration Failed";
      alert(errorMessage);
    }
  };


  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (credentialResponse.credential) {
        
        const res = await googleAuth(credentialResponse.credential);
        


      
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        // localStorage.setItem("user", JSON.stringify(res.data.user));

         const details = await getMyDetails();
        
                    setUser(details.data);
                    console.log(user);
        

        alert("Google Login Successful! 🎉");
        
        
        if (res.data.role == 'ADMIN') {
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
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl max-w-md w-full text-center border border-white/50">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Join Giftify 🎈</h2>
        <p className="text-gray-500 mb-6">Create an account to start gifting.</p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Username</label>
            <input 
              type="text" 
              placeholder="Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              required
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
              required
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
              required
            />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transform transition active:scale-95 shadow-lg">
            Sign Up
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
          Already have an account? <Link to="/login" className="text-red-500 font-bold hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;