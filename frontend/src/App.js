import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'; // Remove BrowserRouter import
import Login from './components/Login';
import ProductScreen from './components/ProductScreen';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/products" element={<ProductScreen />} />
    </Routes>
  );
}

export default App;