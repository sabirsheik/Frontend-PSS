const API_BASE_URL = import.meta.env.VITE_API_URL;

interface FetchOptions extends RequestInit {
  body?: any;
}

const apiFetch = async (endpoint: string, options: FetchOptions = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    credentials: 'include', 
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    // For user endpoint, return null on 401 instead of throwing
    if (endpoint === '/api/auth/user' && response.status === 401) {
      return null;
    }
    const errorData = await response.json().catch(() => ({ message: 'Something went wrong' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export default apiFetch;