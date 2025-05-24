import axios from 'axios';

export const generateVideo = async (apiKey, threadName, ttsText) => {
    try {
        const response = await axios.post('/generate-video', { apiKey, threadName, ttsText });
        return response.data;
    } catch (error) {
        // Enhanced error handling to pass through the structured error response
        if (error.response && error.response.data) {
            // If the backend returns a structured error response, throw that
            const errorData = error.response.data;
            const enhancedError = {
                ...errorData,
                status: error.response.status,
            };
            throw enhancedError;
        } else if (error.response) {
            // If there's a response but no data, create a structured error
            throw {
                error: `HTTP ${error.response.status}`,
                message: error.response.statusText || 'Request failed',
                status: error.response.status,
            };
        } else {
            // Network or other errors
            throw {
                error: 'Network Error',
                message: error.message || 'Unable to connect to server',
                status: 0,
            };
        }
    }
};