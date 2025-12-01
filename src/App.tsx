import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import GiftQuiz from './pages/user/GiftQuiz'; 
import QuizResults from './pages/user/QuizResults'; 
import ProductDetails from './pages/user/ProductDetails';
import Cart from './pages/user/Cart';
import MyWishList from './pages/user/MyWishList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* User Routes */}
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/quiz" element={<GiftQuiz />} /> {}
        <Route path="/results" element={<QuizResults />} /> {}
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<MyWishList />} />
        
        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;