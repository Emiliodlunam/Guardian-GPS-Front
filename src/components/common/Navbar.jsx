import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">
              <span className="text-dark">Guardian</span>
              <span className="text-primary"> GPS</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-primary transition-colors">
              Características
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-primary transition-colors">
              Cómo Funciona
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-primary transition-colors">
              Testimonios
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              Iniciar Sesión
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
              Registrarse
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <a
              href="#features"
              className="block py-2 text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Características
            </a>
            <a
              href="#how-it-works"
              className="block py-2 text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Cómo Funciona
            </a>
            <a
              href="#testimonials"
              className="block py-2 text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Testimonios
            </a>
            <div className="pt-4 space-y-2">
              <Button variant="outline" size="sm" fullWidth onClick={() => { navigate('/login'); setIsOpen(false); }}>
                Iniciar Sesión
              </Button>
              <Button variant="primary" size="sm" fullWidth onClick={() => { navigate('/register'); setIsOpen(false); }}>
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;