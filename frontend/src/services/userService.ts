// Servicios para operaciones relacionadas con usuarios

import { apiClient, extractData } from '@/config/api'
import { IUser } from '@/types/User'

export interface UpdateUserPayload {
  name?: string
  surname?: string
  address?: string | null
  country?: string | null
  city?: string | null
  phone?: string | null
  bio?: string | null
}

/**
 * Obtiene el perfil del usuario actual autenticado
 * @returns Datos del usuario actual
 * @throws Error si no se puede obtener el perfil
 */
export const getUserProfile = async (): Promise<IUser> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: IUser }>('/users/me')
    return extractData<IUser>(response)
  } catch {
    throw new Error('Error al cargar el perfil del usuario')
  }
}

export const updateUserProfile = async (userId: string, payload: UpdateUserPayload): Promise<IUser> => {
  try {
    const response = await apiClient.put<{ success: boolean; data: IUser }>(`/users/${userId}`, payload)
    return extractData<IUser>(response)
  } catch {
    throw new Error('Error al actualizar el perfil del usuario')
  }
}

