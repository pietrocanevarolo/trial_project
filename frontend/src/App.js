import React, { useEffect }  from 'react';
import { BrowserRouter as Router, Routes, Route ,useNavigate} from 'react-router-dom';
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
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<ProductScreen />} />
      </Routes>
    </Router>
  );
}

export default App;