import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Custom from './pages/Custom';
import Industries from './pages/Industries';
import Process from './pages/Process';
import About from './pages/About';
import Contact from './pages/Contact';

import MobileWhatsAppCTA from './components/MobileWhatsAppCTA';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/bags" element={<Products />} />
            <Route path="/bags/:id" element={<ProductDetail />} />
            <Route path="/custom" element={<Custom />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/process" element={<Process />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
        <MobileWhatsAppCTA />
      </div>
    </Router>
  );
}

export default App;
