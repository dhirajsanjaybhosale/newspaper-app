import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@Auth:token');
      const storedUser = await AsyncStorage.getItem('@Auth:user');

      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { token: authToken, data } = response;

      await AsyncStorage.setItem('@Auth:token', authToken);
      await AsyncStorage.setItem('@Auth:user', JSON.stringify(data.user));

      setUser(data.user);
      setToken(authToken);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to sign in',
      };
    }
  };

  const signUp = async (userData) => {
    try {
      const response = await authService.signup(userData);
      const { token: authToken, data } = response;

      await AsyncStorage.setItem('@Auth:token', authToken);
      await AsyncStorage.setItem('@Auth:user', JSON.stringify(data.user));

      setUser(data.user);
      setToken(authToken);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to sign up',
      };
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();
      await AsyncStorage.removeItem('@Auth:token');
      await AsyncStorage.removeItem('@Auth:user');

      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateUser = async (userData) => {
    try {
      const response = await authService.updateMe(userData);
      const updatedUser = response.data.user;

      await AsyncStorage.setItem('@Auth:user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        token,
        signIn,
        signUp,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
