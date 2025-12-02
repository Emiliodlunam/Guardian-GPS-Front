// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  // Mínimo 8 caracteres, al menos una letra y un número
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

// Verification code validation (6 digits)
export const validateVerificationCode = (code) => {
  const codeRegex = /^\d{6}$/;
  return codeRegex.test(code);
};

// Get password strength
export const getPasswordStrength = (password) => {
  if (password.length < 6) return { strength: 'weak', text: 'Débil', color: 'red' };
  if (password.length < 8) return { strength: 'medium', text: 'Media', color: 'yellow' };
  if (validatePassword(password)) return { strength: 'strong', text: 'Fuerte', color: 'green' };
  return { strength: 'medium', text: 'Media', color: 'yellow' };
};

// Generate random verification code
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};