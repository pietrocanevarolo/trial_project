import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Container, Grid, InputAdornment, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const ProductScreen = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [user] = useState(JSON.parse(localStorage.getItem('user')) || { username: "", name: "", email: "" });
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };
  

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} alignItems="center" justifyContent="space-between">
        <Grid item xs={12} sm={8}>
          <Typography variant="h4">Welcome, {user?.email || 'Guest'}</Typography>
        </Grid>
        <Grid item xs={12} sm={4} container justifyContent="flex-end">
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Grid>
      </Grid>
      <TextField
        fullWidth
        label="Search products"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ marginTop: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <TableContainer sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color={product.selected ? 'default' : 'primary'}
                    onClick={() => handleSelect(product.id)}
                    disabled={product.selected}
                  >
                    {product.selected ? 'Selected' : 'Select'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ProductScreen;