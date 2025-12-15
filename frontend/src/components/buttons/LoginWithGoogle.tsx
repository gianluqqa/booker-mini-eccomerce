import React from "react";
import { useRouter } from "next/navigation";
import { loginWithGoogle } from "@/services/firebaseAuth";
import { apiClient } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { IUser } from "@/types/User";

const LoginWithGoogle: React.FC = () => {
  const router = useRouter();
  const { setAuthFromExternal } = useAuth();

  const handleLogin = async () => {
    try {
      // 1) Login en Firebase (popup)
      const firebaseUser = await loginWithGoogle();

      if (!firebaseUser.email) {
        console.error("El usuario de Firebase no tiene email");
        return;
      }

      // Obtener name y surname a partir de displayName (si existe)
      const displayName = firebaseUser.displayName || "";
      const [name, ...rest] = displayName.split(" ");
      const surname = rest.join(" ");

      // 2) Avisar al backend para crear/buscar usuario y emitir JWT
      const response = await apiClient.post<IUser & { accessToken: string }>(
        "/users/firebase-login",
        {
          email: firebaseUser.email,
          name: name || "Usuario",
          surname: surname || "Google",
        }
      );

      const { accessToken, ...userData } = response.data;

      // 3) Guardar usuario y token en el contexto de auth
      setAuthFromExternal(userData, accessToken);

      // 4) Redirigir según rol
      const redirectPath = userData.role === "admin" ? "/admin" : "/profile";
      router.push(redirectPath);
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="w-full mt-4 inline-flex items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4]"
    >
      {/* Icono de Google estilo oficial (G multicolor simplificada) */}
      <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="h-5 w-5"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.15 0 5.3 1.37 6.52 2.52l4.77-4.77C32.81 4.06 28.78 2 24 2 15.64 2 8.56 6.88 5.38 14.02l5.77 4.49C12.78 13.02 17.88 9.5 24 9.5z"
          />
          <path
            fill="#34A853"
            d="M46.5 24.5c0-1.57-.14-2.72-.44-3.91H24v7.42h12.9c-.26 1.86-1.66 4.66-4.78 6.54l7.37 5.71C43.89 35.83 46.5 30.79 46.5 24.5z"
          />
          <path
            fill="#4A90E2"
            d="M11.15 28.51A11.52 11.52 0 0 1 10.5 24c0-1.57.27-3.08.72-4.51l-5.84-4.54A19.443 19.443 0 0 0 2.5 24c0 3.18.76 6.18 2.08 8.82l6.57-4.31z"
          />
          <path
            fill="#FBBC05"
            d="M24 46c5.4 0 9.94-1.77 13.25-4.82l-7.37-5.71C28.3 36.66 26.36 37.5 24 37.5c-6.12 0-11.22-3.52-13.15-8.99l-6.57 4.31C8.56 41.12 15.64 46 24 46z"
          />
          <path fill="none" d="M2 2h44v44H2z" />
        </svg>
      </span>
      <span>Continuar con Google</span>
    </button>
  );
};

export default LoginWithGoogle;
