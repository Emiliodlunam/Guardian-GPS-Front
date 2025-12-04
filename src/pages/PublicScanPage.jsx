import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, Phone, Mail, MapPin, AlertCircle, User, PawPrint, Heart, Pill, AlertTriangle, Building, Stethoscope, FileText } from 'lucide-react';
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
      } else {
        setError('No se pudo cargar la información.');
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Placa no encontrada o no activa');
    } finally {
      setLoading(false);
    }
  };

  const handleContactOwner = () => {
    if (profile?.emergencyPhone1) {
      window.location.href = `tel:${profile.emergencyPhone1}`;
    } else if (profile?.emergencyEmail) {
      window.location.href = `mailto:${profile.emergencyEmail}`;
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

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark mb-2">Placa No Disponible</h2>
          <p className="text-gray-600">{error || 'La información no está disponible en este momento.'}</p>
        </div>
      </div>
    );
  }

  const isLost = profile.isLost;
  const isHuman = profile.type === 'human';

  // Privacidad
  const showPhone = isLost || profile.showPhone;
  const showEmail = isLost || profile.showEmail;
  const showAddress = isLost || profile.showAddress;
  const showMedicalInfo = isLost || profile.showMedicalInfo;

  // Determinar visibilidad de bloques de contacto
  const hasVisibleContact1 = (showPhone && (profile.emergencyPhone1 || profile.emergencyPhone1Alt)) || (showEmail && profile.emergencyEmail);
  const hasVisibleContact2 = profile.emergencyContact2Name && ((showPhone && (profile.emergencyPhone2 || profile.emergencyPhone2Alt)) || (showEmail && profile.emergencyEmail2));

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-center items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold text-dark">
            Guardian<span className="text-primary">GPS</span>
          </h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
        
        {isLost && (
          <div className="bg-red-600 text-white rounded-xl p-6 mb-8 shadow-xl animate-pulse flex flex-col items-center text-center">
            <AlertCircle className="w-12 h-12 mb-2" />
            <h2 className="text-3xl font-bold mb-2">¡ESTOY PERDIDO!</h2>
            <p className="text-lg opacity-90">
              Por favor ayuda a contactar a mi familia inmediatamente.
            </p>
          </div>
        )}

        {/* 1. Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border-t-4 border-primary">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                {profile.photo ? (
                  <img src={profile.photo} alt={profile.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white">
                    {isHuman ? <User className="w-20 h-20" /> : <PawPrint className="w-20 h-20" />}
                  </div>
                )}
              </div>
              <span className={`absolute bottom-2 right-2 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${isHuman ? 'bg-blue-500' : 'bg-amber-500'}`}>
                {isHuman ? 'HUMANO' : 'MASCOTA'}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-dark mb-1">{profile.fullName}</h1>
            {profile.breed && <p className="text-gray-600 font-medium mb-1">{profile.breed}</p>}
            {isHuman && profile.dateOfBirth && <p className="text-sm text-gray-500 mb-1">Nacimiento: {new Date(profile.dateOfBirth).toLocaleDateString('es-MX')}</p>}
            
            {(isLost || showPhone) && profile.emergencyPhone1 && (
              <div className="mt-4 flex gap-3 w-full max-w-xs">
                <Button variant="primary" size="lg" fullWidth onClick={handleContactOwner} className="shadow-lg animate-bounce-subtle">
                  <Phone className="w-5 h-5 mr-2" /> Llamar Ahora
                </Button>
              </div>
            )}
            {profile.about && <div className="mt-6 p-4 bg-gray-50 rounded-lg w-full text-left border-l-4 border-gray-300"><h3 className="text-sm font-bold text-gray-700 mb-1">Información Adicional:</h3><p className="text-gray-600 italic">"{profile.about}"</p></div>}
          </div>
        </div>

        {/* 2. Contactos */}
        {(hasVisibleContact1 || hasVisibleContact2) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2 border-b pb-2">
              <Phone className="w-6 h-6 text-primary" /> Contactos de Emergencia
            </h2>

            <div className="space-y-6">
              {/* Contacto 1 */}
              {hasVisibleContact1 && (
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" /> Contacto Principal
                  </h3>
                  <div className="space-y-3">
                    <p className="text-lg font-semibold text-dark">{profile.emergencyName}</p>
                    {showPhone && profile.emergencyPhone1 && <a href={`tel:${profile.emergencyPhone1}`} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md text-dark"><div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600"><Phone className="w-4 h-4" /></div><div className="flex-1"><p className="text-xs text-gray-500 font-semibold uppercase">Teléfono</p><p className="font-mono text-lg">{profile.emergencyPhone1}</p></div></a>}
                    {showPhone && profile.emergencyPhone1Alt && <a href={`tel:${profile.emergencyPhone1Alt}`} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md text-dark"><div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600"><Phone className="w-4 h-4" /></div><div className="flex-1"><p className="text-xs text-gray-500 font-semibold uppercase">Teléfono Alt.</p><p className="font-mono">{profile.emergencyPhone1Alt}</p></div></a>}
                    {showEmail && profile.emergencyEmail && <a href={`mailto:${profile.emergencyEmail}`} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md text-dark"><div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><Mail className="w-4 h-4" /></div><div className="flex-1"><p className="text-xs text-gray-500 font-semibold uppercase">Correo</p><p className="break-all">{profile.emergencyEmail}</p></div></a>}
                  </div>
                </div>
              )}

              {/* Contacto 2 */}
              {hasVisibleContact2 && (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" /> Contacto Secundario
                  </h3>
                  <div className="space-y-3">
                    <p className="text-lg font-semibold text-dark">{profile.emergencyContact2Name}</p>
                    {showPhone && profile.emergencyPhone2 && <a href={`tel:${profile.emergencyPhone2}`} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md text-dark"><div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600"><Phone className="w-4 h-4" /></div><div className="flex-1"><p className="text-xs text-gray-500 font-semibold uppercase">Teléfono</p><p className="font-mono text-lg">{profile.emergencyPhone2}</p></div></a>}
                    {showPhone && profile.emergencyPhone2Alt && <a href={`tel:${profile.emergencyPhone2Alt}`} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md text-dark"><div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600"><Phone className="w-4 h-4" /></div><div className="flex-1"><p className="text-xs text-gray-500 font-semibold uppercase">Teléfono Alt.</p><p className="font-mono">{profile.emergencyPhone2Alt}</p></div></a>}
                    {showEmail && profile.emergencyEmail2 && <a href={`mailto:${profile.emergencyEmail2}`} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md text-dark"><div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><Mail className="w-4 h-4" /></div><div className="flex-1"><p className="text-xs text-gray-500 font-semibold uppercase">Correo</p><p className="break-all">{profile.emergencyEmail2}</p></div></a>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Información Médica */}
        {isHuman && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2 border-b pb-2"><Heart className="w-6 h-6 text-red-500" /> Información Médica</h2>
            {!showMedicalInfo && !isLost && !profile.allergies && <p className="text-gray-500 italic text-center py-4 bg-gray-50 rounded-lg"><Shield className="w-4 h-4 inline mr-2" /> Información médica privada.</p>}
            
            <div className="space-y-4">
              {profile.allergies && <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm"><div className="flex items-start gap-3"><AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" /><div><h4 className="font-bold text-red-700 uppercase text-sm mb-1">Alergias (Crítico)</h4><p className="text-red-900 text-lg font-medium">{profile.allergies}</p></div></div></div>}
              
              {(isLost || showMedicalInfo) && (
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Seguridad Social (NUEVO) */}
                  {(profile.insuranceInstitution || profile.socialSecurityNumber) && (
                    <div className="p-4 bg-green-50 rounded-xl border border-green-100 md:col-span-2">
                      <h4 className="text-xs font-bold text-green-700 uppercase mb-2 flex items-center gap-1"><FileText className="w-3 h-3" /> Seguridad Social</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-xs text-gray-500">Institución</p><p className="font-bold text-dark text-lg">{profile.insuranceInstitution || 'N/A'}</p></div>
                        <div><p className="text-xs text-gray-500">NSS / Afiliación</p><p className="font-mono text-dark text-lg">{profile.socialSecurityNumber || 'No registrado'}</p></div>
                        {profile.preferredHospital && <div className="col-span-2 mt-2 pt-2 border-t border-green-200"><p className="text-xs text-gray-500">Hospital de Preferencia</p><p className="font-medium text-dark">{profile.preferredHospital}</p></div>}
                      </div>
                    </div>
                  )}

                  {profile.bloodType && <div className="p-4 bg-gray-50 rounded-xl"><h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Tipo de Sangre</h4><p className="text-2xl font-bold text-primary">{profile.bloodType}</p></div>}
                  {profile.chronicDiseases && <div className="p-4 bg-gray-50 rounded-xl"><h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1"><Stethoscope className="w-3 h-3" /> Padecimientos</h4><p className="text-dark font-medium">{profile.chronicDiseases}</p></div>}
                  {profile.medications && <div className="p-4 bg-gray-50 rounded-xl md:col-span-2"><h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1"><Pill className="w-3 h-3" /> Medicamentos</h4><p className="text-dark font-medium">{profile.medications}</p></div>}
                  
                  {/* Seguro Privado */}
                  {profile.insuranceCompany && (
                    <div className="p-4 bg-blue-50/50 rounded-xl md:col-span-2 border border-blue-100">
                      <h4 className="text-xs font-bold text-blue-700 uppercase mb-3 flex items-center gap-1"><Building className="w-3 h-3" /> Seguro Privado</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><p className="text-xs text-gray-500">Aseguradora</p><p className="font-semibold text-dark">{profile.insuranceCompany}</p></div>
                        {profile.policyNumber && <div><p className="text-xs text-gray-500">Póliza</p><p className="font-mono text-dark">{profile.policyNumber}</p></div>}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. Dirección */}
        {(isLost || showAddress) && profile.address && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2 border-b pb-2"><MapPin className="w-6 h-6 text-primary" /> Dirección</h2>
            <div className="p-4 bg-gray-50 rounded-xl"><p className="text-lg text-dark mb-1">{profile.address}</p>{profile.postalCode && <p className="text-sm text-gray-600 font-medium">C.P. {profile.postalCode}</p>}{profile.neighborhood && <p className="text-sm text-gray-600">{profile.neighborhood}</p>}</div>
          </div>
        )}

        <div className="text-center mt-12 mb-8"><div className="inline-block bg-gray-100 rounded-full px-4 py-1 text-xs font-mono text-gray-500 mb-2">ID: {plateId}</div><p className="text-sm text-gray-400">© 2025 Guardian GPS System</p></div>
      </div>
    </div>
  );
};

export default PublicScanPage;