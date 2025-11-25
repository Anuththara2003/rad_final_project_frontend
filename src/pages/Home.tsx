import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    // 1. Background Image & Container
    <div className="min-h-screen w-full bg-[url('https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-fixed bg-no-repeat">
      
      {/* Dark Overlay */}
      <div className="min-h-screen w-full bg-black/50 flex flex-col">
        
        {/* 2. Navbar */}
        <nav className="flex justify-between items-center px-8 py-6 w-full bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <div className="text-2xl font-extrabold text-white tracking-wide">
            Giftify <span className="text-red-500">🎁</span>
          </div>
          <div className="space-x-6 font-medium">
            <Link to="/" className="text-white hover:text-red-400 transition duration-300">Home</Link>
            <Link to="/login" className="text-white hover:text-red-400 transition duration-300">Log In</Link>
            <Link to="/signup" className="bg-white text-gray-900 px-5 py-2 rounded-full font-bold hover:bg-gray-200 transition duration-300">
              Sign Up
            </Link>
          </div>
        </nav>

        {/* 3. Hero Section (Glass Box) */}
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-3xl max-w-4xl w-full text-center shadow-2xl transform transition duration-500 hover:scale-[1.01]">
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg">
              Giftify <span className="text-red-500">🎁</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto">
              Finding the perfect gift shouldn't be stressful. <br />
              Our AI-powered assistant helps you discover unique, personalized gift ideas for your friends and family in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/signup" className="px-8 py-4 bg-red-500 text-white text-lg font-bold rounded-full shadow-lg hover:bg-red-600 transition duration-300 transform hover:-translate-y-1">
                Get Started Free
              </Link>
              <Link to="/login" className="px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-bold rounded-full hover:bg-white hover:text-gray-900 transition duration-300 transform hover:-translate-y-1">
                I have an account
              </Link>
            </div>

            {/* 4. How It Works Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/20 pt-8">
              <div className="text-center group">
                <span className="text-4xl mb-2 block transform group-hover:scale-110 transition duration-300">📝</span>
                <h3 className="text-red-400 font-bold text-xl mb-1">1. Quiz</h3>
                <p className="text-gray-300 text-sm">Tell us about the person & occasion.</p>
              </div>
              <div className="text-center group">
                <span className="text-4xl mb-2 block transform group-hover:scale-110 transition duration-300">🤖</span>
                <h3 className="text-red-400 font-bold text-xl mb-1">2. AI Match</h3>
                <p className="text-gray-300 text-sm">We analyze thousands of gift ideas.</p>
              </div>
              <div className="text-center group">
                <span className="text-4xl mb-2 block transform group-hover:scale-110 transition duration-300">🎉</span>
                <h3 className="text-red-400 font-bold text-xl mb-1">3. Surprise</h3>
                <p className="text-gray-300 text-sm">Pick the perfect gift and smile.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;