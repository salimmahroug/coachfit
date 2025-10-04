import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Récupérer toutes les progressions
export const getAll = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.clientId) params.append('clientId', filters.clientId);
    if (filters.programId) params.append('programId', filters.programId);
    if (filters.type) params.append('type', filters.type);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const response = await axios.get(`${API_URL}/progress?${params}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Erreur récupération progressions:', error);
    throw error.response?.data || error;
  }
};

// Récupérer une progression
export const getById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/progress/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Erreur récupération progression:', error);
    throw error.response?.data || error;
  }
};

// Créer une progression
export const create = async (progressData) => {
  try {
    const response = await axios.post(`${API_URL}/progress`, progressData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Erreur création progression:', error);
    throw error.response?.data || error;
  }
};

// Mettre à jour une progression
export const update = async (id, updateData) => {
  try {
    const response = await axios.patch(`${API_URL}/progress/${id}`, updateData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Erreur mise à jour progression:', error);
    throw error.response?.data || error;
  }
};

// Supprimer une progression
export const remove = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/progress/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Erreur suppression progression:', error);
    throw error.response?.data || error;
  }
};

// Récupérer les statistiques de progression d'un client
export const getClientStats = async (clientId) => {
  try {
    const response = await axios.get(`${API_URL}/progress/client/${clientId}/stats`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Erreur statistiques client:', error);
    throw error.response?.data || error;
  }
};

// Enregistrer des mesures corporelles
export const recordMeasurements = async (clientId, programId, measurements, notes = '') => {
  try {
    const response = await axios.post(`${API_URL}/progress`, {
      clientId,
      programId,
      type: 'measurement',
      measurements,
      notes
    }, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Erreur enregistrement mesures:', error);
    throw error.response?.data || error;
  }
};

// Enregistrer une performance
export const recordPerformance = async (clientId, programId, performance, notes = '') => {
  try {
    const response = await axios.post(`${API_URL}/progress`, {
      clientId,
      programId,
      type: 'performance',
      performance,
      notes
    }, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Erreur enregistrement performance:', error);
    throw error.response?.data || error;
  }
};

// Enregistrer une note
export const recordNote = async (clientId, programId, notes, mood, energy, sleep, nutrition) => {
  try {
    const response = await axios.post(`${API_URL}/progress`, {
      clientId,
      programId,
      type: 'note',
      notes,
      mood,
      energy,
      sleep,
      nutrition
    }, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Erreur enregistrement note:', error);
    throw error.response?.data || error;
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  getClientStats,
  recordMeasurements,
  recordPerformance,
  recordNote
};
