import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import UserDashboard from '../pages/user/UserDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import GiftQuiz from '../pages/user/GiftQuiz';
import QuizResults from '../pages/user/QuizResults';
import ProductDetails from '../pages/user/ProductDetails';
import Cart from '../pages/user/Cart';
import MyWishList from '../pages/user/MyWishList';
import { useAuth } from '../context/authContex';
import { Suspense, type ReactNode } from 'react';
import Layouts from '../layouts/Layouts';
import ForgotPassword from '../pages/ForgotPassword';



type RequireAuthType = { children: ReactNode, role?: string[] }

const RequireAuth = ({ children, role }: RequireAuthType) => {

  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
        {/* Spinner with Glow */}
        <div className="w-16 h-16 border-4 border-slate-800 border-t-cyan-400 rounded-full animate-spin shadow-[0_0_15px_rgba(34,211,238,0.3)]"></div>

        {/* Loading Text */}
        <p className="mt-4 text-slate-400 text-sm font-medium animate-pulse">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }


  if (role && !role.some((role) => user.role?.includes(role))) {

    return (
      <div className="fixed inset-0 z-50 min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">

        <div className="bg-red-500/10 p-4 rounded-full mb-4">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>

        <h2 className="text-3xl font-bold mb-2">Access Denied</h2>
        <p className="text-slate-400">You do not have permission to view this page.</p>

      </div>
    )
  }

  return <>{children}</>
}

function index() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
          {/* Spinner with Glow */}
          <div className="w-16 h-16 border-4 border-slate-800 border-t-cyan-400 rounded-full animate-spin shadow-[0_0_15px_rgba(34,211,238,0.3)]"></div>

          {/* Loading Text */}
          <p className="mt-4 text-slate-400 text-sm font-medium animate-pulse">Loading...</p>
        </div>
      }>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* User Routes */}
          <Route element={<RequireAuth><Layouts/></RequireAuth>}>
            
            <Route path="/dashboard" element={<RequireAuth role={["USER"]}><UserDashboard/></RequireAuth>} />
            <Route path="/quiz" element={<RequireAuth role={["USER"]}><GiftQuiz/></RequireAuth>} />
            <Route path="/results" element={<RequireAuth role={["USER"]}><QuizResults/></RequireAuth>} />
            <Route path="/product/:id" element={<RequireAuth role={["USER"]}><ProductDetails/></RequireAuth>} />
            <Route path="/cart" element={<RequireAuth role={["USER"]}><Cart/></RequireAuth>} />
            <Route path="/wishlist" element={<RequireAuth role={["USER"]}><MyWishList/></RequireAuth>} />
          </Route>

          {/* Admin Routes */}
          <Route element={<RequireAuth><Layouts/></RequireAuth>}>

          <Route path="/admin-dashboard" element={<RequireAuth role={["ADMIN"]}><AdminDashboard/></RequireAuth>} />
          </Route>
        </Routes>
        
      </Suspense>
    </BrowserRouter>
  );
}

export default index
