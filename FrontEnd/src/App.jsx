// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './AuthContext';
import Login from './Login';
import Register from './Register';
import Cart from './Cart';
import AdminCarts from './AdminCarts';
import ProductSearch from './ProductSearch';
import api from './api';
import './App.css';

// 商品列表组件（内部使用）
function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取所有商品
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products/');
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = async (keyword) => {
    if (!keyword.trim()) {
      setFilteredProducts(products);
      return;
    }
    try {
      const { data } = await api.get(`/products/search/?q=${encodeURIComponent(keyword)}`);
      setFilteredProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = async (productId) => {
    try {
      await api.post('/cart/add/', { product_id: productId, quantity: 1 });
      alert('Added to cart!');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <h2>Products</h2>
      <ProductSearch onSearch={handleSearch} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {filteredProducts.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>{product.description}</p>
            <button onClick={() => addToCart(product.id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 导航栏组件
function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ display: 'flex', gap: '15px', padding: '10px', background: '#f0f0f0' }}>
      <Link to="/">Home</Link>
      {user ? (
        <>
          <Link to="/cart">Cart</Link>
          {user.is_admin && <Link to="/admin/carts">Admin Panel</Link>}
          <span>Welcome, {user.username}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

// 应用主组件，包含路由
function AppContent() {
  const { loading } = useAuth();

  if (loading) return <div>Loading app...</div>;

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin/carts" element={<AdminCarts />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;