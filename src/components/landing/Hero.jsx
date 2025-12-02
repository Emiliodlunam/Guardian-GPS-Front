import React from 'react';
import { Shield, QrCode } from 'lucide-react';
import Button from '../common/Button';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-dark via-primary to-primary-light overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-light/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Tu Seguridad, a un Escaneo.
            </h1>
            <p className="text-xl text-gray-200">
              Descubre Guardian GPS para ti y tus mascotas
            </p>
            <p className="text-lg text-gray-300">
              Protege a quien más quieres con tecnología QR inteligente. 
              Información de emergencia disponible al instante.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              >
                <Shield className="w-5 h-5" />
                Saber Más para Humanos
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              >
                🐾 Saber Más para Mascotas
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <div className="text-3xl font-bold text-secondary">24/7</div>
                <div className="text-sm text-gray-300">Acceso Instantáneo</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">100%</div>
                <div className="text-sm text-gray-300">Seguro y Privado</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">∞</div>
                <div className="text-sm text-gray-300">Actualizaciones</div>
              </div>
            </div>
          </div>

          {/* Right Content - Illustrations */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="grid grid-cols-2 gap-6">
                {/* Human Card */}
                <div className="bg-white rounded-xl p-6 text-center space-y-3 hover:scale-105 transition-transform">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-dark">Para Humanos</h3>
                  <p className="text-sm text-gray-600">Atletas, niños, adultos mayores</p>
                </div>

                {/* Pet Card */}
                <div className="bg-white rounded-xl p-6 text-center space-y-3 hover:scale-105 transition-transform">
                  <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-full flex items-center justify-center text-3xl">
                    🐾
                  </div>
                  <h3 className="font-semibold text-dark">Para Mascotas</h3>
                  <p className="text-sm text-gray-600">Perros, gatos y más</p>
                </div>

                {/* QR Example */}
                <div className="col-span-2 bg-gradient-to-br from-primary to-primary-dark rounded-xl p-6 text-white text-center space-y-3">
                  <QrCode className="w-12 h-12 mx-auto" />
                  <p className="font-semibold">Escanea en Emergencia</p>
                  <p className="text-sm text-gray-200">Información vital al instante</p>
                </div>
              </div>
            </div>

            {/* Floating QR Code */}
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl rotate-12 hover:rotate-0 transition-transform">
              <QrCode className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;