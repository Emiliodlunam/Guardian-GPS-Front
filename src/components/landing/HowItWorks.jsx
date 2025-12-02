import React from 'react';
import { UserPlus, QrCode, Package, ScanLine, ArrowRight } from 'lucide-react';
import Button from '../common/Button';

const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      icon: UserPlus,
      title: 'Registra tu perfil online',
      description: 'Crea tu cuenta y configura tu información de emergencia de forma segura',
      color: 'from-blue-500 to-blue-600'
    },
    {
      number: '2',
      icon: Package,
      title: 'Etiqueta tu placa con QR',
      description: 'Recibe tu placa física personalizada con código QR único',
      color: 'from-purple-500 to-purple-600'
    },
    {
      number: '3',
      icon: QrCode,
      title: 'Recibe tu pulsera/placa',
      description: 'Activa tu placa y vincúlala a tu perfil digital',
      color: 'from-amber-500 to-amber-600'
    },
    {
      number: '4',
      icon: ScanLine,
      title: 'Escanea en emergencia',
      description: 'Cualquiera puede escanear el QR y acceder a tu información de emergencia',
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-primary/10 px-4 py-2 rounded-full mb-4">
            <span className="text-primary font-semibold">Simple y Rápido</span>
          </div>
          <h2 className="text-4xl font-bold text-dark mb-4">
            ¿Cómo Funciona Guardian GPS?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            En solo 4 pasos tendrás tu sistema de identificación inteligente activo
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-32 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 opacity-20"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-primary/30">
                  {/* Number Badge */}
                  <div className={`absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-xl">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className="mb-4 mt-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-lg flex items-center justify-center`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-dark mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-32 -right-4 z-10">
                    <ArrowRight className="w-8 h-8 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Video/Animation Section */}
        <div className="mt-20 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Video Placeholder */}
            <div className="bg-gradient-to-br from-dark to-primary rounded-xl aspect-video flex items-center justify-center shadow-2xl">
              <div className="text-center text-white">
                <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 hover:scale-110 transition-transform cursor-pointer">
                  <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
                </div>
                <p className="text-lg font-semibold">Ver Video Demo</p>
                <p className="text-sm text-gray-300 mt-2">2:30 min</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-dark">
                Tu seguridad en segundos
              </h3>
              <p className="text-lg text-gray-600">
                Guardian GPS transforma la forma en que compartes tu información de emergencia. 
                Sin aplicaciones complicadas, sin configuraciones difíciles.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">
                    <strong>Sin instalación:</strong> Funciona con cualquier cámara de teléfono
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">
                    <strong>Actualización instantánea:</strong> Cambia tu info cuando quieras
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">
                    <strong>Privacidad garantizada:</strong> Tú decides qué información mostrar
                  </p>
                </div>
              </div>

              <Button variant="primary" size="lg" className="mt-6">
                Ver Placas Disponibles
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;