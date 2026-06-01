// src/AuthContext.jsx
// 全局管理用户登录状态、用户信息

import React, { createContext, useState, useContext, useEffect } from 'react';
import api from './api';
import { setTokens, clearTokens, getAccessToken, getUserInfo } from './auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 检查本地 token 并获取用户信息
  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          const { data } = await api.get('/auth/me/');
          setUser(data); // data 包含 id, username, email, is_admin
        } catch (err) {
          clearTokens();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post('/auth/login/', { username, password });
    setTokens(data.access, data.refresh);
    // 获取用户信息
    const userData = await api.get('/auth/me/');
    setUser(userData.data);
    return data;
  };

  const register = async (username, password, email = '', isAdmin = false) => {
    const { data } = await api.post('/auth/register/', {
      username,
      password,
      email,
      is_admin: isAdmin,
    });
    // 注册成功后自动登录
    await login(username, password);
    return data;
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};