import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import Button from '../components/common/Button';

const AdminPlatesPage = () => {
  const [plates, setPlates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchAvailablePlates();
  }, []);

  const fetchAvailablePlates = async () => {
    try {
      setLoading(true);
      // Llamada directa a Supabase para obtener placas disponibles
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/plates/available`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setPlates(data.plates || []);
      }
    } catch (error) {
      console.error('Error al cargar placas:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (plateId) => {
    navigator.clipboard.writeText(plateId);
    setCopiedId(plateId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-dark mb-2">
              Placas Disponibles para Activación
            </h1>
            <p className="text-gray-600">
              Usa estos códigos para probar la activación de placas
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando placas...</p>
            </div>
          ) : plates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No hay placas disponibles</p>
              <p className="text-sm text-gray-500">
                Genera placas en Supabase con: <code className="bg-gray-100 px-2 py-1 rounded">SELECT generate_plate_batch(10, 'Test');</code>
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {plates.slice(0, 30).map((plate) => (
                <div
                  key={plate.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <code className="text-xl font-bold text-primary">
                      {plate.plate_id}
                    </code>
                    <button
                      onClick={() => copyToClipboard(plate.plate_id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copiedId === plate.plate_id ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Generada: {new Date(plate.generated_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-dark mb-2">💡 Para Testing:</h3>
            <ol className="text-sm text-gray-700 space-y-1 ml-5 list-decimal">
              <li>Copia un código de placa (clic en el ícono de copiar)</li>
              <li>Ve a "Agregar Nueva Placa" en el Dashboard</li>
              <li>Pega el código y actívala</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPlatesPage;