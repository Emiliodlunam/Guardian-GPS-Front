import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Shield, MapPin, Clock, Eye } from 'lucide-react';
import { getScanHistory } from '../services/plateService';
import Button from '../components/common/Button';

const ScanHistoryPage = () => {
  const navigate = useNavigate();
  const { plateId } = useParams();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadScanHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plateId]);

  const loadScanHistory = async () => {
    try {
      setLoading(true);
      const response = await getScanHistory(plateId);
      setScans(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading scan history:', err);
      setError('Error al cargar el historial');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial...</p>
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
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Volver al Dashboard</span>
          </button>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-3xl font-bold text-dark mb-2">
            Historial de Escaneos
          </h1>
          <p className="text-gray-600">
            Registro de todas las veces que han escaneado tu placa
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Eye className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold text-dark">{scans.length}</p>
            <p className="text-gray-600 text-sm">Total de Escaneos</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Clock className="w-8 h-8 text-secondary mx-auto mb-2" />
            <p className="text-3xl font-bold text-dark">
              {scans.length > 0 ? new Date(scans[0].scanned_at).toLocaleDateString('es-MX') : '-'}
            </p>
            <p className="text-gray-600 text-sm">Último Escaneo</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <MapPin className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="text-3xl font-bold text-dark">
              {new Set(scans.map(s => s.location || 'Desconocido')).size}
            </p>
            <p className="text-gray-600 text-sm">Ubicaciones Únicas</p>
          </div>
        </div>

        {/* Scan List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-dark mb-6">Escaneos Recientes</h2>

          {scans.length === 0 ? (
            <div className="text-center py-12">
              <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Sin escaneos registrados</p>
              <p className="text-sm text-gray-500">
                Aquí aparecerán los escaneos cuando alguien vea tu placa
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {scans.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Eye className="w-6 h-6 text-primary" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-dark">
                          Escaneo #{scan.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(scan.scanned_at)}
                        </p>
                      </div>
                    </div>

                    {scan.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{scan.location}</span>
                      </div>
                    )}

                    {scan.ip_address && (
                      <div className="text-xs text-gray-500 mt-2">
                        IP: {scan.ip_address}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Volver al Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScanHistoryPage;