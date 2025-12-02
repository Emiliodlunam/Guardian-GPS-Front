import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Shield, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { forgotPassword, verifyResetCode, resetPassword } from '../services/authService';
import { validateEmail, validatePassword, getPasswordStrength } from '../utils/validators';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  
  // Steps: 1 = Email, 2 = Code, 3 = New Password, 4 = Success
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  // Validar Step 1 (Email)
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

  // Validar Step 2 (Code)
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

  // Validar Step 3 (Password)
  const validateStep3 = () => {
    const newErrors = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = 'Mínimo 8 caracteres, una letra y un número';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Step 1 - Send recovery code
  const handleSendCode = async (e) => {
    e.preventDefault();
    
    if (!validateStep1()) return;
    
    setLoading(true);
    setApiError('');
    
    try {
      await forgotPassword(formData.email);
      setStep(2);
    } catch (error) {
      setApiError(error.message || 'Error al enviar el código');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2 - Verify code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setLoading(true);
    setApiError('');
    
    try {
      await verifyResetCode(formData.email, formData.code);
      setStep(3);
    } catch (error) {
      setApiError(error.message || 'Código inválido o expirado');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 3 - Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validateStep3()) return;
    
    setLoading(true);
    setApiError('');
    
    try {
      await resetPassword(formData.email, formData.code, formData.newPassword);
      setStep(4);
    } catch (error) {
      setApiError(error.message || 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/login" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-6">
            <ArrowLeft className="w-5 h-5" />
            Volver al Login
          </Link>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold text-dark">
              Guardian<span className="text-primary"> GPS</span>
            </h1>
          </div>
          
          <h2 className="text-2xl font-bold text-dark mb-2">
            {step === 4 ? '¡Contraseña Restablecida!' : 'Recuperar Contraseña'}
          </h2>
          <p className="text-gray-600">
            {step === 1 && 'Ingresa tu email para recibir un código'}
            {step === 2 && 'Verifica el código enviado a tu email'}
            {step === 3 && 'Crea tu nueva contraseña'}
            {step === 4 && 'Ya puedes iniciar sesión con tu nueva contraseña'}
          </p>
        </div>

        {/* Progress Bar (solo pasos 1-3) */}
        {step < 4 && (
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  s === step ? 'bg-primary text-white scale-110' : 
                  s < step ? 'bg-green-500 text-white' : 
                  'bg-gray-200 text-gray-500'
                }`}>
                  {s < step ? <CheckCircle className="w-6 h-6" /> : s}
                </div>
                {s < 3 && <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <Input
                label="Correo Electrónico"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                icon={Mail}
                error={errors.email}
                required
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <strong>💡 Nota:</strong> Te enviaremos un código de 6 dígitos a tu correo electrónico.
                </p>
              </div>

              <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
                {loading ? 'Enviando...' : 'ENVIAR CÓDIGO DE RECUPERACIÓN'}
              </Button>
            </form>
          )}

          {/* Step 2: Verification Code */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Hemos enviado un código a <strong>{formData.email}</strong>
                </p>
                
                <Input
                  label="Código de Recuperación"
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="000000"
                  maxLength="6"
                  error={errors.code}
                  required
                  className="text-center text-2xl tracking-widest"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-700">
                  <strong>⏱️ Importante:</strong> El código expirará en 10 minutos.
                </p>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" size="lg" fullWidth onClick={() => setStep(1)}>
                  ← Atrás
                </Button>
                <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
                  {loading ? 'Verificando...' : 'VERIFICAR CÓDIGO'}
                </Button>
              </div>

              <button
                type="button"
                onClick={handleSendCode}
                className="w-full text-sm text-primary hover:underline"
              >
                ¿No recibiste el código? Reenviar
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nueva Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 pl-12 pr-12 border-2 rounded-lg transition-all duration-200 ${
                      errors.newPassword
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
                {errors.newPassword && (
                  <p className="text-red-600 text-sm mt-1">{errors.newPassword}</p>
                )}
                
                {formData.newPassword && (
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
                    <p className="text-xs text-gray-500">
                      Mínimo 8 caracteres, una letra y un número
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar Nueva Contraseña <span className="text-red-500">*</span>
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

              <div className="flex gap-3">
                <Button type="button" variant="outline" size="lg" fullWidth onClick={() => setStep(2)}>
                  ← Atrás
                </Button>
                <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
                  {loading ? 'Actualizando...' : 'RESTABLECER CONTRASEÑA'}
                </Button>
              </div>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-dark mb-2">
                  ¡Contraseña Restablecida!
                </h3>
                <p className="text-gray-600">
                  Tu contraseña ha sido actualizada exitosamente.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700">
                  <strong>✅ Listo:</strong> Ya puedes iniciar sesión con tu nueva contraseña.
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate('/login')}
              >
                IR AL Inicio de Sesión
              </Button>
            </div>
          )}
        </div>

        {/* Help Text */}
        {step < 4 && (
          <p className="text-center text-sm text-gray-600 mt-6">
            ¿Recordaste tu contraseña?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Iniciar Sesión
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;