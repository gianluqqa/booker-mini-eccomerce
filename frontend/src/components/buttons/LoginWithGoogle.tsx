import React from "react";
import { loginWithGoogle } from "@/services/firebaseAuth";

const LoginWithGoogle: React.FC = () => {
  const handleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      console.log("Usuario logueado:", user);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return <button onClick={handleLogin}>Iniciar sesión con Google</button>;
};

export default LoginWithGoogle;
