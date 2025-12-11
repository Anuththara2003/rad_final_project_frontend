import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { resetPassword } from '../services/auth'; // Service import

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { token } = useParams(); // URL එකෙන් Token එක ගන්නවා
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match!", { variant: 'error' });
      return;
    }

    if (password.length < 6) {
        enqueueSnackbar("Password must be at least 6 characters.", { variant: 'warning' });
        return;
    }

    setLoading(true);

    try {
      if (token) {
        await resetPassword(token, password);
        enqueueSnackbar("Password reset successful! Please login. 🎉", { variant: 'success' });
        
        setTimeout(() => {
            navigate('/login');
        }, 2000);
      }
    } catch (error: any) {
      console.error("Reset Error:", error);
      const msg = error.response?.data?.message || "Something went wrong. Try again.";
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center font-sans">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 max-w-md w-full text-center">
        
        <h2 className="text-3xl font-extrabold text-white mb-2 drop-shadow-lg">Reset Password 🔐</h2>
        <p className="text-gray-200 mb-8 font-light text-sm">
          Create a new strong password for your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-300 mb-2 ml-1">New Password</label>
            <input 
              type="password" 
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-5 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white/30 transition shadow-inner"
              required
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-300 mb-2 ml-1">Confirm Password</label>
            <input 
              type="password" 
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="w-full px-5 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white/30 transition shadow-inner"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold py-3.5 rounded-xl transform transition hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-500/30 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;