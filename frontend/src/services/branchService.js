import api from './api';

export const branchService = {
  // GET all branches
  getAll: async () => {
    try {
      const response = await api.get('/branches');
      return response.data;
    } catch (error) {
      console.error('Error in getAll branches:', error);
      throw error;
    }
  },

  // GET branch by id
  getById: async (id) => {
    try {
      const response = await api.get(`/branches/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error in getById for branch ${id}:`, error);
      throw error;
    }
  },

  // GET branches by franchise
  getByFranchise: async (franchiseId) => {
    try {
      const response = await api.get(`/branches/franchise/${franchiseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error in getByFranchise for franchise ${franchiseId}:`, error);
      throw error;
    }
  },

  // POST create branch
  create: async (branchData) => {
    try {
      const response = await api.post('/branches', branchData);
      return response.data;
    } catch (error) {
      console.error('Error in create branch:', error);
      throw error;
    }
  },

  // PUT update branch
  update: async (id, branchData) => {
    try {
      const response = await api.put(`/branches/${id}`, branchData);
      return response.data;
    } catch (error) {
      console.error(`Error in update for branch ${id}:`, error);
      throw error;
    }
  },

  // DELETE branch
  delete: async (id) => {
    try {
      const response = await api.delete(`/branches/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error in delete for branch ${id}:`, error);
      throw error;
    }
  }
};