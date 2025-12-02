import api from './api';

// Crear perfil completo
export const createProfile = async (profileData) => {
  return await api.post('/profiles', profileData);
};

// Obtener perfil
export const getProfile = async (profileId) => {
  return await api.get(`/profiles/plate/${profileId}`);
};

// Actualizar perfil
export const updateProfile = async (profileId, updates) => {
  return await api.put(`/profiles/${profileId}`, updates);
};

// Eliminar perfil
export const deleteProfile = async (profileId) => {
  return await api.delete(`/profiles/${profileId}`);
};