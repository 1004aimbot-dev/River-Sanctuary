import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Lineup from './pages/Lineup';
import Masterplan from './pages/Masterplan';
import Location from './pages/Location';
import Process from './pages/Process';
import FAQ from './pages/FAQ';
import Booking from './pages/Booking';
import ProductDetail from './pages/ProductDetail';
import BottomNav from './components/BottomNav';
import AIChatbot from './components/AIChatbot';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ChatProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#111c21] text-[#111518] dark:text-gray-100 transition-colors duration-300">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lineup" element={<Lineup />} />
              <Route path="/masterplan" element={<Masterplan />} />
              <Route path="/location" element={<Location />} />
              <Route path="/process" element={<Process />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/detail" element={<ProductDetail />} />
            </Routes>
            <AIChatbot />
            <BottomNav />
          </div>
        </Router>
      </ChatProvider>
    </ThemeProvider>
  );
};

export default App;