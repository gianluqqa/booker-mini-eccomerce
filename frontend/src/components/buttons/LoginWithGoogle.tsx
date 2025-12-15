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

      // 4) Redirigir al perfil
      router.push("/profile");
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="w-full mt-4 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
    >
      <span>Logueo con Google</span>
    </button>
  );
};

export default LoginWithGoogle;
