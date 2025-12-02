import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import PhotoUpload from '../../components/common/PhotoUpload';

const Step1BasicInfo = () => {
  const navigate = useNavigate();

  // SOLUCIÓN 1: Leer el tipo directamente al iniciar el estado
  const [plateType] = useState(() => {
    return localStorage.getItem('plateType') || '';
  });

  // SOLUCIÓN 2: Leer los datos guardados directamente al iniciar el estado
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('profileStep1');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      photo: '',
      fullName: '',
      dateOfBirth: '',
      breed: '',
    };
  });

  const [errors, setErrors] = useState({});

  // useEffect ahora SOLO se encarga de la redirección si algo falta
  useEffect(() => {
    if (!plateType) {
      navigate('/plate/select-type');
    }
  }, [plateType, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (photo) => {
    setFormData(prev => ({ ...prev, photo }));
    if (errors.photo) {
      setErrors(prev => ({ ...prev, photo: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = plateType === 'human' 
        ? 'El nombre completo es requerido'
        : 'El nombre de la mascota es requerido';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'La fecha de nacimiento es requerida';
    }

    if (plateType === 'pet' && !formData.breed.trim()) {
      newErrors.breed = 'La raza es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Guardar en localStorage
    localStorage.setItem('profileStep1', JSON.stringify(formData));

    // Ir al siguiente paso
    navigate('/plate/setup/step2');
  };

  // Si no hay tipo de placa (está redirigiendo), no renderizamos nada para evitar parpadeos
  if (!plateType) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/plate/select-type')}
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-3xl font-bold text-dark mb-2">
            Configuración del Perfil - Paso 1 de 3
          </h1>
          <p className="text-gray-600">
            Información Personal Básica
          </p>

          {/* Progress Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Paso 2 de 4</span>
              <span className="font-semibold text-primary">50%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: '50%' }}></div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload */}
            <div className="flex justify-center">
              <PhotoUpload
                value={formData.photo}
                onChange={handlePhotoChange}
                label={plateType === 'human' ? 'Foto de Perfil' : 'Foto de tu Mascota'}
              />
            </div>

            {/* Datos del Portador */}
            <div>
              <h3 className="text-lg font-semibold text-dark mb-4">
                Datos del {plateType === 'human' ? 'Portador' : 'Mascota'}:
              </h3>

              <div className="space-y-4">
                <Input
                  label={plateType === 'human' ? 'Nombre Completo' : 'Nombre de la Mascota'}
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={plateType === 'human' ? 'Ej. Guillermo Avendaño' : 'Ej. Max'}
                  error={errors.fullName}
                  required
                />

                <Input
                  label="Fecha de Nacimiento"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  error={errors.dateOfBirth}
                  required
                />

                {plateType === 'pet' && (
                  <Input
                    label="Raza"
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    placeholder="Ej. Labrador, Mestizo, etc."
                    error={errors.breed}
                    required
                  />
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" variant="primary" size="lg" fullWidth>
                GUARDAR Y CONTINUAR →
              </Button>
            </div>
          </form>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Tu información está protegida y solo será visible según tu configuración de privacidad
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step1BasicInfo;