import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Keyboard, ArrowLeft, Shield, CheckCircle, AlertCircle } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
import { validatePlate } from '../services/plateService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const PlateActivationPage = () => {
  const navigate = useNavigate();
  // const { user } = useAuth();
  const [method, setMethod] = useState(null); // 'scan' or 'manual'
  const [plateId, setPlateId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMethodSelect = (selectedMethod) => {
    setMethod(selectedMethod);
    setError('');
  };

  const handleScanQR = () => {
    // Por ahora, simulamos el escaneo
    // En producción, aquí usarías html5-qrcode
    const mockPlateId = prompt('Ingresa el código QR (simulación):');
    if (mockPlateId) {
      setPlateId(mockPlateId.toUpperCase());
      setMethod('manual');
    }
    
    /* Implementación real con html5-qrcode:
    
    import { Html5Qrcode } from 'html5-qrcode';
    
    const html5QrCode = new Html5Qrcode("qr-reader");
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      // decodedText contiene el URL: https://linkmeid.com/scan?id=BKASPG
      const url = new URL(decodedText);
      const plateId = url.searchParams.get('id');
      if (plateId) {
        setPlateId(plateId);
        setMethod('manual');
        html5QrCode.stop();
      }
    };
    
    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      qrCodeSuccessCallback
    );
    */
  };

  const validatePlateId = (id) => {
    // Validar formato: 6 caracteres alfanuméricos
    const regex = /^[A-Z0-9]{6}$/;
    return regex.test(id.toUpperCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!plateId) {
      setError('Por favor ingresa el ID de tu placa');
      return;
    }

    if (!validatePlateId(plateId)) {
      setError('ID de placa inválido. Debe tener 6 caracteres alfanuméricos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Validar la placa con el backend
      const response = await validatePlate(plateId);
      
      if (response.success) {
        // Guardar plateId validado temporalmente
        localStorage.setItem('pendingPlateId', plateId.toUpperCase());
        localStorage.setItem('pendingPlateDbId', response.plate.id);
        
        // Redirigir a selección de tipo
        navigate('/plate/select-type');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al validar la placa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Panel
          </button>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-3xl font-bold text-dark mb-2">
            Activar tu Nueva Placa LinkMeID
          </h1>
          <p className="text-gray-600">
            ¿Tienes una nueva placa? ¡Vamos a vincularla a tu perfil!
          </p>
        </div>

        {/* Selection or Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!method ? (
            // Method Selection
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center text-dark mb-6">
                ¿Cómo quieres activar tu placa?
              </h2>

              {/* Scan QR Option */}
              <button
                onClick={handleScanQR}
                className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <QrCode className="w-8 h-8 text-primary group-hover:text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-lg text-dark mb-1">
                      Escanear QR con Cámara
                    </h3>
                    <p className="text-sm text-gray-600">
                      Abre la cámara para leer el QR de tu placa física
                    </p>
                  </div>
                </div>
              </button>

              <div className="text-center text-gray-500 font-semibold">O</div>

              {/* Manual Entry Option */}
              <button
                onClick={() => handleMethodSelect('manual')}
                className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-secondary hover:bg-secondary/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                    <Keyboard className="w-8 h-8 text-secondary group-hover:text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-lg text-dark mb-1">
                      Ingresar ID Manualmente
                    </h3>
                    <p className="text-sm text-gray-600">
                      Busca el código impreso junto al QR (Ej: BKASPG)
                    </p>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            // Manual Entry Form
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-dark mb-4">
                  Ingresa el ID de tu Placa
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Busca el código de 6 caracteres impreso en tu placa física (Ejemplo: BKASPG)
                </p>

                <Input
                  label="ID de Placa"
                  type="text"
                  name="plateId"
                  value={plateId}
                  onChange={(e) => {
                    setPlateId(e.target.value.toUpperCase());
                    setError('');
                  }}
                  placeholder="BKASPG"
                  maxLength="6"
                  error={error}
                  required
                  className="text-center text-2xl font-bold tracking-widest"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => setMethod(null)}
                >
                  Atrás
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? 'Validando...' : 'CONTINUAR'}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-dark mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            ¿Dónde encuentro el ID de mi placa?
          </h3>
          <ul className="text-sm text-gray-700 space-y-2 ml-7">
            <li>• Está impreso debajo o al lado del código QR</li>
            <li>• Son 6 caracteres: letras mayúsculas y/o números</li>
            <li>• Ejemplo: BKASPG, A1B2C3, XYZ789</li>
          </ul>
        </div>

        {/* Available Plates Info */}
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-700">
            <strong>💡 Nota:</strong> Solo puedes activar placas que hayas comprado oficialmente. 
            Si no tienes una placa, <a href="#" className="underline font-semibold">cómprala aquí</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlateActivationPage;