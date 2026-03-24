import api from './api';

// Service for handling product-related API calls
export const productService = {
  // GET all products
  getAll: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error in getAll products:', error);
      throw error;
    }
  },

  // GET product by id
  getById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error in getById for product ${id}:`, error);
      throw error;
    }
  },

  // GET products by branch
  getByBranch: async (branchId) => {
    try {
      const response = await api.get(`/products/branch/${branchId}`);
      return response.data;
    } catch (error) {
      console.error(`Error in getByBranch for branch ${branchId}:`, error);
      throw error;
    }
  },

  // POST create product
  create: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error in create product:', error);
      throw error;
    }
  },

  // PUT update product
  update: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error in update for product ${id}:`, error);
      throw error;
    }
  },

  // PATCH update stock only
  updateStock: async (id, stock) => {
    try {
      const response = await api.patch(`/products/${id}/stock`, { stock });
      return response.data;
    } catch (error) {
      console.error(`Error in updateStock for product ${id}:`, error);
      throw error;
    }
  },

  // DELETE product
  delete: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error in delete for product ${id}:`, error);
      throw error;
    }
  },

  // Search products by name
  search: async (searchTerm) => {
    try {
      const response = await api.get(`/products/search?name=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      console.error('Error in search products:', error);
      throw error;
    }
  }
};