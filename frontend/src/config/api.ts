// Configuración de la API con Axios

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Función para obtener el token del localStorage
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Crear instancia de Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para agregar el token automáticamente a cada request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de forma centralizada
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      // Token inválido o expirado
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Opcional: redirigir al login
        // window.location.href = '/login';
      }
    }

    // Extraer mensaje de error del backend
    const errorMessage = 
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      'Error desconocido';

    return Promise.reject(new Error(errorMessage));
  }
);

// Helper para extraer 'data' de respuestas con estructura { success, data }
const extractData = <T>(response: { data: { success?: boolean; data?: T } | T }): T => {
  const responseData = response.data;
  // Si la respuesta tiene estructura { success, data }, retornar data
  if (responseData && typeof responseData === 'object' && 'data' in responseData && 'success' in responseData) {
    return (responseData as { data: T }).data;
  }
  // Si no, retornar la respuesta completa
  return responseData as T;
};

// Exportar la instancia de axios configurada
export { apiClient };

// Exportar helper si se necesita
export { extractData };

export default apiClient;

