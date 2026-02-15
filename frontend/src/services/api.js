import axios from 'axios';

const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Health check
export const healthCheck = () => api.get('/health');

// Dashboard endpoints
export const getDashboard = () => api.get('/api/dashboard');

// Sectors endpoints
export const getSectors = () => api.get('/api/sectors');
export const getSectorDetail = (sectorId) => api.get(`/api/sectors/${sectorId}`);

// Recommendations endpoints
export const getRecommendations = (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.sector) queryParams.append('sector', params.sector);
  if (params.conviction_min) queryParams.append('conviction_min', params.conviction_min);
  if (params.risk_level) queryParams.append('risk_level', params.risk_level);
  if (params.stance) queryParams.append('stance', params.stance);
  const query = queryParams.toString();
  return api.get(`/api/recommendations${query ? `?${query}` : ''}`);
};

export const getRecommendationDetail = (recId) => api.get(`/api/recommendations/${recId}`);

// Macro endpoints
export const getMacro = () => api.get('/api/macro');
export const getMarketCycle = () => api.get('/api/macro/cycle');
export const getGeopoliticalRisks = () => api.get('/api/macro/geopolitical');

// Portfolio endpoints
export const getPortfolio = (riskLevel = 'moderate') => 
  api.get(`/api/portfolio/allocation?risk_level=${riskLevel}`);

export default api;
