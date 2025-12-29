import { Router } from "express";
import { getUserByIdController, getUsersController, loginUserController, registerUserController, updateUserController, getCurrentUserController, firebaseLoginController } from "../controllers/users-controllers";
import { authenticateJWT, requireAdmin } from "../middlewares/auth";

const userRoutes = Router();

userRoutes.post("/register", registerUserController); //? Registrar un nuevo usuario. (Route: POST http://localhost:5000/users/register)
userRoutes.post("/login", loginUserController); //? Iniciar sesión. (Route: POST http://localhost:5000/users/login)
userRoutes.post("/firebase-login", firebaseLoginController); //? Login/register con Firebase. (Route: POST http://localhost:5000/users/firebase-login)
userRoutes.get("/me", authenticateJWT, getCurrentUserController); //? Obtener el usuario actual. (Route: GET http://localhost:5000/users/me)
userRoutes.get("/", authenticateJWT, requireAdmin, getUsersController); //? Obtener todos los usuarios. (Route: GET http://localhost:5000/users/)
userRoutes.get("/:id", authenticateJWT, requireAdmin, getUserByIdController); //? Obtener un usuario por ID. (Route: GET http://localhost:5000/users/:id)
userRoutes.put("/:id", authenticateJWT, updateUserController); //? Actualizar un usuario. (Route: PUT http://localhost:5000/users/:id)

export default userRoutes;

/*
========================================
POSTMAN EXAMPLES
========================================

1. REGISTRAR USUARIO
URL: http://localhost:5000/users/register
Method: POST
Headers:
  Content-Type: application/json

Body (JSON):
{
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "confirmPassword": "password123",
  "name": "Juan",
  "surname": "Pérez",
  "address": "Calle 123",
  "country": "Argentina",
  "city": "Buenos Aires",
  "phone": "11987654321",
  "bio": "Descripción del usuario",
  "gender": "MALE",
  "role": "CUSTOMER"
}

Response Expected (201):
{
  "id": "uuid-usuario",
  "email": "usuario@ejemplo.com",
  "name": "Juan",
  "surname": "Pérez",
  "role": "CUSTOMER",
  "createdAt": "2024-01-01T12:00:00.000Z"
}

========================================

2. INICIAR SESIÓN
URL: http://localhost:5000/users/login
Method: POST
Headers:
  Content-Type: application/json

Body (JSON):
{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}

Response Expected (200):
{
  "user": {
    "id": "uuid-usuario",
    "email": "usuario@ejemplo.com",
    "name": "Juan",
    "surname": "Pérez",
    "role": "CUSTOMER"
  },
  "accessToken": "jwt-token-123456"
}

Error Response (401):
{
  "success": false,
  "message": "Credenciales inválidas"
}

========================================

3. LOGIN CON FIREBASE
URL: http://localhost:5000/users/firebase-login
Method: POST
Headers:
  Content-Type: application/json

Body (JSON):
{
  "email": "usuario@ejemplo.com",
  "name": "Juan",
  "surname": "Pérez"
}

Response Expected (200):
{
  "user": {
    "id": "uuid-usuario",
    "email": "usuario@ejemplo.com",
    "name": "Juan",
    "surname": "Pérez",
    "role": "CUSTOMER"
  },
  "accessToken": "jwt-token-123456"
}

========================================

4. OBTENER USUARIO ACTUAL
URL: http://localhost:5000/users/me
Method: GET
Headers:
  Content-Type: application/json
  Authorization: Bearer <JWT_TOKEN>

Response Expected (200):
{
  "id": "uuid-usuario",
  "email": "usuario@ejemplo.com",
  "name": "Juan",
  "surname": "Pérez",
  "address": "Calle 123",
  "country": "Argentina",
  "city": "Buenos Aires",
  "phone": "11987654321",
  "bio": "Descripción del usuario",
  "gender": "MALE",
  "role": "CUSTOMER",
  "createdAt": "2024-01-01T12:00:00.000Z"
}

========================================

5. ACTUALIZAR USUARIO
URL: http://localhost:5000/users/uuid-usuario
Method: PUT
Headers:
  Content-Type: application/json
  Authorization: Bearer <JWT_TOKEN>

Body (JSON):
{
  "name": "Juan Carlos",
  "surname": "Pérez García",
  "address": "Avenida 456",
  "country": "Argentina",
  "city": "Córdoba",
  "phone": "11987654322",
  "bio": "Nueva descripción",
  "gender": "MALE"
}

Response Expected (200):
{
  "id": "uuid-usuario",
  "email": "usuario@ejemplo.com",
  "name": "Juan Carlos",
  "surname": "Pérez García",
  "address": "Avenida 456",
  "country": "Argentina",
  "city": "Córdoba",
  "phone": "11987654322",
  "bio": "Nueva descripción",
  "gender": "MALE",
  "role": "CUSTOMER",
  "createdAt": "2024-01-01T12:00:00.000Z"
}

========================================

6. OBTENER TODOS LOS USUARIOS (SOLO ADMIN)
URL: http://localhost:5000/users/
Method: GET
Headers:
  Content-Type: application/json
  Authorization: Bearer <ADMIN_JWT_TOKEN>

Response Expected (200):
[
  {
    "id": "uuid-usuario1",
    "email": "admin@ejemplo.com",
    "name": "Admin",
    "surname": "User",
    "role": "ADMIN"
  },
  {
    "id": "uuid-usuario2",
    "email": "cliente@ejemplo.com",
    "name": "Cliente",
    "surname": "User",
    "role": "CUSTOMER"
  }
]

========================================

NOTES:
========================================
1. Los endpoints /register, /login, /firebase-login son públicos
2. Los demás endpoints requieren autenticación JWT
3. Los endpoints / y /:id requieren rol ADMIN
4. El JWT_TOKEN se obtiene del endpoint de login
5. Para actualizar usuario, solo se pueden modificar los campos propios
6. El email y role no se pueden modificar
*/
