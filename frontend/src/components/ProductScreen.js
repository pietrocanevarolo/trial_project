import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductScreen = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [user] = useState(sessionStorage.getItem('user'));
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/api/products?search=${search}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300); // Adds a debounce for smoother updates

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleSelect = async (id) => {
    try {
      const response = await axios.post(`/api/products/${id}/select/`);
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? { ...product, selected: response.data.selected } : product
        )
      );
    } catch (error) {
      console.error('Error selecting product:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <div>
      <div>
        <span>Welcome, {user || 'Guest'}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <input
        type="text"
        placeholder="Search products"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td>
                <button
                  onClick={() => handleSelect(product.id)}
                  disabled={product.selected}
                >
                  {product.selected ? 'Selected' : 'Select'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductScreen;