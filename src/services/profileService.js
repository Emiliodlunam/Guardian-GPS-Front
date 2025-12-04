import api from './api';

// Crear perfil completo
export const createProfile = async (profileData) => {
  return await api.post('/profiles', profileData);
};

// Obtener perfil por su ID único (PK de la tabla profiles)
export const getProfileById = async (profileId) => {
  return await api.get(`/profiles/${profileId}`);
};

// Obtener perfil usando el ID de la placa asociada
// Esta es la función que faltaba y causaba el error
export const getProfileByPlateId = async (plateId) => {
  return await api.get(`/profiles/plate/${plateId}`);
};

// Mantener compatibilidad con código existente que use getProfile genérico
export const getProfile = getProfileByPlateId;

// Actualizar perfil
// Nota: Usamos plateId porque así lo configuramos en la ruta del backend
export const updateProfile = async (plateId, updates) => {
  return await api.put(`/profiles/${plateId}`, updates);
};

// Eliminar perfil
export const deleteProfile = async (profileId) => {
  return await api.delete(`/profiles/${profileId}`);
};