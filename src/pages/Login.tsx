// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { loginUser, googleAuth } from '../services/auth'; // googleAuth import කරන්න
// import { getMyDetails } from '../services/user';
// import { useAuth } from '../context/authContex';
// import { GoogleLogin } from '@react-oauth/google'; 
// import { useSnackbar } from 'notistack'


// const Login = () => {
//   const { setUser } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();
//   const { enqueueSnackbar } = useSnackbar();


//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!email || !password) {
//       enqueueSnackbar("Please enter both email and password.", { variant: 'warning' });
//       return;
//     }

//     try {
//       const res: any = await loginUser(email, password);

//       await localStorage.setItem("accessToken", res.data.accessToken);
//       await localStorage.setItem("refreshToken", res.data.refreshToken);

//       const details = await getMyDetails();
//       setUser(details.data);

//       enqueueSnackbar("Login Successful! 🎉", { variant: 'success' });

//       const role = details.data.role;
//       if (role === 'ADMIN' || (Array.isArray(role) && role.includes('ADMIN'))) {
//         console.log("Redirecting to Admin Dashboard...");
//         navigate('/admin-dashboard'); 
//       } else {
//         console.log("Redirecting to User Dashboard...");
//         navigate('/dashboard'); 
//       }

//     } catch (error) {
//       console.error("Error:", error);
//       enqueueSnackbar("Login Failed. Please check your credentials.", { variant: 'error' });
//     }
//   };


//   const handleGoogleSuccess = async (credentialResponse: any) => {
//     try {
//         if (credentialResponse.credential) {

//             const res: any = await googleAuth(credentialResponse.credential);


//             await localStorage.setItem("accessToken", res.data.accessToken);
//             await localStorage.setItem("refreshToken", res.data.refreshToken);

//             const details = await getMyDetails();
//             setUser(details.data);

//             enqueueSnackbar("Login Successful! 🎉", { variant: 'success' });


//             const role = details.data.role;
//             if (role === 'ADMIN' || (Array.isArray(role) && role.includes('ADMIN'))) {
//                 navigate('/admin-dashboard');
//             } else {
//                 navigate('/dashboard');
//             }
//         }
//     } catch (error) {
//         console.error("Google Auth Failed:", error);
//         enqueueSnackbar("Google Login Failed", { variant: 'error' });
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/40"></div>

//       {/* Glass Form Box */}
//       <div className="relative z-10 bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl max-w-md w-full text-center border border-white/50">
//         <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back! 🎁</h2>
//         <p className="text-gray-500 mb-6">Login to find the perfect gift.</p>

//         <form onSubmit={handleLogin} className="space-y-5">
//           <div className="text-left">
//             <label className="block text-sm font-semibold text-gray-600 mb-1">Email Address</label>
//             <input 
//               type="email" 
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)} 
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
//               required
//             />
//           </div>

//           <div className="text-left">
//             <label className="block text-sm font-semibold text-gray-600 mb-1">Password</label>
//             <input 
//               type="password" 
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)} 
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
//               required
//             />
//           </div>

//           <button type="submit" className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transform transition active:scale-95 shadow-lg">
//             Login
//           </button>
//         </form>

//         {/* --- OR Divider --- */}
//         <div className="flex items-center my-6">
//             <div className="flex-grow border-t border-gray-300"></div>
//             <span className="mx-4 text-gray-500 text-sm font-medium">OR</span>
//             <div className="flex-grow border-t border-gray-300"></div>
//         </div>

//         {/* --- Google Button --- */}
//         <div className="flex justify-center w-full">
//             <GoogleLogin
//                 onSuccess={handleGoogleSuccess}
//                 onError={() => {
//                     console.log('Login Failed');
//                     enqueueSnackbar("Google Login Failed", { variant: 'error' });
//                 }}
//                 shape="circle"
//                 theme="outline"
//                 width="100%"
//                 size="large"
//             />
//         </div>

//         <div className="mt-6 text-sm text-gray-600">
//           Don't have an account? <Link to="/signup" className="text-red-500 font-bold hover:underline">Sign Up</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;




import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, googleAuth } from '../services/auth';
import { getMyDetails } from '../services/user';
import { useAuth } from '../context/authContex';
import { GoogleLogin } from '@react-oauth/google';
import { useSnackbar } from 'notistack'

const Login = () => {
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      enqueueSnackbar("Please enter both email and password.", { variant: 'warning' });
      return;
    }

    try {
      const res: any = await loginUser(email, password);

      await localStorage.setItem("accessToken", res.data.accessToken);
      await localStorage.setItem("refreshToken", res.data.refreshToken);

      const details = await getMyDetails();
      setUser(details.data);

      enqueueSnackbar("Login Successful! 🎉", { variant: 'success' });

      const role = details.data.role;
      if (role === 'ADMIN' || (Array.isArray(role) && role.includes('ADMIN'))) {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      console.error("Error:", error);
      enqueueSnackbar("Login Failed. Please check your credentials.", { variant: 'error' });
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

        enqueueSnackbar("Login Successful! 🎉", { variant: 'success' });

        const role = details.data.role;
        if (role === 'ADMIN' || (Array.isArray(role) && role.includes('ADMIN'))) {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error("Google Auth Failed:", error);
      enqueueSnackbar("Google Login Failed", { variant: 'error' });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center font-sans">
      {/* Dark Overlay with Blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Glassmorphism Form Box */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 max-w-md w-full text-center">

        <h2 className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">Welcome Back! 🎁</h2>
        <p className="text-gray-200 mb-8 font-light">Login to find the perfect gift.</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-300 mb-2 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white/30 transition shadow-inner"
              required
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-300 mb-2 ml-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white/30 transition shadow-inner"
              required
            />

            {/* --- Forgot Password Link (Added Here) --- */}
            <div className="flex justify-end mt-2">
              <Link to="/forgot-password" className="text-sm text-gray-300 hover:text-white hover:underline transition font-medium">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold py-3.5 rounded-xl transform transition hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-500/30">
            Login
          </button>
        </form>

        {/* --- OR Divider --- */}
        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-gray-400/50"></div>
          <span className="mx-4 text-gray-300 text-sm font-medium">OR</span>
          <div className="flex-grow border-t border-gray-400/50"></div>
        </div>

        {/* --- Google Button --- */}
        <div className="flex justify-center w-full mt-2">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log('Login Failed');
              enqueueSnackbar("Google Login Failed", { variant: 'error' });
            }}
            theme="filled_black" 
            size="large"
            shape="pill"
            width="200"
            text="signin_with"
          />
        </div>

        <div className="mt-8 text-sm text-gray-300">
          Don't have an account? <Link to="/signup" className="text-white font-bold hover:text-red-300 hover:underline transition ml-1">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;