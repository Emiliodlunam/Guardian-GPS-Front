import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, PawPrint, ArrowLeft, Shield } from 'lucide-react';
import { activatePlate } from '../services/plateService';
import Button from '../components/common/Button';

const PlateTypeSelectionPage = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar que hay un plateId pendiente
    const plateId = localStorage.getItem('pendingPlateId');
    if (!plateId) {
      navigate('/plate/activate');
    }
  }, [navigate]);

  const handleContinue = async () => {
    if (!selectedType) return;
    
    setLoading(true);
    setError('');

    try {
      const plateId = localStorage.getItem('pendingPlateId');
      
      // Activar la placa en el backend
      const response = await activatePlate(plateId, selectedType);
      
      if (response.success) {
        // Guardar el ID de la placa activada y el tipo
        localStorage.setItem('activePlateId', response.plate.id);
        localStorage.setItem('plateType', selectedType);
        
        // Limpiar plateId pendiente
        localStorage.removeItem('pendingPlateId');
        
        // Redirigir al primer paso de configuración
        navigate('/plate/setup/step1');
      }
    } catch (err) {
      setError(err.message || 'Error al activar la placa. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/plate/activate')}
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-3xl font-bold text-dark mb-2">
            ¿Qué tipo de Placa estás activando?
          </h1>
          <p className="text-gray-600">
            Selecciona el tipo de perfil que deseas crear
          </p>

          {/* Progress Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Paso 1 de 4</span>
              <span className="font-semibold text-primary">20%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: '20%' }}></div>
            </div>
          </div>
        </div>

        {/* Type Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Human Plate */}
          <button
            onClick={() => setSelectedType('human')}
            className={`
              p-8 rounded-2xl border-3 transition-all duration-300 text-left
              ${selectedType === 'human'
                ? 'border-primary bg-primary/5 shadow-xl scale-105'
                : 'border-gray-200 bg-white hover:border-primary/50 hover:shadow-lg'
              }
            `}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`
                w-20 h-20 rounded-full flex items-center justify-center transition-colors
                ${selectedType === 'human' ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}
              `}>
                <User className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-dark mb-2">
                  Placa para Humanos
                </h3>
                <p className="text-gray-600">
                  For seniors, children, athletes, patients.
                </p>
              </div>

              {selectedType === 'human' && (
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Features */}
            <ul className="mt-6 space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Contactos de emergencia</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Información médica y seguro</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Ubicación de accidente</span>
              </li>
            </ul>
          </button>

          {/* Pet Plate */}
          <button
            onClick={() => setSelectedType('pet')}
            className={`
              p-8 rounded-2xl border-3 transition-all duration-300 text-left
              ${selectedType === 'pet'
                ? 'border-secondary bg-secondary/5 shadow-xl scale-105'
                : 'border-gray-200 bg-white hover:border-secondary/50 hover:shadow-lg'
              }
            `}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`
                w-20 h-20 rounded-full flex items-center justify-center transition-colors
                ${selectedType === 'pet' ? 'bg-secondary text-white' : 'bg-secondary/10 text-secondary'}
              `}>
                <PawPrint className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-dark mb-2">
                  Placa para Mascotas / Pertenencias
                </h3>
                <p className="text-gray-600">
                  For dogs, cats, luggage or valuable objects.
                </p>
              </div>

              {selectedType === 'pet' && (
                <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Features */}
            <ul className="mt-6 space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Identificación rápida</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Datos veterinarios</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Contacto del dueño</span>
              </li>
            </ul>
          </button>
        </div>

        {/* Continue Button */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleContinue}
            disabled={!selectedType || loading}
          >
            {loading ? 'Activando placa...' : 'CONTINUAR →'}
          </Button>
          
          {!selectedType && (
            <p className="text-center text-sm text-gray-500 mt-3">
              Selecciona un tipo de placa para continuar
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlateTypeSelectionPage;