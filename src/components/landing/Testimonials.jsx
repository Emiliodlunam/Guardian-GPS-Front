import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Bike, User } from 'lucide-react';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: 'María González',
      role: 'Motociclista',
      image: '🏍️',
      rating: 5,
      text: 'Me salvó la vida. Tuve un accidente en la carretera y los paramédicos pudieron contactar a mi familia inmediatamente gracias a Guardian GPS.',
      type: 'human'
    },
    {
      name: 'Carlos Ramírez',
      role: 'Dueño de Mascota',
      image: '🐕',
      rating: 5,
      text: 'Encontré a mi perro Max después de 3 días perdido. La persona que lo encontró escaneó su placa y me llamó al instante. ¡Gracias Guardian GPS!',
      type: 'pet'
    },
    {
      name: 'Ana López',
      role: 'Ciclista Profesional',
      image: '🚴‍♀️',
      rating: 5,
      text: 'Como ciclista, siempre salgo con mi placa. Es tranquilidad para mí y mi familia saber que mi información médica está disponible en caso de emergencia.',
      type: 'human'
    },
    {
      name: 'Roberto Torres',
      role: 'Padre de Familia',
      image: '👨‍👧',
      rating: 5,
      text: 'Mis hijos tienen Alzheimer temprano. Gracias a Guardian GPS, cuando salen pueden ser identificados fácilmente. Es una paz mental invaluable.',
      type: 'human'
    }
  ];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-secondary/10 px-4 py-2 rounded-full mb-4">
            <span className="text-secondary font-semibold">Testimonios</span>
          </div>
          <h2 className="text-4xl font-bold text-dark mb-4">
            Historias Reales de Nuestros Usuarios
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Miles de personas y mascotas protegidas con Guardian GPS
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-5xl shadow-lg">
                  {testimonials[activeIndex].image}
                </div>
                {/* Type Badge */}
                <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold text-center ${
                  testimonials[activeIndex].type === 'human' 
                    ? 'bg-primary/10 text-primary' 
                    : 'bg-secondary/10 text-secondary'
                }`}>
                  {testimonials[activeIndex].type === 'human' ? 'Humano' : 'Mascota'}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                {/* Stars */}
                <div className="flex justify-center md:justify-start gap-1 mb-4">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-lg text-gray-700 mb-6 italic">
                  "{testimonials[activeIndex].text}"
                </p>

                {/* Author */}
                <div>
                  <p className="font-semibold text-dark text-lg">
                    {testimonials[activeIndex].name}
                  </p>
                  <p className="text-gray-500">
                    {testimonials[activeIndex].role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeIndex 
                    ? 'bg-primary w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mt-20">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-gray-600">Placas Activas</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">98%</div>
            <div className="text-gray-600">Satisfacción</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-gray-600">Mascotas Reunidas</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-gray-600">Soporte</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;