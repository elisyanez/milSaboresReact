const API_BASE_URL = 'http://localhost:8080/api';

export const ubicacionService = {
  // Obtener todas las regiones
  getRegiones: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/util/regiones`);
      if (!response.ok) throw new Error('Error fetching regiones');
      return await response.json();
    } catch (error) {
      console.error('Error getting regiones:', error);
      throw error;
    }
  },

  // Obtener todas las comunas
  getComunas: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/util/comunas`);
      if (!response.ok) throw new Error('Error fetching comunas');
      return await response.json();
    } catch (error) {
      console.error('Error getting comunas:', error);
      throw error;
    }
  },

  // Obtener comunas por región
  getComunasPorRegion: async (regionCodigo) => {
    try {
      const comunas = await ubicacionService.getComunas();
      return comunas.filter(comuna => comuna.regionCodigo === regionCodigo);
    } catch (error) {
      console.error('Error getting comunas por region:', error);
      throw error;
    }
  }
};