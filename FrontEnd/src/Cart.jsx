// src/Cart.jsx
// 显示当前用户的购物车，支持修改数量、删除商品

import React, { useState, useEffect } from 'react';
import api from './api';

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart/my_cart/');
      setCart(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, newQuantity) => {
    try {
      await api.patch('/cart/update_quantity/', { product_id: productId, quantity: newQuantity });
      fetchCart(); // 刷新购物车
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete('/cart/remove/', { data: { product_id: productId } });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading cart...</div>;
  if (!cart || cart.items.length === 0) return <div>Your cart is empty.</div>;

  return (
    <div>
      <h2>Shopping Cart</h2>
      <ul>
        {cart.items.map((item) => (
          <li key={item.id}>
            <strong>{item.product.name}</strong> - ${item.product.price} x {item.quantity}
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
              style={{ width: '60px', margin: '0 10px' }}
            />
            <button onClick={() => removeItem(item.product.id)}>Remove</button>
            <span style={{ marginLeft: '10px' }}>Subtotal: ${item.total_price}</span>
          </li>
        ))}
      </ul>
      <h3>Total: ${cart.total_price}</h3>
    </div>
  );
}

export default Cart;