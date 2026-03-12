"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { IRegisterUser } from '@/types/User';
import Link from 'next/link';
import SuccessAlert from '@/components/alerts/SuccessAlert';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState<IRegisterUser>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    surname: '',
    address: '',
    country: '',
    city: '',
    phone: '',
    gender: 'not_specific',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; name?: string; surname?: string }>({});

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
    setError('');
    setFieldErrors({});

    // 1. Validar campos obligatorios vacíos y formato
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    let hasErrors = false;
    const newFieldErrors: any = {};

    if (!formData.name.trim()) {
      newFieldErrors.name = "El nombre solo puede contener letras y espacios";
      hasErrors = true;
    } else if (!nameRegex.test(formData.name)) {
      newFieldErrors.name = "El nombre solo puede contener letras y espacios";
      hasErrors = true;
    }

    if (!formData.surname.trim()) {
      newFieldErrors.surname = "El apellido solo puede contener letras y espacios";
      hasErrors = true;
    } else if (!nameRegex.test(formData.surname)) {
      newFieldErrors.surname = "El apellido solo puede contener letras y espacios";
      hasErrors = true;
    }

    if (!formData.email.trim()) {
      newFieldErrors.email = "El email es obligatorio";
      hasErrors = true;
    }

    if (!formData.password.trim()) {
      newFieldErrors.password = "La contraseña es obligatoria";
      hasErrors = true;
    }

    if (!formData.confirmPassword.trim()) {
      newFieldErrors.confirmPassword = "La confirmación es obligatoria";
      hasErrors = true;
    }

    // 2. Validar complejidad de contraseña (solo si no está vacía)
    if (formData.password.trim()) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        newFieldErrors.password = "La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número";
        hasErrors = true;
      } else if (formData.password !== formData.confirmPassword) {
        newFieldErrors.confirmPassword = 'Las contraseñas no coinciden';
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      const backendMessage = err.response?.data?.message || err.message || 'Error al registrar usuario';
      
      // Mapeo exacto basado en el nuevo contrato del Backend
      if (err.response?.status === 400 || err.response?.status === 409) {
        if (backendMessage.includes("email") || backendMessage.includes("Ya existe")) {
          setFieldErrors({ email: backendMessage });
        } else if (backendMessage.includes("nombre")) {
          setFieldErrors({ name: backendMessage });
        } else if (backendMessage.includes("apellido")) {
          setFieldErrors({ surname: backendMessage });
        } else if (backendMessage.includes("contraseña") || backendMessage.includes("mayúscula")) {
          setFieldErrors({ password: backendMessage });
        } else if (backendMessage.includes("coinciden")) {
          setFieldErrors({ confirmPassword: backendMessage });
        } else {
          setError(backendMessage);
        }
      } else {
        setError(backendMessage);
      }
      setLoading(false);
    }
    // No ponemos loading(false) en el finally si hubo éxito para evitar que el usuario intente registrarse de nuevo
    // mientras ve la alerta de éxito.
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-[#2c3e50]">
            Crear Cuenta
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700">
              {error}
            </div>
          )}


          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                 <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] text-gray-900 placeholder:text-gray-500 bg-white transition-all ${
                    fieldErrors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Juan"
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs font-semibold text-red-600 animate-fade-in-up">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] text-gray-900 placeholder:text-gray-500 bg-white transition-all ${
                    fieldErrors.surname ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Pérez"
                />
                {fieldErrors.surname && (
                  <p className="mt-1 text-xs font-semibold text-red-600 animate-fade-in-up">
                    {fieldErrors.surname}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] text-gray-900 placeholder:text-gray-500 bg-white ${
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] text-gray-900 placeholder:text-gray-500 bg-white transition-all ${
                    fieldErrors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-xs font-semibold text-red-600 animate-fade-in-up">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] text-gray-900 placeholder:text-gray-500 bg-white transition-all ${
                    fieldErrors.confirmPassword ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-xs font-semibold text-red-600 animate-fade-in-up">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] text-gray-900 placeholder:text-gray-500 bg-white"
                placeholder="Ej: Av. Siempreviva 742"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  País
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] text-gray-900 placeholder:text-gray-500 bg-white"
                  placeholder="Ej: Argentina"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] text-gray-900 placeholder:text-gray-500 bg-white"
                  placeholder="Ej: Springfield"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] text-gray-900 placeholder:text-gray-500 bg-white"
                placeholder="Ej: 1122334455"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Género
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] text-gray-900 bg-white"
              >
                <option value="male">Hombre</option>
                <option value="female">Mujer</option>
                <option value="not_specific">Prefiero no especificar</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2e4b30] text-[#f5efe1] py-2 px-4 rounded-md hover:bg-[#1a3a1c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          {showSuccess && (
            <div className="mt-6">
              <SuccessAlert 
                title="Cuenta creada con éxito" 
                message="Tu cuenta ha sido registrada correctamente. Redirigiendo al inicio de sesión..." 
              />
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="text-[#2e4b30] hover:text-[#1a3a1c] hover:underline font-medium">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
