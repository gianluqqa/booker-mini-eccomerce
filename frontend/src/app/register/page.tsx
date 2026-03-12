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
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string; name?: string; surname?: string }>({});

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

    // Validar nombre y apellido (solo letras)
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    let hasErrors = false;
    const newFieldErrors: any = {};

    if (!nameRegex.test(formData.name)) {
      newFieldErrors.name = "El nombre solo puede contener letras y espacios";
      hasErrors = true;
    }

    if (!nameRegex.test(formData.surname)) {
      newFieldErrors.surname = "El apellido solo puede contener letras y espacios";
      hasErrors = true;
    }

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      hasErrors = true;
    }

    if (hasErrors) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      setShowSuccess(true);
      // Esperar 3 segundos para que el usuario vea la alerta
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      const backendMessage = err.response?.data?.message || err.message || 'Error al registrar usuario';
      
      // Manejar errores de validación
      if (err.response?.status === 400 || err.response?.status === 409) {
        const msg = backendMessage.toLowerCase();
        if (msg.includes('email') || msg.includes('duplicado')) {
          setFieldErrors({ email: 'Este email ya se encuentra registrado, por favor intenta con otro o inicia sesión' });
        } else if (msg.includes('nombre')) {
          setFieldErrors({ name: backendMessage });
        } else if (msg.includes('apellido')) {
          setFieldErrors({ surname: backendMessage });
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


          <form onSubmit={handleSubmit} className="space-y-4">
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
                  required
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
                  required
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
                  required
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
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] text-gray-900 placeholder:text-gray-500 bg-white"
                  placeholder="••••••••"
                />
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
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] text-gray-900 placeholder:text-gray-500 bg-white"
                  placeholder="••••••••"
                />
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
