import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserPlates, updatePlateStatus } from '../services/plateService';
// 1. Agregamos 'Download' a los imports
import { Shield, LogOut, Plus, QrCode, Edit, AlertCircle, Eye, User, PawPrint, CheckCircle, Download } from 'lucide-react';
import Button from '../components/common/Button';

const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [plates, setPlates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Mostrar mensaje de éxito si viene del state
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Limpiar el state
      window.history.replaceState({}, document.title);
      
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => setSuccessMessage(''), 5000);
    }

    loadPlates();
  }, [location]);

  const loadPlates = async () => {
    try {
      setLoading(true);
      const response = await getUserPlates();
      
      if (response.success) {
        setPlates(response.plates || []);
      }
    } catch (error) {
      console.error('Error al cargar placas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleLostMode = async (plateId, currentStatus) => {
    try {
      const response = await updatePlateStatus(plateId, !currentStatus);
      
      if (response.success) {
        // Recargar placas
        loadPlates();
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar el estado de la placa');
    }
  };

  const PlateCard = ({ plate }) => {
    const profile = plate.profiles?.[0];
    if (!profile) return null;

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
        <div className="flex items-start gap-4">
          {/* Photo */}
          <div className="w-20 h-20 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
            {profile.photo_url ? (
              <img src={profile.photo_url} alt={profile.full_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white text-2xl">
                {plate.type === 'human' ? <User className="w-10 h-10" /> : <PawPrint className="w-10 h-10" />}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold text-dark">{profile.full_name}</h3>
                <p className="text-sm text-gray-600">
                  ID de Placa: <span className="font-mono font-semibold">{plate.plate_id}</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    plate.type === 'human' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-secondary/10 text-secondary'
                  }`}>
                    {plate.type === 'human' ? '👤 Humano' : '🐾 Mascota'}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    ✓ Activo
                  </span>
                </div>
              </div>
            </div>

            {/* Lost Mode */}
            {plate.is_lost && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-semibold">¡ESTOY PERDIDO!</span>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  Mostrando toda la información de contacto
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions - Modificado para soportar 4 botones */}
        {/* Cambié grid-cols-3 a grid-cols-2 sm:grid-cols-4 para que quepan todos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/profile/${plate.id}`)}
          >
            <Eye className="w-4 h-4 mr-1" />
            Ver Perfil
          </Button>
          
          <Button
            variant="outline"
            size="sm"
              onClick={() => navigate(`/profile/${plate.id}/edit`)}         >
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </Button>

          {/* ✅ NUEVO BOTÓN AGREGADO AQUÍ */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/profile/${plate.id}`)} 
          >
            <Download className="w-4 h-4 mr-1" />
            QR
          </Button>
          
          <Button
            variant={plate.is_lost ? 'outline' : 'primary'}
            size="sm"
            onClick={() => toggleLostMode(plate.id, plate.is_lost)}
            className={plate.is_lost ? 'border-red-500 text-red-500 hover:bg-red-50' : ''}
          >
            <AlertCircle className="w-4 h-4 mr-1" />
            {plate.is_lost ? 'Desactivar' : 'Perdido'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <Shield className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">
                <span className="text-dark">Guardian</span>
                <span className="text-primary">GP</span>
                <span className="text-secondary">S</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-700 hidden sm:inline">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-fade-in">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-green-700 font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dark mb-2">Mis Placas</h1>
            <p className="text-gray-600">
              Gestiona tus placas GuardianGPS y controla tu información
            </p>
          </div>
          
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/plate/activate')}
          >
            <Plus className="w-5 h-5" />
            Agregar Nueva Placa
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando tus placas...</p>
            </div>
          </div>
        ) : plates.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <QrCode className="w-12 h-12 text-primary" />
            </div>
            
            <h2 className="text-2xl font-bold text-dark mb-4">
              Aún no tienes placas activadas
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Agrega tu primera placa para empezar a proteger a quien más quieres
            </p>

            <Button variant="primary" size="lg" onClick={() => navigate('/plate/activate')}>
              <Plus className="w-5 h-5" />
              Agregar Nueva Placa
            </Button>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-12 text-left">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl mb-2">1️⃣</div>
                <h3 className="font-semibold text-dark mb-1">Compra tu Placa</h3>
                <p className="text-sm text-gray-600">Adquiere una placa física con QR</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl mb-2">2️⃣</div>
                <h3 className="font-semibold text-dark mb-1">Actívala</h3>
                <p className="text-sm text-gray-600">Escanea o ingresa el código</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-3xl mb-2">3️⃣</div>
                <h3 className="font-semibold text-dark mb-1">Configura</h3>
                <p className="text-sm text-gray-600">Agrega tu información</p>
              </div>
            </div>
          </div>
        ) : (
          /* Plates Grid */
          <div className="grid md:grid-cols-2 gap-6">
            {plates.map((plate) => (
              <PlateCard key={plate.id} plate={plate} />
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-12">
          <div className="bg-white rounded-lg p-6 shadow text-center">
            <div className="text-3xl font-bold text-primary mb-2">{plates.length}</div>
            <div className="text-gray-600">Placas Activas</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow text-center">
            <div className="text-3xl font-bold text-secondary mb-2">0</div>
            <div className="text-gray-600">Escaneos Hoy</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {plates.filter(p => p.isLost).length}
            </div>
            <div className="text-gray-600">En Modo Perdido</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">✓</div>
            <div className="text-gray-600">Cuenta Activa</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;