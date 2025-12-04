import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Shield, Save, User, PawPrint, Building, MapPin } from 'lucide-react';
import { getProfileByPlateId, updateProfile } from '../services/profileService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import PhotoUpload from '../components/common/PhotoUpload';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { plateId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [plateType, setPlateType] = useState('');

  const [formData, setFormData] = useState({
    photo: '',
    fullName: '',
    dateOfBirth: '',
    emergencyContact1Name: '',
    emergencyContact1Email: '',
    emergencyContact1Phone: '',
    emergencyContact1PhoneAlt: '',
    emergencyContact2Name: '',
    emergencyContact2Email: '',
    emergencyContact2Phone: '',
    emergencyContact2PhoneAlt: '',
    chronicDiseases: '',
    medications: '',
    allergies: '',
    socialSecurityNumber: '',
    insuranceInstitution: '', // NUEVO
    preferredHospital: '',    // NUEVO
    insuranceCompany: '',
    policyNumber: '',
    memberNumber: '',
    bloodType: '',
    street: '',
    neighborhood: '',
    state: '',
    city: '',
    postalCode: '',
    country: 'México',
    about: '',
    showPhone: true,
    showEmail: true,
    showAddress: true,
    showMedicalInfo: true,
  });

  const [errors, setErrors] = useState({});

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const institutions = ['IMSS', 'ISSSTE', 'INSABI', 'PEMEX', 'SEDENA', 'SEMAR', 'Privado', 'Otro'];
  
  const mexicanStates = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
    'Chiapas', 'Chihuahua', 'Coahuila', 'Colima', 'Durango', 'Guanajuato',
    'Guerrero', 'Hidalgo', 'Jalisco', 'México', 'Michoacán', 'Morelos',
    'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo',
    'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala',
    'Veracruz', 'Yucatán', 'Zacatecas', 'Ciudad de México'
  ];

  useEffect(() => {
    loadProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plateId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfileByPlateId(plateId);
      const profile = response.data;

      setPlateType(profile.plateType);

      setFormData({
        photo: profile.photoUrl || '',
        fullName: profile.fullName || '',
        dateOfBirth: profile.dateOfBirth || '',
        emergencyContact1Name: profile.emergencyContact1Name || '',
        emergencyContact1Email: profile.emergencyContact1Email || '',
        emergencyContact1Phone: profile.emergencyContact1Phone || '',
        emergencyContact1PhoneAlt: profile.emergencyContact1PhoneAlt || '',
        emergencyContact2Name: profile.emergencyContact2Name || '',
        emergencyContact2Email: profile.emergencyContact2Email || '',
        emergencyContact2Phone: profile.emergencyContact2Phone || '',
        emergencyContact2PhoneAlt: profile.emergencyContact2PhoneAlt || '',
        chronicDiseases: profile.chronicDiseases || '',
        medications: profile.medications || '',
        allergies: profile.allergies || '',
        socialSecurityNumber: profile.socialSecurityNumber || '',
        insuranceInstitution: profile.insuranceInstitution || '',
        preferredHospital: profile.preferredHospital || '',
        insuranceCompany: profile.insuranceCompany || '',
        policyNumber: profile.policyNumber || '',
        memberNumber: profile.memberNumber || '',
        bloodType: profile.bloodType || '',
        street: profile.street || '',
        neighborhood: profile.neighborhood || '',
        state: profile.state || '',
        city: profile.city || '',
        postalCode: profile.postalCode || '',
        country: profile.country || 'México',
        about: profile.about || '',
        showPhone: profile.showPhone !== false,
        showEmail: profile.showEmail !== false,
        showAddress: profile.showAddress !== false,
        showMedicalInfo: profile.showMedicalInfo !== false,
      });

      setLoading(false);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Error al cargar el perfil');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'El nombre es requerido';
    if (!formData.emergencyContact1Name.trim()) newErrors.emergencyContact1Name = 'El contacto 1 es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setError('Por favor corrige los errores');
      return;
    }
    try {
      setSaving(true);
      setError('');
      await updateProfile(plateId, formData);
      setSuccess('¡Perfil actualizado correctamente!');
      setTimeout(() => navigate(`/profile/${plateId}`), 2000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || err.message || 'Error al actualizar');
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Cargando...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <button onClick={() => navigate(`/profile/${plateId}`)} className="text-primary hover:text-primary-dark mb-4 inline-flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Volver
          </button>
          <h1 className="text-3xl font-bold text-dark">Editar Perfil</h1>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">{error}</div>}
        {success && <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-2 mb-6">
              {plateType === 'human' ? <User className="w-6 h-6 text-primary"/> : <PawPrint className="w-6 h-6 text-primary"/>}
              <h2 className="text-xl font-bold text-dark">Información Básica</h2>
            </div>
            <PhotoUpload value={formData.photo} onChange={(url) => setFormData(p => ({...p, photo: url}))} label="Foto" />
            <div className="space-y-4 mt-6">
              <Input label="Nombre Completo" name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} required />
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de Nacimiento</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
              <Input label="Acerca de" name="about" value={formData.about} onChange={handleChange} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-dark mb-6">Contactos de Emergencia</h2>
            <div className="space-y-4">
              <h3 className="font-semibold">Contacto #1</h3>
              <Input label="Nombre" name="emergencyContact1Name" value={formData.emergencyContact1Name} onChange={handleChange} required />
              <Input label="Email" name="emergencyContact1Email" value={formData.emergencyContact1Email} onChange={handleChange} />
              <Input label="Teléfono" name="emergencyContact1Phone" value={formData.emergencyContact1Phone} onChange={handleChange} />
              <Input label="Teléfono Alt." name="emergencyContact1PhoneAlt" value={formData.emergencyContact1PhoneAlt} onChange={handleChange} />
              
              <h3 className="font-semibold mt-4">Contacto #2 (Opcional)</h3>
              <Input label="Nombre" name="emergencyContact2Name" value={formData.emergencyContact2Name} onChange={handleChange} />
              <Input label="Email" name="emergencyContact2Email" value={formData.emergencyContact2Email} onChange={handleChange} />
              <Input label="Teléfono" name="emergencyContact2Phone" value={formData.emergencyContact2Phone} onChange={handleChange} />
              <Input label="Teléfono Alt." name="emergencyContact2PhoneAlt" value={formData.emergencyContact2PhoneAlt} onChange={handleChange} />
            </div>
          </div>

          {plateType === 'human' && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-dark mb-6">Información Médica</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Sangre</label>
                  <select name="bloodType" value={formData.bloodType} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                    <option value="">Seleccionar...</option>
                    {bloodTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Institución (IMSS/ISSSTE)</label>
                    <select name="insuranceInstitution" value={formData.insuranceInstitution} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                      <option value="">Seleccionar...</option>
                      {institutions.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <Input label="NSS / Número de Afiliación" name="socialSecurityNumber" value={formData.socialSecurityNumber} onChange={handleChange} placeholder="Número de Seguridad Social" />
                </div>

                <Input label="Hospital de Preferencia" name="preferredHospital" value={formData.preferredHospital} onChange={handleChange} placeholder="Ej. Hospital General Zona 1" icon={Building} />

                <Input label="Alergias" name="allergies" value={formData.allergies} onChange={handleChange} />
                <Input label="Enfermedades" name="chronicDiseases" value={formData.chronicDiseases} onChange={handleChange} />
                <Input label="Medicamentos" name="medications" value={formData.medications} onChange={handleChange} />
                
                <h3 className="font-semibold text-gray-600 mt-4">Seguro Privado (Opcional)</h3>
                <Input label="Aseguradora" name="insuranceCompany" value={formData.insuranceCompany} onChange={handleChange} />
                <Input label="Póliza" name="policyNumber" value={formData.policyNumber} onChange={handleChange} />
                <Input label="Miembro" name="memberNumber" value={formData.memberNumber} onChange={handleChange} />
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-dark mb-6">Dirección</h2>
            <div className="space-y-4">
              <Input label="Calle y Número" name="street" value={formData.street} onChange={handleChange} />
              <Input label="Colonia" name="neighborhood" value={formData.neighborhood} onChange={handleChange} />
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                  <select name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                    <option value="">Seleccionar...</option>
                    {mexicanStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <Input label="Ciudad" name="city" value={formData.city} onChange={handleChange} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Código Postal" name="postalCode" value={formData.postalCode} onChange={handleChange} maxLength={5} />
                <Input label="País" name="country" value={formData.country} disabled />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-dark mb-6">Privacidad</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-2"><input type="checkbox" name="showPhone" checked={formData.showPhone} onChange={handleChange} /> Mostrar Teléfono</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="showEmail" checked={formData.showEmail} onChange={handleChange} /> Mostrar Email</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="showAddress" checked={formData.showAddress} onChange={handleChange} /> Mostrar Dirección</label>
              {plateType === 'human' && <label className="flex items-center gap-2"><input type="checkbox" name="showMedicalInfo" checked={formData.showMedicalInfo} onChange={handleChange} /> Mostrar Info Médica</label>}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(`/profile/${plateId}`)} disabled={saving} className="flex-1">Cancelar</Button>
            <Button type="submit" variant="primary" disabled={saving} className="flex-1">{saving ? 'Guardando...' : 'Guardar Cambios'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;