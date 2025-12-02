import { api } from './api';
import { generateVerificationCode } from '../utils/validators';

// Cambiar a false cuando el backend esté corriendo
const MOCK_MODE = false;

// Storage keys
const TOKEN_KEY = 'authToken';
const USER_KEY = 'userData';

// Register user and send verification code
export const register = async (email, password) => {
  if (MOCK_MODE) {
    // Simulación - Generar código y guardarlo temporalmente
    const code = generateVerificationCode();
    localStorage.setItem('tempVerificationCode', code);
    localStorage.setItem('tempEmail', email);
    localStorage.setItem('tempPassword', password);
    
    console.log('🔐 Código de verificación (MOCK):', code);
    
    return {
      success: true,
      message: 'Código enviado a tu email',
      userId: 'temp-user-id',
    };
  }

  // Llamada real al backend
  return await api.post('/auth/register', { email, password });
};

// Verify code and create account
export const verifyCode = async (email, code) => {
  if (MOCK_MODE) {
    const storedCode = localStorage.getItem('tempVerificationCode');
    const storedEmail = localStorage.getItem('tempEmail');
    //const storedPassword = localStorage.getItem('tempPassword');
    
    if (code === storedCode && email === storedEmail) {
      const mockUser = {
        id: 'user-' + Date.now(),
        email: email,
        createdAt: new Date().toISOString(),
      };
      
      const mockToken = 'mock-token-' + Date.now();
      
      // Guardar en localStorage
      localStorage.setItem(TOKEN_KEY, mockToken);
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      
      // Limpiar datos temporales
      localStorage.removeItem('tempVerificationCode');
      localStorage.removeItem('tempEmail');
      localStorage.removeItem('tempPassword');
      
      return {
        success: true,
        token: mockToken,
        user: mockUser,
      };
    }
    
    throw new Error('Código inválido');
  }

  // Llamada real al backend
  return await api.post('/auth/verify-code', { email, code });
};

// Login
export const login = async (email, password) => {
  if (MOCK_MODE) {
    // Simulación simple
    const mockUser = {
      id: 'user-' + Date.now(),
      email: email,
    };
    
    const mockToken = 'mock-token-' + Date.now();
    
    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    
    return {
      success: true,
      token: mockToken,
      user: mockUser,
    };
  }

  // Llamada real al backend
  const response = await api.post('/auth/login', { email, password });
  
  if (response.success) {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
  }
  
  return response;
};

// Logout
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  
  if (!MOCK_MODE) {
    api.post('/auth/logout').catch(console.error);
  }
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

// Get token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Solicitar recuperación de contraseña
export const forgotPassword = async (email) => {
  if (MOCK_MODE) {
    const code = generateVerificationCode();
    localStorage.setItem('tempResetCode', code);
    localStorage.setItem('tempResetEmail', email);
    console.log('🔐 Código de recuperación (MOCK):', code);
    
    return {
      success: true,
      message: 'Código enviado a tu email',
    };
  }

  return await api.post('/auth/forgot-password', { email });
};

// Verificar código de recuperación
export const verifyResetCode = async (email, code) => {
  if (MOCK_MODE) {
    const storedCode = localStorage.getItem('tempResetCode');
    const storedEmail = localStorage.getItem('tempResetEmail');
    
    if (code === storedCode && email === storedEmail) {
      return {
        success: true,
        message: 'Código verificado',
      };
    }
    
    throw new Error('Código inválido');
  }

  return await api.post('/auth/verify-reset-code', { email, code });
};

// Restablecer contraseña
export const resetPassword = async (email, code, newPassword) => {
  if (MOCK_MODE) {
    const storedCode = localStorage.getItem('tempResetCode');
    const storedEmail = localStorage.getItem('tempResetEmail');
    
    if (code === storedCode && email === storedEmail) {
      localStorage.removeItem('tempResetCode');
      localStorage.removeItem('tempResetEmail');
      
      return {
        success: true,
        message: 'Contraseña actualizada',
      };
    }
    
    throw new Error('Código inválido');
  }

  return await api.post('/auth/reset-password', { email, code, newPassword });
};