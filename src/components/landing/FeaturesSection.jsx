import React from 'react';
import { Heart, MapPin, Phone, Shield, Stethoscope, PawPrint, Home, FileText } from 'lucide-react';

const FeaturesSection = () => {
  const humanFeatures = [
    {
      icon: Heart,
      title: 'Contactos de Emergencia',
      description: 'Acceso inmediato a tus contactos de confianza en caso de emergencia',
      color: 'text-red-500',
      bg: 'bg-red-50'
    },
    {
      icon: MapPin,
      title: 'Ubicación del Accidente',
      description: 'Geolocalización automática cuando alguien escanea tu placa',
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      icon: Stethoscope,
      title: 'Info Médica y Seguro',
      description: 'Alergias, tipo de sangre, póliza de seguro al alcance',
      color: 'text-green-500',
      bg: 'bg-green-50'
    }
  ];

  const petFeatures = [
    {
      icon: PawPrint,
      title: 'Identificación Rápida',
      description: 'Nombre, raza y foto de tu mascota disponibles al instante',
      color: 'text-amber-500',
      bg: 'bg-amber-50'
    },
    {
      icon: Stethoscope,
      title: 'Datos Veterinarios',
      description: 'Información médica y contacto del veterinario',
      color: 'text-purple-500',
      bg: 'bg-purple-50'
    },
    {
      icon: Home,
      title: 'Contacto del Dueño',
      description: 'Teléfono y dirección para reunir a tu mascota contigo',
      color: 'text-teal-500',
      bg: 'bg-teal-50'
    }
  ];

  const FeatureCard = ({ icon, title, description, color, bg }) => {
    const Icon = icon;
    return (
      <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        <div className={`w-14 h-14 ${bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-7 h-7 ${color}`} />
        </div>
        <h3 className="text-xl font-semibold text-dark mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    );
  };

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Humans Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary/10 px-4 py-2 rounded-full mb-4">
              <span className="text-primary font-semibold">Para Humanos</span>
            </div>
            <h2 className="text-4xl font-bold text-dark mb-4">
              ¿Por qué Guardian GPS para HUMANOS?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Protección inteligente para deportistas, adultos mayores, niños y viajeros
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {humanFeatures.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-10 bg-white rounded-xl p-8 shadow-md border-l-4 border-primary">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-dark mb-2">
                  Ideal para atletas, corredores y ciclistas
                </h4>
                <p className="text-gray-600">
                  Lleva tu información de emergencia siempre contigo. En caso de accidente durante tu entrenamiento, 
                  los paramédicos pueden acceder a tu información médica crítica en segundos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pets Section */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-block bg-secondary/10 px-4 py-2 rounded-full mb-4">
              <span className="text-secondary font-semibold">Para Mascotas</span>
            </div>
            <h2 className="text-4xl font-bold text-dark mb-4">
              ¿Por qué Guardian GPS para MASCOTAS?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tu mejor amigo siempre identificado y protegido
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {petFeatures.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-10 bg-white rounded-xl p-8 shadow-md border-l-4 border-secondary">
            <div className="flex items-start gap-4">
              <PawPrint className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-dark mb-2">
                  Protege a tu compañero peludo
                </h4>
                <p className="text-gray-600">
                  Todos creían tener la placa inmita de nuestras mascota en su casas. Ahora puedes tener 
                  toda la información digital, actualizable y al alcance de quien encuentre a tu mascota.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;