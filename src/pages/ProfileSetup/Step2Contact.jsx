import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Step2Contact = () => {
  const navigate = useNavigate();

  // SOLUCIÓN 1: Leer el tipo directamente al iniciar (sin useEffect)
  const [plateType] = useState(() => {
    return localStorage.getItem('plateType') || '';
  });

  // SOLUCIÓN 2: Leer los datos guardados directamente al iniciar
  const [formData, setFormData] = useState(() => {
    // Intentar recuperar datos guardados previamente
    const savedData = localStorage.getItem('profileStep2');
    if (savedData) {
      return JSON.parse(savedData);
    }
    
    // Si no hay datos, devolver el formulario vacío por defecto
    return {
      // Contacto de Emergencia 1
      emergencyContact1Name: '',
      emergencyContact1Email: '',
      emergencyContact1Phone: '',
      emergencyContact1PhoneAlt: '',
      // Contacto de Emergencia 2
      emergencyContact2Name: '',
      emergencyContact2Email: '',
      emergencyContact2Phone: '',
      // Información Médica
      chronicDiseases: '',
      medications: '',
      allergies: '',
      socialSecurityNumber: '', // ✅ Campo conservado
      insuranceCompany: '',
      policyNumber: '',
      memberNumber: '',
      bloodType: '',
      // Dirección
      street: '',
      colony: '',
      state: '',
      city: '',
      country: 'México',
      // Acerca de
      about: '',
    };
  });

  const [errors, setErrors] = useState({});

  // useEffect ahora solo se usa para VALIDAR y REDIRIGIR (sin sets)
  useEffect(() => {
    // 1. Si no hay tipo de placa, volver al inicio
    if (!plateType) {
      navigate('/plate/select-type');
      return;
    }
    
    // 2. Si no completó el paso 1, volver al paso 1
    const step1Data = localStorage.getItem('profileStep1');
    if (!step1Data) {
      navigate('/plate/setup/step1');
    }
    // Nota: Ya no hacemos setFormData aquí porque ya se cargó en el useState inicial
  }, [plateType, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.emergencyContact1Name.trim()) {
      newErrors.emergencyContact1Name = 'El nombre del contacto 1 es requerido';
    }
    if (!formData.emergencyContact1Email.trim()) {
      newErrors.emergencyContact1Email = 'El correo del contacto 1 es requerido';
    }
    if (!formData.emergencyContact1Phone.trim()) {
      newErrors.emergencyContact1Phone = 'El teléfono del contacto 1 es requerido';
    }
    if (!formData.street.trim()) {
      newErrors.street = 'La calle es requerida';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'El estado es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    localStorage.setItem('profileStep2', JSON.stringify(formData));
    navigate('/plate/setup/step3');
  };

  // Evitar renderizado si estamos redirigiendo
  if (!plateType) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/plate/setup/step1')}
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-3xl font-bold text-dark mb-2">
            Configuración del Perfil - Paso 2 de 3
          </h1>
          <p className="text-gray-600">
            Contacto, Información Médica y Domicilio
          </p>

          <div className="mt-6 max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Paso 3 de 4</span>
              <span className="font-semibold text-primary">75%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Contactos de Emergencia */}
            <div>
              <h3 className="text-lg font-semibold text-dark mb-4 flex items-center gap-2">
                <span className="text-2xl">👥</span>
                Contactos de Emergencia
              </h3>
              
              {/* Contacto 1 */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-dark mb-3">Contacto 1 (Principal)</h4>
                <div className="space-y-4">
                  <Input
                    label="Nombre Completo"
                    type="text"
                    name="emergencyContact1Name"
                    value={formData.emergencyContact1Name}
                    onChange={handleChange}
                    placeholder="Ej. María González"
                    error={errors.emergencyContact1Name}
                    required
                  />
                  <Input
                    label="Correo Electrónico"
                    type="email"
                    name="emergencyContact1Email"
                    value={formData.emergencyContact1Email}
                    onChange={handleChange}
                    placeholder="maria@email.com"
                    error={errors.emergencyContact1Email}
                    required
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Teléfono Principal"
                      type="tel"
                      name="emergencyContact1Phone"
                      value={formData.emergencyContact1Phone}
                      onChange={handleChange}
                      placeholder="+52 123 456 7890"
                      error={errors.emergencyContact1Phone}
                      required
                    />
                    <Input
                      label="Teléfono Alternativo"
                      type="tel"
                      name="emergencyContact1PhoneAlt"
                      value={formData.emergencyContact1PhoneAlt}
                      onChange={handleChange}
                      placeholder="+52 098 765 4321"
                    />
                  </div>
                </div>
              </div>

              {/* Contacto 2 */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-dark mb-3">Contacto 2 (Opcional)</h4>
                <div className="space-y-4">
                  <Input
                    label="Nombre Completo"
                    type="text"
                    name="emergencyContact2Name"
                    value={formData.emergencyContact2Name}
                    onChange={handleChange}
                    placeholder="Ej. Juan Pérez"
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Correo Electrónico"
                      type="email"
                      name="emergencyContact2Email"
                      value={formData.emergencyContact2Email}
                      onChange={handleChange}
                      placeholder="juan@email.com"
                    />
                    <Input
                      label="Teléfono"
                      type="tel"
                      name="emergencyContact2Phone"
                      value={formData.emergencyContact2Phone}
                      onChange={handleChange}
                      placeholder="+52 111 222 3333"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Información Médica */}
            {plateType === 'human' && (
              <div>
                <h3 className="text-lg font-semibold text-dark mb-2 flex items-center gap-2">
                  <span className="text-2xl">🏥</span>
                  Información Médica
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Esta información puede salvar vidas en caso de emergencia
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Enfermedades Crónicas
                    </label>
                    <textarea
                      name="chronicDiseases"
                      value={formData.chronicDiseases}
                      onChange={handleChange}
                      placeholder="Ej. Diabetes, Hipertensión, Asma..."
                      rows="2"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Medicamentos que Toma
                    </label>
                    <textarea
                      name="medications"
                      value={formData.medications}
                      onChange={handleChange}
                      placeholder="Ej. Metformina 500mg, Losartán 50mg..."
                      rows="2"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Alergias <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      placeholder="Ej. Penicilina, Mariscos, Polen..."
                      rows="2"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      * Esta información siempre será visible en emergencias
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tipo de Sangre
                      </label>
                      <select
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      >
                        <option value="">Selecciona...</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    <Input
                      label="Número de Seguro Social (NSS)"
                      type="text"
                      name="socialSecurityNumber"
                      value={formData.socialSecurityNumber}
                      onChange={handleChange}
                      placeholder="12345678901"
                      maxLength="11"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Compañía de Seguros"
                      type="text"
                      name="insuranceCompany"
                      value={formData.insuranceCompany}
                      onChange={handleChange}
                      placeholder="Ej. IMSS, GNP, Metlife"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Número de Póliza"
                      type="text"
                      name="policyNumber"
                      value={formData.policyNumber}
                      onChange={handleChange}
                      placeholder="Número de póliza"
                    />
                    <Input
                      label="Número de Miembro"
                      type="text"
                      name="memberNumber"
                      value={formData.memberNumber}
                      onChange={handleChange}
                      placeholder="Número de miembro"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Dirección */}
            <div>
              <h3 className="text-lg font-semibold text-dark mb-4 flex items-center gap-2">
                <span className="text-2xl">🏠</span>
                Dirección del Domicilio
              </h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Calle y Número"
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Ej. Av. Principal 123"
                    error={errors.street}
                    required
                  />
                  <Input
                    label="Colonia"
                    type="text"
                    name="colony"
                    value={formData.colony}
                    onChange={handleChange}
                    placeholder="Ej. Centro"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Estado <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecciona...</option>
                      <option value="Aguascalientes">Aguascalientes</option>
                      <option value="Baja California">Baja California</option>
                      <option value="Baja California Sur">Baja California Sur</option>
                      <option value="Campeche">Campeche</option>
                      <option value="Chiapas">Chiapas</option>
                      <option value="Chihuahua">Chihuahua</option>
                      <option value="Coahuila">Coahuila</option>
                      <option value="Colima">Colima</option>
                      <option value="Ciudad de México">Ciudad de México</option>
                      <option value="Durango">Durango</option>
                      <option value="Guanajuato">Guanajuato</option>
                      <option value="Guerrero">Guerrero</option>
                      <option value="Hidalgo">Hidalgo</option>
                      <option value="Jalisco">Jalisco</option>
                      <option value="Estado de México">Estado de México</option>
                      <option value="Michoacán">Michoacán</option>
                      <option value="Morelos">Morelos</option>
                      <option value="Nayarit">Nayarit</option>
                      <option value="Nuevo León">Nuevo León</option>
                      <option value="Oaxaca">Oaxaca</option>
                      <option value="Puebla">Puebla</option>
                      <option value="Querétaro">Querétaro</option>
                      <option value="Quintana Roo">Quintana Roo</option>
                      <option value="San Luis Potosí">San Luis Potosí</option>
                      <option value="Sinaloa">Sinaloa</option>
                      <option value="Sonora">Sonora</option>
                      <option value="Tabasco">Tabasco</option>
                      <option value="Tamaulipas">Tamaulipas</option>
                      <option value="Tlaxcala">Tlaxcala</option>
                      <option value="Veracruz">Veracruz</option>
                      <option value="Yucatán">Yucatán</option>
                      <option value="Zacatecas">Zacatecas</option>
                    </select>
                    {errors.state && (
                      <p className="text-red-600 text-sm mt-1">{errors.state}</p>
                    )}
                  </div>
                  <Input
                    label="Ciudad"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Aguascalientes"
                    error={errors.city}
                    required
                  />
                  <Input
                    label="País"
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Acerca de */}
            <div>
              <h3 className="text-lg font-semibold text-dark mb-4 flex items-center gap-2">
                <span className="text-2xl">📝</span>
                Acerca de {plateType === 'human' ? 'Ti' : 'Tu Mascota'}
              </h3>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder={plateType === 'human' ? "Ej. Me gusta correr maratones, soy vegetariano..." : "Ej. Max es muy juguetón, le encanta el parque..."}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              <p className="text-sm text-gray-500 mt-2">
                Opcional: Información adicional que quieras compartir
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => navigate('/plate/setup/step1')}
              >
                ← Atrás
              </Button>
              <Button type="submit" variant="primary" size="lg" fullWidth>
                GUARDAR Y CONTINUAR →
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Step2Contact;