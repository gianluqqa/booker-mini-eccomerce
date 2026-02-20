"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getAllUsers } from "@/services/adminService";
import { deleteUser, deleteAllUsersExceptAdmin } from "@/services/userService";
import { IUser } from "@/types/User";
import Image from "next/image";
import { Users, Loader2, AlertCircle, Mail, Calendar, Shield, User as UserIcon, Trash2, AlertTriangle } from "lucide-react";
import { getRoleDisplay, getRoleColor, formatDate } from "@/utils/helpers";

const UsersTable = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  useEffect(() => {
    // Verificar autenticación y rol de admin
    if (authLoading) return;

    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login");
      return;
    }

    // Cargar usuarios
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al cargar los usuarios";
        setError(errorMessage);
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAuthenticated, authLoading, user, router]);

  // Función para eliminar un usuario específico
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${userName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setDeleteLoading(userId);
      await deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar el usuario";
      setError(errorMessage);
      console.error("Error deleting user:", err);
    } finally {
      setDeleteLoading(null);
    }
  };

  // Función para eliminar todos los usuarios excepto admin
  const handleDeleteAllUsers = async () => {
    try {
      setDeleteAllLoading(true);
      const result = await deleteAllUsersExceptAdmin();
      setUsers(users.filter(u => u.role === 'admin'));
      setError(null);
      setShowDeleteAllConfirm(false);
      alert(`${result.message} (${result.deletedCount} usuarios eliminados)`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar los usuarios";
      setError(errorMessage);
      console.error("Error deleting all users:", err);
    } finally {
      setDeleteAllLoading(false);
    }
  };

  // No renderizar si no es admin
  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  // Estado de carga
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#2e4b30] animate-spin mx-auto mb-3" />
          <p className="text-[#2e4b30] text-base">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 text-red-600 mb-3">
          <AlertCircle className="w-5 h-5" />
          <h3 className="text-base font-semibold">Error al cargar usuarios</h3>
        </div>
        <p className="text-gray-700 mb-3 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#2e4b30] text-[#f5efe1] px-5 py-1.5 rounded-sm text-sm font-medium hover:bg-[#1a3a1c] transition-colors duration-200"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#2e4b30]">Gestión de Usuarios</h2>
            <p className="text-xs text-gray-600">
              {users.length} {users.length === 1 ? "usuario registrado" : "usuarios registrados"}
            </p>
          </div>
        </div>
        
        {/* Botón para eliminar todos los usuarios excepto admin */}
        {users.filter(u => u.role !== 'admin').length > 0 && (
          <button
            onClick={() => setShowDeleteAllConfirm(true)}
            disabled={deleteAllLoading}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteAllLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Eliminar Todos los Clientes
          </button>
        )}
      </div>

      {/* Modal de confirmación para eliminar todos */}
      {showDeleteAllConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Confirmar Eliminación Masiva</h3>
            </div>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que quieres eliminar a todos los usuarios clientes? 
              Se eliminarán {users.filter(u => u.role !== 'admin').length} usuarios. 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteAllConfirm(false)}
                disabled={deleteAllLoading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAllUsers}
                disabled={deleteAllLoading}
                className="bg-red-500 text-white px-4 py-2 rounded-sm hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleteAllLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                Eliminar Todos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de usuarios */}
      {users.length === 0 ? (
        <div className="text-center py-10">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-base">No hay usuarios registrados</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#2e4b30]">Usuario</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#2e4b30]">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#2e4b30]">Rol</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#2e4b30]">Registrado</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#2e4b30]">Ubicación</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#2e4b30]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr
                  key={userItem.id}
                  className="border-b border-gray-100 hover:bg-[#f5efe1] hover:bg-opacity-30 transition-colors duration-150"
                >
                  {/* Columna Usuario */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#2e4b30] bg-opacity-10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {userItem.role === "admin" ? (
                          <Image src="/admin-logo.png" alt="Admin avatar" width={40} height={40} className="object-contain" />
                        ) : (
                          <UserIcon className="w-5 h-5 text-[#2e4b30]" />
                        )}
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">
                          {userItem.name} {userItem.surname}
                        </p>
                        <p className="text-xs text-gray-500">ID: {userItem.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>

                  {/* Columna Email */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{userItem.email}</span>
                    </div>
                  </td>

                  {/* Columna Rol */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(userItem.role)}`}
                    >
                      {userItem.role === "admin" && <Shield className="w-3 h-3" />}
                      {getRoleDisplay(userItem.role)}
                    </span>
                  </td>

                  {/* Columna Fecha de registro */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {formatDate(userItem.createdAt, { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </td>

                  {/* Columna Ubicación */}
                  <td className="py-4 px-4">
                    {userItem.city && userItem.country ? (
                      <span className="text-sm text-gray-600">
                        {userItem.city}, {userItem.country}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400 italic">No especificada</span>
                    )}
                  </td>

                  {/* Columna Acciones */}
                  <td className="py-4 px-4">
                    {userItem.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteUser(userItem.id, `${userItem.name} ${userItem.surname}`)}
                        disabled={deleteLoading === userItem.id}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Eliminar usuario"
                      >
                        {deleteLoading === userItem.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
