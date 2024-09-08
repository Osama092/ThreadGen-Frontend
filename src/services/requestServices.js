// src/services/apiService.js
const BASE_URL = 'http://localhost:5000';

export const getSSEUrl = () => `${BASE_URL}/sse-requests`;