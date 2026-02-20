import { useState } from 'react';
import { deleteUser, deleteAllUsersExceptAdmin } from '@/services/userService';
import { IUser } from '@/types/User';

export const useUserManagement = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Eliminar un usuario específico
  const handleDeleteUser = async (
    userId: string, 
    userName: string,
    onSuccess?: (userId: string) => void
  ) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${userName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setLoading(userId);
      await deleteUser(userId);
      setError(null);
      onSuccess?.(userId);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar el usuario";
      setError(errorMessage);
      console.error("Error deleting user:", err);
      return false;
    } finally {
      setLoading(null);
    }
  };

  // Eliminar todos los usuarios excepto admin
  const handleDeleteAllUsers = async (
    users: IUser[],
    onSuccess?: (result: { message: string; deletedCount: number }) => void
  ) => {
    const customersCount = users.filter(u => u.role !== 'admin').length;
    if (customersCount === 0) {
      setError("No hay usuarios clientes para eliminar");
      return false;
    }

    if (!window.confirm(
      `¿Estás seguro de que quieres eliminar a todos los usuarios clientes? Se eliminarán ${customersCount} usuarios. Esta acción no se puede deshacer.`
    )) {
      return;
    }

    try {
      setDeleteAllLoading(true);
      const result = await deleteAllUsersExceptAdmin();
      setError(null);
      onSuccess?.(result);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar los usuarios";
      setError(errorMessage);
      console.error("Error deleting all users:", err);
      return false;
    } finally {
      setDeleteAllLoading(false);
    }
  };

  // Limpiar error
  const clearError = () => setError(null);

  return {
    loading,
    deleteAllLoading,
    error,
    handleDeleteUser,
    handleDeleteAllUsers,
    clearError,
  };
};
