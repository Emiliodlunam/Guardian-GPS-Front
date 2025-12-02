import React from 'react';
import Navbar from '../components/common/Navbar';
import Hero from '../components/landing/Hero';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/Testimonials';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import { Shield, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* How It Works */}
      <HowItWorks />
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Shield className="w-16 h-16 mx-auto mb-6 text-secondary" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¡Protege de lo que más quieres!
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Únete a miles de personas que ya están protegidas con Guardian GPS
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => console.log('Comprar ahora')}
            >
              <Shield className="w-5 h-5" />
              Comprar Ahora
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary"
              onClick={() => console.log('Ver más')}
            >
              Ver Más Información
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-white/20">
            <div>
              <div className="text-3xl font-bold mb-2">🔒</div>
              <div className="text-sm text-gray-200">100% Seguro</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">⚡</div>
              <div className="text-sm text-gray-200">Acceso Instantáneo</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">🌎</div>
              <div className="text-sm text-gray-200">Disponible 24/7</div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default LandingPage;