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
        
        // Disparar un evento personalizado para que AuthContext se entere
        window.dispatchEvent(new Event('auth-logout'));
      }
      // Marcar el error como de autenticación para que el frontend lo ignore o lo maneje distinto
      (error as any).isAuthError = true;
      error.message = "Tu sesión ha terminado. Por favor, vuelve a ingresar.";
    }

    // Extraer datos del error del backend
    const responseData = error.response?.data as { 
      message?: string; 
      errors?: string[]; 
      success?: boolean 
    };
    
    // 1. Si el backend envió una lista de errores de validación, construimos un mensaje detallado
    if (responseData?.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
      // Priorizamos los errores específicos para mejorar la UX
      error.message = responseData.errors.join(". ");
      
      // Enriquecer el objeto de error para componentes que quieran manejar errores específicos por campo
      (error as any).validationErrors = responseData.errors;
    } 
    // 2. Si no hay lista de errores pero sí un mensaje principal, lo usamos
    else if (responseData?.message) {
      // Si ya marcamos como isAuthError, mantenemos el mensaje amigable a menos que el backend tenga algo más específico
      if (!(error as any).isAuthError) {
        error.message = responseData.message;
      }
    }
    // 3. Fallback genérico si no hay información estructurada
    else if (!error.message) {
      error.message = "Ocurrió un error inesperado. Por favor, intenta de nuevo.";
    }
    
    // Mantener la estructura del error para que el llamador pueda verificar el status
    return Promise.reject(error);
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

