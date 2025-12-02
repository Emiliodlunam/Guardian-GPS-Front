import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { createProfile } from '../../services/profileService';
import Button from '../../components/common/Button';

const Step3Privacy = () => {
  const navigate = useNavigate();
  const [plateType, setPlateType] = useState('');
  const [loading, setLoading] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    showPhone: true,
    showEmail: false,
    showAddress: false,
    showMedicalInfo: false,
  });

  useEffect(() => {
    const type = localStorage.getItem('plateType');
    if (!type) {
      navigate('/plate/select-type');
      return;
    }
    setPlateType(type);

    // Verificar que completó los pasos anteriores
    const step1Data = localStorage.getItem('profileStep1');
    const step2Data = localStorage.getItem('profileStep2');
    if (!step1Data || !step2Data) {
      navigate('/plate/setup/step1');
      return;
    }

    // Cargar configuración guardada si existe
    const savedSettings = localStorage.getItem('privacySettings');
    if (savedSettings) {
      setPrivacySettings(JSON.parse(savedSettings));
    }
  }, [navigate]);

  const toggleSetting = (key) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleFinish = async () => {
    setLoading(true);

    try {
      // Guardar configuración de privacidad
      localStorage.setItem('privacySettings', JSON.stringify(privacySettings));

      // Recopilar todos los datos
      const plateId = localStorage.getItem('activePlateId');
      const step1Data = JSON.parse(localStorage.getItem('profileStep1'));
      const step2Data = JSON.parse(localStorage.getItem('profileStep2'));

      if (!plateId) {
        throw new Error('No se encontró ID de placa');
      }

      // Preparar datos para el backend
      const profileData = {
        plateId,
        // Información básica
        photo: step1Data.photo || null,
        fullName: step1Data.fullName,
        dateOfBirth: step1Data.dateOfBirth,
        breed: step1Data.breed || null,
        // Contacto de emergencia 1
        emergencyContact1Name: step2Data.emergencyContact1Name,
        emergencyContact1Email: step2Data.emergencyContact1Email,
        emergencyContact1Phone: step2Data.emergencyContact1Phone,
        emergencyContact1PhoneAlt: step2Data.emergencyContact1PhoneAlt || null,
        // Contacto de emergencia 2
        emergencyContact2Name: step2Data.emergencyContact2Name || null,
        emergencyContact2Email: step2Data.emergencyContact2Email || null,
        emergencyContact2Phone: step2Data.emergencyContact2Phone || null,
        // Información médica
        chronicDiseases: step2Data.chronicDiseases || null,
        medications: step2Data.medications || null,
        allergies: step2Data.allergies || null,
        socialSecurityNumber: step2Data.socialSecurityNumber || null,
        insuranceCompany: step2Data.insuranceCompany || null,
        policyNumber: step2Data.policyNumber || null,
        memberNumber: step2Data.memberNumber || null,
        bloodType: step2Data.bloodType || null,
        // Dirección
        street: step2Data.street,
        colony: step2Data.colony || null,
        state: step2Data.state,
        city: step2Data.city,
        country: step2Data.country || 'México',
        about: step2Data.about || null,
        // Configuración de privacidad
        showPhone: privacySettings.showPhone,
        showEmail: privacySettings.showEmail,
        showAddress: privacySettings.showAddress,
        showMedicalInfo: privacySettings.showMedicalInfo,
      };

      // Enviar al backend
      const response = await createProfile(profileData);

      if (response.success) {
        // Limpiar datos temporales
        localStorage.removeItem('activePlateId');
        localStorage.removeItem('plateType');
        localStorage.removeItem('profileStep1');
        localStorage.removeItem('profileStep2');
        localStorage.removeItem('privacySettings');

        // Redirigir al dashboard
        navigate('/dashboard', { 
          state: { message: '¡Perfil creado exitosamente! 🎉' } 
        });
      }
    } catch (error) {
      console.error('Error al crear perfil:', error);
      alert(error.message || 'Error al crear el perfil. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const PrivacyToggle = ({ label, description, isOn, onToggle, note }) => (
    <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          {isOn ? (
            <Eye className="w-5 h-5 text-green-500" />
          ) : (
            <EyeOff className="w-5 h-5 text-gray-400" />
          )}
          <h4 className="font-semibold text-dark">{label}</h4>
        </div>
        <p className="text-sm text-gray-600 ml-8">{description}</p>
        {note && (
          <p className="text-xs text-gray-500 italic ml-8 mt-1">{note}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`
          relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          ${isOn ? 'bg-primary' : 'bg-gray-300'}
        `}
      >
        <span
          className={`
            inline-block h-6 w-6 transform rounded-full bg-white transition-transform
            ${isOn ? 'translate-x-7' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/plate/setup/step2')}
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-3xl font-bold text-dark mb-2">
            Configuración del Perfil - Paso 3 de 3
          </h1>
          <p className="text-gray-600">
            Configuración de Privacidad
          </p>

          {/* Progress Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Paso 4 de 4</span>
              <span className="font-semibold text-primary">100%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all duration-300" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        {/* Privacy Settings Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-dark mb-2">
              Define qué datos son visible aalgouien escanas tu QR
            </h2>
            <p className="text-gray-600">
              Controla quién puede ver tu información cuando escanean tu placa
            </p>
          </div>

          {/* Visibility Settings */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-dark">Visbiilidad Pública</h3>
            </div>

            <PrivacyToggle
              label="Mostar Número de Teléfono"
              description="Tu número de teléfono será visible para quien escanee tu QR"
              isOn={privacySettings.showPhone}
              onToggle={() => toggleSetting('showPhone')}
            />

            <PrivacyToggle
              label="Mostar Número de Teléfono"
              description="Tu correo electrónico será visible"
              isOn={privacySettings.showEmail}
              onToggle={() => toggleSetting('showEmail')}
            />

            <PrivacyToggle
              label="Mostar Correo Élecríónico"
              description="Tu dirección completa será visible"
              isOn={privacySettings.showAddress}
              onToggle={() => toggleSetting('showAddress')}
            />

            <PrivacyToggle
              label="Mostar Dirección Completa"
              description="Información de seguro médico y tipo de sangre"
              isOn={privacySettings.showMedicalInfo}
              onToggle={() => toggleSetting('showMedicalInfo')}
              note={plateType === 'human' ? '*Nota: La información médica crítica (Alergis) siemures seré visible.' : null}
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-dark mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Información Importante
            </h4>
            <ul className="text-sm text-gray-700 space-y-1 ml-7">
              <li>• Puedes cambiar estas configuraciones en cualquier momento</li>
              <li>• En modo "¡ESTOY PERDIDO!" se mostrará más información automáticamente</li>
              <li>• La información médica crítica siempre estará visible en emergencias</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => navigate('/plate/setup/step2')}
              disabled={loading}
            >
              ← Atrás
            </Button>
            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleFinish}
              disabled={loading}
            >
              {loading ? (
                'Creando perfil...'
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  FINALIZR Y CREAR PERFIL
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Privacy Tip */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            🔒 Tu privacidad es nuestra prioridad. Todos los datos están encriptados y protegidos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step3Privacy;