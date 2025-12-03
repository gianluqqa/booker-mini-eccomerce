import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA3mmhT7tetqs3YKPqwvkp3bAfoXirfiU8",
  authDomain: "booker-mini-ecommerce.firebaseapp.com",
  projectId: "booker-mini-ecommerce",
  storageBucket: "booker-mini-ecommerce.firebasestorage.app",
  messagingSenderId: "184424003568",
  appId: "1:184424003568:web:2cce4128dc681e715d0f35",
  measurementId: "G-K4038YVVC6"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth
export const auth = getAuth(app);

// Provider de Google
export const googleProvider = new GoogleAuthProvider();
