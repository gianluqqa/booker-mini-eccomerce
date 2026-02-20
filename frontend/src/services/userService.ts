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

/**
 * Elimina un usuario específico por ID (solo admin)
 * @param userId ID del usuario a eliminar
 * @returns Mensaje de confirmación con ID del usuario eliminado
 * @throws Error si no se puede eliminar el usuario
 */
export const deleteUser = async (userId: string): Promise<{ message: string; userId: string }> => {
  try {
    const response = await apiClient.delete<{ success: boolean; data: { userId: string } }>(`/users/${userId}`)
    return {
      message: 'Usuario eliminado exitosamente',
      userId: response.data.data.userId
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } }
      if (axiosError.response?.status === 403) {
        throw new Error('No tienes permisos para eliminar usuarios')
      } else if (axiosError.response?.status === 404) {
        throw new Error('Usuario no encontrado')
      } else if (axiosError.response?.data?.message?.includes('administrador')) {
        throw new Error('No se puede eliminar al usuario administrador')
      }
    }
    throw new Error('Error al eliminar el usuario')
  }
}

/**
 * Elimina todos los usuarios excepto el administrador (solo admin)
 * @returns Mensaje de confirmación con cantidad de usuarios eliminados
 * @throws Error si no se pueden eliminar los usuarios
 */
export const deleteAllUsersExceptAdmin = async (): Promise<{ message: string; deletedCount: number }> => {
  try {
    const response = await apiClient.delete<{ success: boolean; data: { deletedCount: number; message?: string } }>('/users/')
    return {
      message: response.data.data.message || 'Usuarios eliminados exitosamente',
      deletedCount: response.data.data.deletedCount
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } }
      if (axiosError.response?.status === 403) {
        throw new Error('No tienes permisos para realizar esta acción')
      }
    }
    throw new Error('Error al eliminar los usuarios')
  }
}

