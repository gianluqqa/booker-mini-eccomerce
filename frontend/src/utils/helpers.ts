// Funciones helper reutilizables

/**
 * Obtiene el texto a mostrar para un rol de usuario
 * @param role - Rol del usuario (admin, customer, etc.)
 * @returns Texto legible del rol
 */
export const getRoleDisplay = (role?: string): string => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'Administrador'
    case 'customer':
      return 'Cliente'
    default:
      return 'Cliente'
  }
}

/**
 * Obtiene las clases CSS para el color del rol
 * @param role - Rol del usuario (admin, customer, etc.)
 * @returns Clases de Tailwind CSS para el rol
 */
export const getRoleColor = (role?: string): string => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'text-red-600 bg-red-100'
    case 'customer':
      return 'text-blue-600 bg-blue-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

/**
 * Formatea una fecha a formato legible en español
 * @param date - Fecha a formatear (string, Date o undefined)
 * @param options - Opciones de formato
 * @returns Fecha formateada o 'N/A' si no hay fecha
 */
export const formatDate = (
  date: string | Date | undefined,
  options: {
    month?: 'long' | 'short' | 'numeric' | '2-digit'
    year?: 'numeric' | '2-digit'
    day?: 'numeric' | '2-digit'
  } = { month: 'long', year: 'numeric' }
): string => {
  if (!date) return 'N/A'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) return 'N/A'
  
  return dateObj.toLocaleDateString('es-ES', options)
}

