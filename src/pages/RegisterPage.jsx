import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Shield, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword, getPasswordStrength } from '../utils/validators';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, verifyCode } = useAuth();
  
  // Steps: 1 = Email, 2 = Verification Code, 3 = Password
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    password: '',
    confirmPassword: '',
  });
  
  // Errors
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  // Validate step 1 (Email)
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate step 2 (Code)
  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.code) {
      newErrors.code = 'El código es requerido';
    } else if (formData.code.length !== 6) {
      newErrors.code = 'El código debe tener 6 dígitos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate step 3 (Password)
  const validateStep3 = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Mínimo 8 caracteres, una letra y un número';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Step 1 - Send verification code
  const handleSendCode = async (e) => {
    e.preventDefault();
    
    if (!validateStep1()) return;
    
    setLoading(true);
    setApiError('');
    
    try {
      await register(formData.email, 'temp-password');
      setStep(2);
    } catch (error) {
      setApiError(error.message || 'Error al enviar el código');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2 - Verify code and go to password
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setStep(3);
  };

  // Handle Step 3 - Create account
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    
    if (!validateStep3()) return;
    
    setLoading(true);
    setApiError('');
    
    try {
      await verifyCode(formData.email, formData.code);
      navigate('/dashboard');
    } catch (error) {
      setApiError(error.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-6">
            <ArrowLeft className="w-5 h-5" />
            Volver al inicio
          </Link>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold text-dark">
              Guardian<span className="text-primary"> GPS</span>
            </h1>
          </div>
          
          <h2 className="text-2xl font-bold text-dark mb-2">
            Crear tu Cuenta Segura
          </h2>
          <p className="text-gray-600">
            {step === 1 && 'Paso 1: Ingresa tu Email'}
            {step === 2 && 'Paso 2: Verificación'}
            {step === 3 && 'Paso 3: Crea tu Contraseña'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                s === step ? 'bg-primary text-white' : 
                s < step ? 'bg-green-500 text-white' : 
                'bg-gray-200 text-gray-500'
              }`}>
                {s < step ? <CheckCircle className="w-6 h-6" /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {apiError}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                icon={Mail}
                error={errors.email}
                required
              />

              <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
                {loading ? 'Enviando...' : 'OBTENER CÓDIGO DE VERIFICACIÓN'}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Se ha enviado un código a tu correo electrónico.
              </p>
            </form>
          )}

          {/* Step 2: Verification Code */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Se ha enviado un código a <strong>{formData.email}</strong>
                </p>
                
                <Input
                  label="Ingresar Código (Ej. 287873)"
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="000000"
                  maxLength="6"
                  error={errors.code}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" size="lg" fullWidth onClick={() => setStep(1)}>
                  Atrás
                </Button>
                <Button type="submit" variant="primary" size="lg" fullWidth>
                  Verificar
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Password */}
          {step === 3 && (
            <form onSubmit={handleCreateAccount} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Crear Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 pl-12 pr-12 border-2 rounded-lg transition-all duration-200 ${
                      errors.password
                        ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    } outline-none`}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                )}
                
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${
                            passwordStrength.strength === 'weak' ? 'w-1/3 bg-red-500' :
                            passwordStrength.strength === 'medium' ? 'w-2/3 bg-yellow-500' :
                            'w-full bg-green-500'
                          }`}
                        />
                      </div>
                      <span className={`text-sm font-semibold ${
                        passwordStrength.strength === 'weak' ? 'text-red-500' :
                        passwordStrength.strength === 'medium' ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 pl-12 pr-12 border-2 rounded-lg transition-all duration-200 ${
                      errors.confirmPassword
                        ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    } outline-none`}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
                {loading ? 'Creando cuenta...' : 'REGÍSTRIATE AHORA'}
              </Button>
            </form>
          )}

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;