// services/sseService.js
const SSE_URL = 'http://localhost:5000/sse-requests';

export const getSseEndpoint = () => SSE_URL;