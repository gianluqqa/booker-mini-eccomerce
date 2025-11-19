// Servicios para operaciones relacionadas con usuarios

import { apiClient, extractData } from '@/config/api'
import { IUser } from '@/types/User'

/**
 * Obtiene el perfil del usuario actual autenticado
 * @returns Datos del usuario actual
 * @throws Error si no se puede obtener el perfil
 */
export const getUserProfile = async (): Promise<IUser> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: IUser }>('/users/me')
    return extractData<IUser>(response)
  } catch (error) {
    throw new Error('Error al cargar el perfil del usuario')
  }
}

