import api from './api';

export const franchiseService = {
  // GET all franchises
  getAll: async () => {
    try {
      const response = await api.get('/franchises');
      return response.data;
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error;
    }
  },

  // GET franchise by id
  getById: async (id) => {
    try {
      const response = await api.get(`/franchises/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error in getById for id ${id}:`, error);
      throw error;
    }
  },

  // POST create franchise
  create: async (franchiseData) => {
    try {
      const response = await api.post('/franchises', franchiseData);
      return response.data;
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  },

  // PUT update franchise
  update: async (id, franchiseData) => {
    try {
      const response = await api.put(`/franchises/${id}`, franchiseData);
      return response.data;
    } catch (error) {
      console.error(`Error in update for id ${id}:`, error);
      throw error;
    }
  },

  // DELETE franchise
  delete: async (id) => {
    try {
      const response = await api.delete(`/franchises/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error in delete for id ${id}:`, error);
      throw error;
    }
  }
};