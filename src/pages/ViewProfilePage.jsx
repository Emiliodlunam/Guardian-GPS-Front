import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Shield, User, PawPrint, Phone, Mail, MapPin, Heart, Pill, AlertTriangle, Building } from 'lucide-react';
import QRGenerator from '../components/common/QRGenerator';
import { getProfileByPlateId } from '../services/profileService'; // Usamos la función específica
import Button from '../components/common/Button';

const ViewProfilePage = () => {
  const navigate = useNavigate();
  const { plateId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plateId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // El backend devuelve { success: true, data: { ... } }
      const response = await getProfileByPlateId(plateId);
      
      if (response.success) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      // Si falla, probablemente no existe perfil, redirigir al dashboard
      // navigate('/dashboard'); 
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl font-bold mb-4">No se encontró el perfil</p>
        <Button onClick={() => navigate('/dashboard')}>Volver al Dashboard</Button>
      </div>
    </div>
  );

  // Corrección: Leer directamente del objeto profile aplanado
  const isHuman = profile.plateType === 'human';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Simple */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-primary hover:text-primary-dark"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al Dashboard
            </button>
            
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <span className="text-lg font-bold">
                <span className="text-dark">Guardian</span>
                <span className="text-primary"> GPS</span>
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header con Foto */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Foto */}
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt={profile.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white">
                  {isHuman ? <User className="w-16 h-16" /> : <PawPrint className="w-16 h-16" />}
                </div>
              )}
            </div>

            {/* Info Principal */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  isHuman ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                }`}>
                  {isHuman ? '👤 Humano' : '🐾 Mascota'}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-dark mb-2">{profile.fullName}</h1>
              
              <div className="flex items-center gap-4 text-gray-600 justify-center md:justify-start">
                <span>Fecha de Nacimiento: {new Date(profile.dateOfBirth).toLocaleDateString('es-MX')}</span>
                {profile.breed && <span>• Raza: {profile.breed}</span>}
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  {/* Corrección: usar plateCode */}
                  ID de Placa: <span className="font-mono font-semibold">{profile.plateCode}</span>
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={() => navigate(`/profile/${plateId}/edit`)}
            >
              <Edit className="w-5 h-5 mr-2" />
              Editar Perfil
            </Button>
          </div>

          {/* Acerca de */}
          {profile.about && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-dark mb-2">Acerca de:</h3>
              <p className="text-gray-700">{profile.about}</p>
            </div>
          )}
        </div>

        {/* Contactos de Emergencia */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-2">
            <Phone className="w-6 h-6 text-primary" />
            Contactos de Emergencia
          </h2>

          {/* Contacto 1 */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-dark mb-3">Contacto Principal</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                <span>{profile.emergencyContact1Name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <a href={`mailto:${profile.emergencyContact1Email}`} className="text-primary hover:underline">
                  {profile.emergencyContact1Email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-500" />
                <a href={`tel:${profile.emergencyContact1Phone}`} className="text-primary hover:underline">
                  {profile.emergencyContact1Phone}
                </a>
              </div>
              {profile.emergencyContact1PhoneAlt && (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <a href={`tel:${profile.emergencyContact1PhoneAlt}`} className="text-primary hover:underline">
                    {profile.emergencyContact1PhoneAlt}
                  </a>
                  <span className="text-xs text-gray-500">(Alternativo)</span>
                </div>
              )}
            </div>
          </div>

          {/* Contacto 2 */}
          {profile.emergencyContact2Name && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-dark mb-3">Contacto Secundario</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span>{profile.emergencyContact2Name}</span>
                </div>
                {profile.emergencyContact2Email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <a href={`mailto:${profile.emergencyContact2Email}`} className="text-primary hover:underline">
                      {profile.emergencyContact2Email}
                    </a>
                  </div>
                )}
                {profile.emergencyContact2Phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <a href={`tel:${profile.emergencyContact2Phone}`} className="text-primary hover:underline">
                      {profile.emergencyContact2Phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Información Médica (solo humanos) */}
        {isHuman && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              Información Médica
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {profile.chronicDiseases && (
                <div>
                  <h3 className="font-semibold text-dark mb-2 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-purple-500" />
                    Enfermedades Crónicas
                  </h3>
                  <p className="text-gray-700">{profile.chronicDiseases}</p>
                </div>
              )}

              {profile.medications && (
                <div>
                  <h3 className="font-semibold text-dark mb-2 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-blue-500" />
                    Medicamentos
                  </h3>
                  <p className="text-gray-700">{profile.medications}</p>
                </div>
              )}

              {profile.allergies && (
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-dark mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Alergias (CRÍTICO)
                  </h3>
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-red-700 font-semibold">{profile.allergies}</p>
                  </div>
                </div>
              )}

              {profile.bloodType && (
                <div>
                  <h3 className="font-semibold text-dark mb-2">Tipo de Sangre</h3>
                  <p className="text-2xl font-bold text-primary">{profile.bloodType}</p>
                </div>
              )}

              {profile.socialSecurityNumber && (
                <div>
                  <h3 className="font-semibold text-dark mb-2">Número de Seguro Social</h3>
                  <p className="text-lg font-mono text-gray-700">{profile.socialSecurityNumber}</p>
                </div>
              )}

              {profile.insuranceCompany && (
                <div>
                  <h3 className="font-semibold text-dark mb-2 flex items-center gap-2">
                    <Building className="w-5 h-5 text-green-500" />
                    Seguro Médico
                  </h3>
                  <p className="text-gray-700">{profile.insuranceCompany}</p>
                  {profile.policyNumber && (
                    <p className="text-sm text-gray-600">Póliza: {profile.policyNumber}</p>
                  )}
                  {profile.memberNumber && (
                    <p className="text-sm text-gray-600">Miembro: {profile.memberNumber}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dirección */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-green-500" />
            Dirección del Domicilio
          </h2>

          <div className="space-y-2">
            <p className="text-gray-700 text-lg">{profile.street}</p>
            {profile.neighborhood && <p className="text-gray-600">{profile.neighborhood}</p>}
            <p className="text-gray-600">
              {profile.city}, {profile.state}
            </p>
            <p className="text-gray-600">{profile.country}</p>
          </div>
        </div>

        {/* Configuración de Privacidad */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-dark mb-3">🔒 Configuración de Privacidad</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className={profile.showPhone ? 'text-green-600' : 'text-red-600'}>
                {profile.showPhone ? '✓ Visible' : '✗ Oculto'}
              </span>
              <span className="text-gray-700">Teléfono</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={profile.showEmail ? 'text-green-600' : 'text-red-600'}>
                {profile.showEmail ? '✓ Visible' : '✗ Oculto'}
              </span>
              <span className="text-gray-700">Correo Electrónico</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={profile.showAddress ? 'text-green-600' : 'text-red-600'}>
                {profile.showAddress ? '✓ Visible' : '✗ Oculto'}
              </span>
              <span className="text-gray-700">Dirección</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={profile.showMedicalInfo ? 'text-green-600' : 'text-red-600'}>
                {profile.showMedicalInfo ? '✓ Visible' : '✗ Oculto'}
              </span>
              <span className="text-gray-700">Info Médica</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            * En modo "Perdido", toda la información será visible automáticamente
          </p>
        </div>
          <QRGenerator 
            plateId={plateId}
            plateCode={profile.plateCode}
            fullName={profile.fullName}
          />
      </div>
    </div>
  );
};

export default ViewProfilePage;