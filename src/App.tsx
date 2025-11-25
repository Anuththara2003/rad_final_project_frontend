import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';   // අලුත් Home page එක import කරන්න
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. '/' කියන්නේ මුල් පිටුව. දැන් එතනට Home එක දාන්න */}
        <Route path="/" element={<Home />} />
        
        {}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;