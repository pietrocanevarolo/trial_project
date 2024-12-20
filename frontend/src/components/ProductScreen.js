import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Container, Grid, InputAdornment, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const ProductScreen = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [user] = useState(JSON.parse(localStorage.getItem('user')) || { username: "", name: "", email: "" });
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/products/?search=${search}&sort=${sortField}&order=${sortOrder}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300); 

    return () => clearTimeout(delayDebounceFn);
  }, [search, sortField, sortOrder]); // Fetch products on search, sort field, or sort order change

  const handleSelect = async (id, selected) => {
    try {
      // Effettua una richiesta PATCH per aggiornare il campo selected
      const response = await axios.patch(`http://localhost:8000/api/products/`, {
        id: id,
        selected: !selected, 
      });
  
      // Aggiorna lo stato dei prodotti con il nuovo valore
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? { ...product, selected: response.data.selected } : product
        )
      );
    } catch (error) {
      console.error('Error updating product selection:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleSortChange = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle the order if same field is selected
    } else {
      setSortField(field);
      setSortOrder('asc'); // Default to ascending when selecting a new field
    }
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

      <FormControl sx={{ marginTop: 3, width: 200 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortField}
          onChange={(e) => handleSortChange(e.target.value)}
          label="Sort By"
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="price">Price</MenuItem>
          <MenuItem value="stock">Stock</MenuItem>
          <MenuItem value="id">ID</MenuItem>
        </Select>
      </FormControl>

      <TableContainer sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSortChange('id')}>ID</TableCell>
              <TableCell onClick={() => handleSortChange('name')}>Name</TableCell>
              <TableCell onClick={() => handleSortChange('description')}>Description</TableCell>
              <TableCell onClick={() => handleSortChange('price')}>Price</TableCell>
              <TableCell onClick={() => handleSortChange('stock')}>Stock</TableCell>
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
                color={product.selected ? 'success' : 'primary'} // Usa 'success' per un colore diverso
                onClick={() => handleSelect(product.id, product.selected)}
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
