import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Shield, Save, User, PawPrint } from 'lucide-react';
import { getProfile, updateProfile } from '../services/profileService';
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
    // Básica
    photo: '',
    fullName: '',
    dateOfBirth: '',
    
    // Contactos de Emergencia
    emergencyContact1Name: '',
    emergencyContact1Email: '',
    emergencyContact1Phone: '',
    emergencyContact1PhoneAlt: '',
    emergencyContact2Name: '',
    emergencyContact2Email: '',
    emergencyContact2Phone: '',
    emergencyContact2PhoneAlt: '',
    
    // Información Médica (solo humanos)
    chronicDiseases: '',
    medications: '',
    allergies: '',
    socialSecurityNumber: '',
    insuranceCompany: '',
    policyNumber: '',
    memberNumber: '',
    bloodType: '',
    
    // Dirección
    street: '',
    neighborhood: '',
    state: '',
    city: '',
    postalCode: '',
    country: 'México',
    
    // Privacidad
    showPhone: true,
    showEmail: true,
    showAddress: true,
    showMedicalInfo: true,
  });

  const [errors, setErrors] = useState({});

  // Tipos de sangre
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Estados de México
  const mexicanStates = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
    'Chiapas', 'Chihuahua', 'Coahuila', 'Colima', 'Durango', 'Guanajuato',
    'Guerrero', 'Hidalgo', 'Jalisco', 'México', 'Michoacán', 'Morelos',
    'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo',
    'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala',
    'Veracruz', 'Yucatán', 'Zacatecas', 'Ciudad de México'
  ];

  // Cargar perfil existente
  useEffect(() => {
    loadProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plateId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile(plateId);
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

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre es requerido';
    }

    if (!formData.emergencyContact1Name.trim()) {
      newErrors.emergencyContact1Name = 'El contacto de emergencia 1 es requerido';
    }

    if (formData.emergencyContact1Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emergencyContact1Email)) {
      newErrors.emergencyContact1Email = 'Email inválido';
    }

    if (formData.emergencyContact2Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emergencyContact2Email)) {
      newErrors.emergencyContact2Email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setError('Por favor corrige los errores en el formulario');
      return;
    }

    try {
      setSaving(true);
      setError('');

      await updateProfile(plateId, formData);

      setSuccess('¡Perfil actualizado correctamente!');
      
      setTimeout(() => {
        navigate(`/profile/${plateId}`);
      }, 2000);

    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate(`/profile/${plateId}`)}
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Volver al Perfil</span>
          </button>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-3xl font-bold text-dark mb-2">
            Editar Perfil
          </h1>
          <p className="text-gray-600">
            Actualiza la información de tu perfil {plateType === 'human' ? 'personal' : 'de mascota'}
          </p>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              {plateType === 'human' ? (
                <User className="w-6 h-6 text-primary" />
              ) : (
                <PawPrint className="w-6 h-6 text-primary" />
              )}
              <h2 className="text-xl font-bold text-dark">Información Básica</h2>
            </div>

            <div className="space-y-6">
              <PhotoUpload
                value={formData.photo}
                onChange={(photoUrl) => setFormData(prev => ({ ...prev, photo: photoUrl }))}
                label={plateType === 'human' ? 'Foto de Perfil' : 'Foto de Mascota'}
              />

              <Input
                label={plateType === 'human' ? 'Nombre Completo' : 'Nombre de Mascota'}
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                required
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Nacimiento {plateType === 'pet' && '(Aproximada)'}
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Contactos de Emergencia */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-dark mb-6">Contactos de Emergencia</h2>

            {/* Contacto 1 */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="font-semibold text-dark mb-4">Contacto de Emergencia #1</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Nombre Completo"
                  type="text"
                  name="emergencyContact1Name"
                  value={formData.emergencyContact1Name}
                  onChange={handleChange}
                  error={errors.emergencyContact1Name}
                  required
                />

                <Input
                  label="Correo Electrónico"
                  type="email"
                  name="emergencyContact1Email"
                  value={formData.emergencyContact1Email}
                  onChange={handleChange}
                  error={errors.emergencyContact1Email}
                />

                <Input
                  label="Teléfono Principal"
                  type="tel"
                  name="emergencyContact1Phone"
                  value={formData.emergencyContact1Phone}
                  onChange={handleChange}
                  placeholder="10 dígitos"
                />

                <Input
                  label="Teléfono Alternativo"
                  type="tel"
                  name="emergencyContact1PhoneAlt"
                  value={formData.emergencyContact1PhoneAlt}
                  onChange={handleChange}
                  placeholder="10 dígitos"
                />
              </div>
            </div>

            {/* Contacto 2 */}
            <div>
              <h3 className="font-semibold text-dark mb-4">Contacto de Emergencia #2 (Opcional)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Nombre Completo"
                  type="text"
                  name="emergencyContact2Name"
                  value={formData.emergencyContact2Name}
                  onChange={handleChange}
                />

                <Input
                  label="Correo Electrónico"
                  type="email"
                  name="emergencyContact2Email"
                  value={formData.emergencyContact2Email}
                  onChange={handleChange}
                  error={errors.emergencyContact2Email}
                />

                <Input
                  label="Teléfono Principal"
                  type="tel"
                  name="emergencyContact2Phone"
                  value={formData.emergencyContact2Phone}
                  onChange={handleChange}
                  placeholder="10 dígitos"
                />

                <Input
                  label="Teléfono Alternativo"
                  type="tel"
                  name="emergencyContact2PhoneAlt"
                  value={formData.emergencyContact2PhoneAlt}
                  onChange={handleChange}
                  placeholder="10 dígitos"
                />
              </div>
            </div>
          </div>

          {/* Información Médica (solo humanos) */}
          {plateType === 'human' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-dark mb-6">Información Médica</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de Sangre
                  </label>
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Seleccionar...</option>
                    {bloodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Número de Seguro Social (NSS)"
                  type="text"
                  name="socialSecurityNumber"
                  value={formData.socialSecurityNumber}
                  onChange={handleChange}
                  placeholder="11 dígitos"
                  maxLength={11}
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Alergias
                  </label>
                  <textarea
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Medicamentos, alimentos, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ Visible en emergencias independientemente de la configuración de privacidad
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Enfermedades Crónicas
                  </label>
                  <textarea
                    name="chronicDiseases"
                    value={formData.chronicDiseases}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Diabetes, hipertensión, asma, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Medicamentos
                  </label>
                  <textarea
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Medicamentos que toma regularmente"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Input
                    label="Compañía de Seguros"
                    type="text"
                    name="insuranceCompany"
                    value={formData.insuranceCompany}
                    onChange={handleChange}
                  />

                  <Input
                    label="Número de Póliza"
                    type="text"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleChange}
                  />

                  <Input
                    label="Número de Miembro"
                    type="text"
                    name="memberNumber"
                    value={formData.memberNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Dirección */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-dark mb-6">Dirección</h2>

            <div className="space-y-4">
              <Input
                label="Calle y Número"
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Colonia"
                  type="text"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                />

                <Input
                  label="Código Postal"
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  maxLength={5}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Seleccionar estado...</option>
                    {mexicanStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Ciudad"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <Input
                label="País"
                type="text"
                name="country"
                value={formData.country}
                disabled
              />
            </div>
          </div>

          {/* Configuración de Privacidad */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-dark mb-6">Configuración de Privacidad</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-dark">Mostrar Teléfono</h3>
                  <p className="text-sm text-gray-600">Visible para quien escanee tu placa</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="showPhone"
                    checked={formData.showPhone}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-dark">Mostrar Email</h3>
                  <p className="text-sm text-gray-600">Visible para quien escanee tu placa</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="showEmail"
                    checked={formData.showEmail}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-dark">Mostrar Dirección</h3>
                  <p className="text-sm text-gray-600">Visible para quien escanee tu placa</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="showAddress"
                    checked={formData.showAddress}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {plateType === 'human' && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-dark">Mostrar Información Médica</h3>
                    <p className="text-sm text-gray-600">Seguro médico, enfermedades y medicamentos</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="showMedicalInfo"
                      checked={formData.showMedicalInfo}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              )}

              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-700">
                  ⚠️ <strong>Nota:</strong> Las alergias siempre serán visibles en situaciones de emergencia, independientemente de tu configuración de privacidad.
                </p>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/profile/${plateId}`)}
              disabled={saving}
              className="flex-1"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              className="flex-1"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;