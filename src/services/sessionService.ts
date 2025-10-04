import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Récupérer toutes les séances
export const getAll = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.clientId) params.append('clientId', filters.clientId);
    if (filters.programId) params.append('programId', filters.programId);
    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const response = await axios.get(`${API_URL}/sessions?${params}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Erreur récupération séances:', error);
    throw error.response?.data || error;
  }
};

// Récupérer une séance
export const getById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/sessions/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Erreur récupération séance:', error);
    throw error.response?.data || error;
  }
};

// Créer une séance
export const create = async (sessionData) => {
  try {
    const response = await axios.post(`${API_URL}/sessions`, sessionData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Erreur création séance:', error);
    throw error.response?.data || error;
  }
};

// Mettre à jour une séance
export const update = async (id, updateData) => {
  try {
    const response = await axios.patch(`${API_URL}/sessions/${id}`, updateData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Erreur mise à jour séance:', error);
    throw error.response?.data || error;
  }
};

// Supprimer une séance
export const remove = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/sessions/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Erreur suppression séance:', error);
    throw error.response?.data || error;
  }
};

// Récupérer les séances à venir
export const getUpcoming = async () => {
  try {
    const response = await axios.get(`${API_URL}/sessions/filter/upcoming`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Erreur séances à venir:', error);
    throw error.response?.data || error;
  }
};

// Marquer une séance comme complétée
export const markAsCompleted = async (id, data = {}) => {
  try {
    const response = await axios.patch(`${API_URL}/sessions/${id}`, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      ...data
    }, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Erreur complétion séance:', error);
    throw error.response?.data || error;
  }
};

// Marquer une séance comme annulée
export const markAsCancelled = async (id, reason = '') => {
  try {
    const response = await axios.patch(`${API_URL}/sessions/${id}`, {
      status: 'cancelled',
      notes: reason
    }, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Erreur annulation séance:', error);
    throw error.response?.data || error;
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  getUpcoming,
  markAsCompleted,
  markAsCancelled
};
