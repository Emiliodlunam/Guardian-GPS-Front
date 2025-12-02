import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, Phone, Mail, MapPin, AlertCircle, User, PawPrint, Heart, Pill, AlertTriangle } from 'lucide-react';
import { getPublicPlateInfo } from '../services/plateService';
import Button from '../components/common/Button';

const PublicScanPage = () => {
  const { plateId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPublicProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plateId]);

  const loadPublicProfile = async () => {
    try {
      setLoading(true);
      const response = await getPublicPlateInfo(plateId);
      
      if (response.success) {
        setProfile(response.profile);
      }
    } catch (err) {
      // Log the error for debugging and provide a fallback message to the user
      console.error(err);
      setError(err?.message || 'Placa no encontrada o no activa');
    } finally {
      setLoading(false);
    }
  };

  const handleContactOwner = () => {
    if (profile.emergencyEmail) {
      window.location.href = `mailto:${profile.emergencyEmail}?subject=Encontré tu placa Guardian GPS (${plateId})`;
    } else if (profile.emergencyPhone1) {
      window.location.href = `tel:${profile.emergencyPhone1}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark mb-2">Placa No Encontrada</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const isLost = profile?.isLost;
  const isHuman = profile?.type === 'human';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">
              <span className="text-dark">Guardian</span>
              <span className="text-primary"> GPS</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Alerta de Perdido */}
        {isLost && (
          <div className="bg-red-500 text-white rounded-xl p-6 mb-6 shadow-xl animate-pulse">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-8 h-8" />
              <h2 className="text-2xl font-bold">¡ESTOY PERDIDO!</h2>
            </div>
            <p className="text-lg">
              Por favor ayuda a {profile.fullName} a regresar a casa. 
              Contacta al dueño inmediatamente.
            </p>
          </div>
        )}

        {/* Perfil Principal */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
          <div className="flex flex-col items-center text-center mb-6">
            {/* Foto */}
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
              {profile.photo ? (
                <img src={profile.photo} alt={profile.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white">
                  {isHuman ? <User className="w-16 h-16" /> : <PawPrint className="w-16 h-16" />}
                </div>
              )}
            </div>

            {/* Badge */}
            <span className={`px-4 py-2 rounded-full text-sm font-semibold mb-3 ${
              isHuman ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
            }`}>
              {isHuman ? '👤 Persona' : '🐾 Mascota'}
            </span>

            {/* Nombre */}
            <h2 className="text-3xl font-bold text-dark mb-2">{profile.fullName}</h2>
            
            <p className="text-gray-600 mb-4">
              ID: <span className="font-mono font-semibold">{plateId}</span>
            </p>

            {/* Botón de Contacto */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleContactOwner}
              className="shadow-lg"
            >
              <Phone className="w-5 h-5" />
              Contactar al Propietario
            </Button>
          </div>

          {/* Información de Contacto */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-xl font-bold text-dark mb-4">Información de Contacto</h3>

            {profile.emergencyName && (
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="font-semibold text-dark">{profile.emergencyName}</p>
                  <p className="text-sm text-gray-600">Contacto de Emergencia</p>
                </div>
              </div>
            )}

            {(isLost || profile.showPhone) && profile.emergencyPhone1 && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <a href={`tel:${profile.emergencyPhone1}`} className="text-lg font-semibold text-primary hover:underline">
                  {profile.emergencyPhone1}
                </a>
              </div>
            )}

            {(isLost || profile.showEmail) && profile.emergencyEmail && (
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <a href={`mailto:${profile.emergencyEmail}`} className="text-primary hover:underline">
                  {profile.emergencyEmail}
                </a>
              </div>
            )}

            {(isLost || profile.showAddress) && profile.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-dark">{profile.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Información Médica (solo si es humano y está en modo perdido o visible) */}
        {isHuman && (isLost || profile.showMedicalInfo) && (
          <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
            <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              Información Médica
            </h3>

            <div className="space-y-4">
              {/* Alergias - SIEMPRE VISIBLE en modo perdido */}
              {profile.allergies && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-700 mb-1">⚠️ ALERGIAS (CRÍTICO)</h4>
                      <p className="text-red-600">{profile.allergies}</p>
                    </div>
                  </div>
                </div>
              )}

              {profile.chronicDiseases && (
                <div>
                  <h4 className="font-semibold text-dark mb-1 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-purple-500" />
                    Enfermedades Crónicas
                  </h4>
                  <p className="text-gray-700">{profile.chronicDiseases}</p>
                </div>
              )}

              {profile.medications && (
                <div>
                  <h4 className="font-semibold text-dark mb-1 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-blue-500" />
                    Medicamentos
                  </h4>
                  <p className="text-gray-700">{profile.medications}</p>
                </div>
              )}

              {profile.bloodType && (
                <div>
                  <h4 className="font-semibold text-dark mb-1">Tipo de Sangre</h4>
                  <p className="text-2xl font-bold text-primary">{profile.bloodType}</p>
                </div>
              )}

              {profile.socialSecurityNumber && (
                <div>
                  <h4 className="font-semibold text-dark mb-1">Número de Seguro Social (NSS)</h4>
                  <p className="text-lg font-mono text-gray-700">{profile.socialSecurityNumber}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Información Adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h4 className="font-semibold text-dark mb-2">¿Encontraste esta placa?</h4>
          <p className="text-gray-700 mb-4">
            Gracias por escanear esta placa Guardian GPS. El propietario ha sido notificado automáticamente.
          </p>
          <p className="text-sm text-gray-600">
            Si esta es una emergencia, por favor contacta al propietario inmediatamente usando la información proporcionada arriba.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Protegido por <span className="font-semibold text-primary">Guardian GPS</span>
          </p>
          <p className="text-xs mt-2">
            Tu seguridad, a un escaneo de distancia
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicScanPage;