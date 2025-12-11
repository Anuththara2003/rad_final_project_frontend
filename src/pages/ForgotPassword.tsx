import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { forgotPassword } from '../services/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      enqueueSnackbar("Please enter your email address.", { variant: 'warning' });
      return;
    }

    setLoading(true);

    try {
      // Backend එකට Request එක යවනවා
      await forgotPassword(email);
      
      enqueueSnackbar("Reset link sent to your email! 📧", { variant: 'success' });
      
      // තත්පර 3කින් ආයේ Login එකට යවනවා
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error:any) {
      console.log("Error:", error.message);
      
      enqueueSnackbar("If this email exists, a reset link has been sent.", { variant: 'info' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center font-sans">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Glass Box */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 max-w-md w-full text-center">
        
        <h2 className="text-3xl font-extrabold text-white mb-2 drop-shadow-lg">Forgot Password? 🔒</h2>
        <p className="text-gray-200 mb-8 font-light text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-300 mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-5 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white/30 transition shadow-inner"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold py-3.5 rounded-xl transform transition hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-500/30 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-8 text-sm text-gray-300">
          Remember your password? <Link to="/login" className="text-white font-bold hover:text-red-300 hover:underline transition ml-1">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;