import { Client, ClientData, Program, ProgramData, ProgressData } from '@/types';

// Configuration de l'API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper pour gérer les erreurs
const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // Afficher l'erreur détaillée dans la console
    console.error('Erreur API:', {
      status: response.status,
      statusText: response.statusText,
      data: data
    });
    throw new Error(data.message || data.error || 'Une erreur est survenue');
  }
  
  return data;
};

// Helper pour obtenir le token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// ========================
// Service d'authentification
// ========================
export const authService = {
  // Inscription
  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await handleResponse(response);
    
    // Sauvegarder le token
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Connexion
  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await handleResponse(response);
    
    // Sauvegarder le token
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Obtenir le profil utilisateur
  getProfile: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    
    return handleResponse(response);
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// ========================
// Service de gestion des clients
// ========================
export const clientService = {
  // Obtenir tous les clients
  getAll: async () => {
    const response = await fetch(`${API_URL}/clients`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    
    return handleResponse(response);
  },

  // Obtenir un client par ID
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/clients/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    
    return handleResponse(response);
  },

  // Créer un nouveau client
  create: async (clientData: ClientData) => {
    const response = await fetch(`${API_URL}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(clientData),
    });
    
    return handleResponse(response);
  },

  // Mettre à jour un client
  update: async (id: string, clientData: Partial<ClientData>) => {
    const response = await fetch(`${API_URL}/clients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(clientData),
    });
    
    return handleResponse(response);
  },

  // Supprimer un client
  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/clients/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    
    return handleResponse(response);
  },
};

// ========================
// Service de gestion des programmes
// ========================
export const programService = {
  // Obtenir tous les programmes
  getAll: async (filters?: { clientId?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.clientId) params.append('clientId', filters.clientId);
    if (filters?.status) params.append('status', filters.status);
    
    const url = `${API_URL}/programs${params.toString() ? '?' + params.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    
    return handleResponse(response);
  },

  // Obtenir un programme par ID
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/programs/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    
    return handleResponse(response);
  },

  // Créer un programme manuellement
  create: async (programData: ProgramData) => {
    const response = await fetch(`${API_URL}/programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(programData),
    });
    
    return handleResponse(response);
  },

  // Générer un programme avec l'IA
  generate: async (clientId: string) => {
    const response = await fetch(`${API_URL}/programs/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ clientId }),
    });
    
    return handleResponse(response);
  },

  // Mettre à jour un programme
  update: async (id: string, programData: Partial<ProgramData>) => {
    const response = await fetch(`${API_URL}/programs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(programData),
    });
    
    return handleResponse(response);
  },

  // Supprimer un programme
  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/programs/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    
    return handleResponse(response);
  },

  // Ajouter une entrée de progression
  addProgress: async (id: string, progressData: ProgressData) => {
    const response = await fetch(`${API_URL}/programs/${id}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(progressData),
    });
    
    return handleResponse(response);
  },
};

// Export par défaut pour la compatibilité
export default {
  auth: authService,
  clients: clientService,
  programs: programService,
};
