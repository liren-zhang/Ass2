// src/AdminCarts.jsx
// 仅管理员可访问，显示所有用户的购物车

import React, { useState, useEffect } from 'react';
import api from './api';
import { useAuth } from './AuthContext';

function AdminCarts() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAllCarts = async () => {
      try {
        const { data } = await api.get('/admin/carts/');
        setCarts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.is_admin) {
      fetchAllCarts();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user?.is_admin) return <div>Access denied. Admin only.</div>;

  return (
    <div>
      <h2>All Users' Carts (Admin)</h2>
      {carts.length === 0 && <p>No carts found.</p>}
      {carts.map((cart) => (
        <div key={cart.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>User: {cart.username}</h3>
          <p>Cart ID: {cart.id}</p>
          <p>Created: {cart.created_at}</p>
          <p>Updated: {cart.updated_at}</p>
          <ul>
            {cart.items.map((item) => (
              <li key={item.id}>
                {item.product.name} - ${item.product.price} x {item.quantity} = ${item.total_price}
              </li>
            ))}
          </ul>
          <p>Total: ${cart.total_price}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminCarts;