// Authentication utilities

import { User } from './types';

export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  // Dispatch custom event to notify components of auth change
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('authChange'));
  }
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token');
};

export const clearTokens = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  // Dispatch custom event to notify components of auth change
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('authChange'));
  }
};

export const setUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
  // Dispatch custom event to notify components of auth change
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('authChange'));
  }
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

