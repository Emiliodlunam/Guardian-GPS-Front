import api from './api';

// Validar placa antes de activar
export const validatePlate = async (plateId) => {
  const response = await api.post('/plates/validate', {
    plateId: plateId.toUpperCase(),
  });
  return response;
};

// Activar placa
export const activatePlate = async (plateId, type) => {
  return await api.post('/plates/activate', {
    plateId: plateId.toUpperCase(),
    type,
  });
};

// Obtener placas del usuario
export const getUserPlates = async () => {
  const response = await api.get('/plates/user');
  return response;
};

// Actualizar estado de placa (modo perdido)
export const updatePlateStatus = async (plateId, isLost) => {
  const response = await api.put(`/plates/${plateId}/status`, {
    isLost,
  });
  return response;
};

// Obtener información pública de placa (para escaneo)
export const getPublicPlateInfo = async (plateId) => {
  return await api.get(`/plates/scan/${plateId}`);
};

// Obtener historial de escaneos
export const getScanHistory = async (plateId) => {
  const response = await api.get(`/plates/${plateId}/scans`);
  return response;
};