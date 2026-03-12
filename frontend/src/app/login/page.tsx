"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ILoginUser } from "@/types/User";
import Link from "next/link";
import LoginWithGoogle from "@/components/buttons/LoginWithGoogle";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState<ILoginUser>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const getRedirectPath = () => {
    return user?.role === "admin" ? "/admin" : "/profile";
  };

  // Redirigir si ya está autenticado
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push(getRedirectPath());
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    // 1. Validar campos obligatorios en el Frontend
    let hasErrors = false;
    const newFieldErrors: any = {};

    if (!formData.email.trim()) {
      newFieldErrors.email = "El email es obligatorio";
      hasErrors = true;
    }

    if (!formData.password.trim()) {
      newFieldErrors.password = "La contraseña es obligatoria";
      hasErrors = true;
    }

    if (hasErrors) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setLoading(true);

    try {
      await login(formData);
      router.push(getRedirectPath());
    } catch (err: any) {
      const backendMessage = err.response?.data?.message || err.message || "Error al iniciar sesión";
      
      // Mapeo exacto basado en el contrato del Backend
      if (err.response?.status === 400 || err.response?.status === 401) {
        if (backendMessage.includes('email') || backendMessage.includes('encontrado')) {
          setFieldErrors({ email: backendMessage });
        } else if (backendMessage.includes('ontraseña') || backendMessage.includes('incorrecta')) {
          setFieldErrors({ password: backendMessage });
        } else {
          setError(backendMessage);
        }
      } else {
        setError(backendMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Limpiar error del campo al escribir
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: undefined
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5efe1] pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-[#2c3e50]">Iniciar Sesión</h1>

          {error && Object.keys(fieldErrors).length === 0 && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] text-gray-900 placeholder:text-gray-400 bg-white transition-all ${
                  fieldErrors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                }`}
                placeholder="tu@email.com"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs font-semibold text-red-600 animate-fade-in-up">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 pr-16 border rounded-md focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] text-gray-900 placeholder:text-gray-400 bg-white transition-all ${
                    fieldErrors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-medium text-gray-600 hover:text-gray-900"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs font-semibold text-red-600 animate-fade-in-up">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2e4b30] text-[#f5efe1] py-2 px-4 rounded-md hover:bg-[#1a3a1c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>

            <LoginWithGoogle />
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="text-[#2e4b30] hover:text-[#1a3a1c] hover:underline font-medium">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
