// src/auth.js
// 用于存储、获取、清除 token，以及解码 token 获取用户信息

import { jwtDecode } from 'jwt-decode';

export const setTokens = (access, refresh) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const getAccessToken = () => localStorage.getItem('access_token');

export const isAuthenticated = () => !!getAccessToken();

// 从 access token 中解码用户信息
export const getUserInfo = () => {
  const token = getAccessToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    // decoded.user_id 是用户的 id，但我们还需要 username 和 is_admin
    // 需要单独调用 /api/auth/me/ 获取，此处只返回 user_id
    return { userId: decoded.user_id };
  } catch (e) {
    return null;
  }
};