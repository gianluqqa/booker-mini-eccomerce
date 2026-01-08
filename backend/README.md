# 📚 Booker - Backend API

API REST para un sistema de e-commerce de libros desarrollado con Node.js, Express, TypeScript y TypeORM.

## 📋 Tabla de Contenidos

- [Estructura del Proyecto](#estructura-del-proyecto)
- [Entidades](#entidades)
- [Enums](#enums)
- [DTOs](#dtos)
- [Rutas y Endpoints](#rutas-y-endpoints)
- [Servicios](#servicios)
- [Controladores](#controladores)
- [Middlewares](#middlewares)
- [Configuración](#configuración)

---

## 🗂️ Estructura del Proyecto

```
backend/src/
├── config/           # Configuración de base de datos
├── controllers/     # Controladores (lógica de request/response)
├── services/        # Lógica de negocio
├── routes/          # Definición de rutas
├── entities/        # Entidades de TypeORM
├── dto/             # Data Transfer Objects
├── middlewares/     # Middlewares (auth, validaciones)
├── enums/           # Enumeraciones
├── helpers/         # Funciones auxiliares
├── seeds/           # Datos de prueba
└── server.ts        # Punto de entrada de la aplicación
```

---

## 🗄️ Entidades

### User
**Archivo:** `src/entities/User.ts`

- `id` (UUID): Identificador único
- `email` (string, unique): Email del usuario
- `password` (string): Contraseña hasheada
- `name` (string): Nombre
- `surname` (string): Apellido
- `address` (string, nullable): Dirección
- `country` (string, nullable): País
- `city` (string, nullable): Ciudad
- `phone` (string, nullable): Teléfono
- `role` (UserRole): Rol del usuario (CUSTOMER | ADMIN)
- `orders` (OneToMany): Relación con Order
- `carts` (OneToMany): Relación con Cart
- `createdAt` (Date): Fecha de creación
- `updatedAt` (Date): Fecha de actualización

### Book
**Archivo:** `src/entities/Book.ts`

- `id` (UUID): Identificador único
- `title` (string): Título del libro
- `image` (string, nullable): URL de la imagen
- `author` (string): Autor
- `price` (decimal): Precio
- `stock` (number): Stock disponible
- `genre` (string): Género
- `intro` (string, nullable): Introducción
- `description` (string): Descripción
- `orderItems` (OneToMany): Relación con OrderItem
- `carts` (OneToMany): Relación con Cart

### Cart
**Archivo:** `src/entities/Cart.ts`

- `id` (UUID): Identificador único
- `user` (ManyToOne): Usuario propietario
- `book` (ManyToOne): Libro en el carrito
- `quantity` (number): Cantidad (default: 1)
- `createdAt` (Date): Fecha de creación
- `updatedAt` (Date): Fecha de actualización

### Order
**Archivo:** `src/entities/Order.ts`

- `id` (UUID): Identificador único
- `user` (ManyToOne): Usuario que realizó la orden
- `items` (OneToMany): Items de la orden
- `status` (OrderStatus): Estado de la orden
- `createdAt` (Date): Fecha de creación

### OrderItem
**Archivo:** `src/entities/OrderItem.ts`

- `id` (UUID): Identificador único
- `order` (ManyToOne): Orden a la que pertenece
- `book` (ManyToOne): Libro comprado
- `quantity` (number): Cantidad comprada
- `price` (decimal): **Precio total del item** (precio unitario × cantidad) al momento de la compra

### Genre
**Archivo:** `src/entities/Genre.ts`

- `id` (UUID): Identificador único
- `name` (string): Nombre del género

---

## 🔢 Enums

### UserRole
**Archivo:** `src/enums/UserRole.ts`

```typescript
enum UserRole {
  CUSTOMER = "customer",
  ADMIN = "admin"
}
```

### OrderStatus
**Archivo:** `src/enums/OrderStatus.ts`

```typescript
enum OrderStatus {
  PENDING = "pending",
  PAID = "paid",
  EXPIRED = "expired",
  CANCEL = "cancel"
}
```

---

## 📦 DTOs

### UserDto
**Archivo:** `src/dto/UserDto.ts`

- `RegisterUserDTO`: Datos para registro
- `LoginUserDTO`: Datos para login
- `UpdateUserDTO`: Datos para actualización
- `UserDto`: Usuario sin contraseña

### BookDto
**Archivo:** `src/dto/BookDto.ts`

- `BookDto`: Estructura de respuesta de libro
- `CreateBookDto`: Datos para crear libro
- `UpdateBookDto`: Datos para actualizar libro

### CartDto
**Archivo:** `src/dto/CartDto.ts`

- `AddToCartDto`: `{ bookId: string, quantity?: number }`
- `UpdateCartDto`: `{ quantity: number }`
- `CartItemDto`: Item del carrito con información del libro
- `CartResponseDto`: Respuesta completa del carrito con totales

### GenresDto
**Archivo:** `src/dto/GenresDto.ts`

- `GenresDto`: Estructura de género

### OrderDto / OrderItemDto
**Archivos:** `src/dto/OrderDto.ts`, `src/dto/OrderItemDto.ts`

- Estructuras para órdenes (actualmente no implementadas en servicios)

---

## 🛣️ Rutas y Endpoints

### Base URL
```
http://localhost:5000
```

### Users (`/users`)

| Método | Ruta | Descripción | Auth | Admin |
|--------|------|-------------|------|-------|
| POST | `/users/register` | Registrar nuevo usuario | ❌ | ❌ |
| POST | `/users/login` | Iniciar sesión | ❌ | ❌ |
| GET | `/users` | Obtener todos los usuarios | ✅ | ✅ |
| GET | `/users/:id` | Obtener usuario por ID | ✅ | ✅ |
| PUT | `/users/:id` | Actualizar usuario | ✅ | ❌ |

### Books (`/books`)

| Método | Ruta | Descripción | Auth | Admin |
|--------|------|-------------|------|-------|
| GET | `/books` | Obtener todos los libros (con búsqueda opcional `?q=`) | ❌ | ❌ |
| GET | `/books/genres` | Obtener todos los géneros | ❌ | ❌ |
| GET | `/books/:id` | Obtener libro por ID | ❌ | ❌ |
| POST | `/books` | Crear nuevo libro | ✅ | ✅ |
| PUT | `/books/:id` | Actualizar libro | ✅ | ✅ |
| DELETE | `/books/:id` | Eliminar libro | ✅ | ✅ |

### Carts (`/carts`)

| Método | Ruta | Descripción | Auth | Admin |
|--------|------|-------------|------|-------|
| POST | `/carts/add` | Añadir libro al carrito | ✅ | ❌ |
| GET | `/carts` | Obtener carrito del usuario | ✅ | ❌ |
| PUT | `/carts/:cartId` | Actualizar cantidad de un item | ✅ | ❌ |
| DELETE | `/carts/:cartId` | Eliminar item del carrito | ✅ | ❌ |
| DELETE | `/carts` | Limpiar todo el carrito | ✅ | ❌ |
| POST | `/carts/checkout` | Convertir carrito a orden | ✅ | ❌ |

---

## 🔧 Servicios

### Users Services
**Archivo:** `src/services/users-services.ts`

- `registerUserService(user: RegisterUserDTO)`: Registra un nuevo usuario
- `loginUserService(user: LoginUserDTO)`: Autentica usuario y retorna token
- `getUsersService()`: Obtiene todos los usuarios
- `getUserByIdService(id: string)`: Obtiene usuario por ID
- `updateUserService(id: string, user: UpdateUserDTO)`: Actualiza usuario

### Books Services
**Archivo:** `src/services/books-services.ts`

- `getBooksService(query?: string)`: Obtiene todos los libros (con búsqueda opcional)
- `getBookByIdService(id: string)`: Obtiene libro por ID
- `createBookService(book: CreateBookDto)`: Crea un nuevo libro
- `updateBookService(book: UpdateBookDto)`: Actualiza un libro
- `deleteBookService(id: string)`: Elimina un libro

### Carts Services
**Archivo:** `src/services/carts-services.ts`

- `addBookToCartService(userId: string, addToCartDto: AddToCartDto)`: Añade libro al carrito o incrementa cantidad
- `getUserCartService(userId: string)`: Obtiene el carrito completo con totales
- `updateCartItemQuantityService(userId: string, cartId: string, updateCartDto: UpdateCartDto)`: Actualiza cantidad
- `removeBookFromCartService(userId: string, cartId: string)`: Elimina un item del carrito
- `clearCartService(userId: string)`: Limpia todo el carrito
- `checkoutCartService(userId: string)`: Convierte carrito a orden, actualiza stock y limpia carrito

### Genres Services
**Archivo:** `src/services/genres-services.ts`

- `getAllGenresServices()`: Obtiene todos los géneros

---

## 🎮 Controladores

### Users Controllers
**Archivo:** `src/controllers/users-controllers.ts`

- `registerUserController`: Maneja registro de usuarios
- `loginUserController`: Maneja login y retorna token
- `getUsersController`: Retorna lista de usuarios (solo admin)
- `getUserByIdController`: Retorna usuario por ID (solo admin)
- `updateUserController`: Actualiza datos del usuario

### Books Controllers
**Archivo:** `src/controllers/books-controllers.ts`

- `getBooksController`: Retorna lista de libros con búsqueda opcional
- `getBookByIdController`: Retorna libro por ID
- `createBookController`: Crea nuevo libro (solo admin)
- `updateBookController`: Actualiza libro (solo admin)
- `deleteBookController`: Elimina libro (solo admin)

### Carts Controllers
**Archivo:** `src/controllers/carts-controllers.ts`

- `addBookToCartController`: Añade libro al carrito
- `getUserCartController`: Retorna carrito del usuario con totales
- `updateCartItemQuantityController`: Actualiza cantidad de un item
- `removeBookFromCartController`: Elimina item del carrito
- `clearCartController`: Limpia todo el carrito
- `checkoutCartController`: Convierte carrito a orden

### Genres Controllers
**Archivo:** `src/controllers/genres-controllers.ts`

- `getAllGenresController`: Retorna todos los géneros

---

## 🛡️ Middlewares

### Auth Middleware
**Archivo:** `src/middlewares/auth.ts`

- `authenticateJWT`: Verifica token JWT y añade `authUser` al request
  - Extrae token del header `Authorization: Bearer <token>`
  - Verifica y decodifica el token
  - Añade `req.authUser = { id, role }`
  
- `requireAdmin`: Verifica que el usuario sea administrador
  - Debe usarse después de `authenticateJWT`
  - Retorna 403 si el usuario no es admin

### Validation Middlewares
**Archivo:** `src/middlewares/validateBook.ts`

- `validateBook(body, req)`: Valida datos para crear libro
- `validateUpdateBook(data, req)`: Valida datos para actualizar libro
- `validateDeleteBook(req)`: Valida permisos para eliminar libro

**Archivo:** `src/middlewares/validateUser.ts`

- Funciones de validación para usuarios

---

## ⚙️ Configuración

### Data Source
**Archivo:** `src/config/data-source.ts`

Configuración de TypeORM con PostgreSQL:
- Host: `process.env.DB_HOST` (default: localhost)
- Port: `process.env.DB_PORT` (default: 5432)
- Database: `process.env.DB_NAME` (default: booker)
- Username: `process.env.DB_USERNAME` (default: postgres)
- Password: `process.env.DB_PASSWORD`
- Synchronize: `true` (solo desarrollo)

### Server
**Archivo:** `src/server.ts`

- Puerto: `process.env.PORT` (default: 5000)
- Middlewares: CORS, Morgan, Express JSON
- Rutas registradas:
  - `/users` → userRoutes
  - `/books` → booksRoutes
  - `/carts` → cartRoutes

---

## 🔐 Autenticación

### Flujo de Autenticación

1. **Registro/Login**: El usuario se registra o inicia sesión
2. **Token JWT**: Se genera un token con `{ sub: userId, role: userRole }`
3. **Uso del Token**: Se envía en el header `Authorization: Bearer <token>`
4. **Validación**: El middleware `authenticateJWT` valida el token
5. **Usuario Autenticado**: Se añade `req.authUser = { id, role }`

### Ejemplo de Uso

```javascript
// Login
POST /users/login
Body: { "email": "user@example.com", "password": "password123" }
Response: { ..., "accessToken": "eyJhbGci..." }

// Usar token en requests
GET /carts
Headers: { "Authorization": "Bearer eyJhbGci..." }
```

---

## 📝 Notas Importantes

### Carrito y Órdenes

- El carrito se limpia automáticamente después de un checkout exitoso
- El stock se actualiza inmediatamente al hacer checkout
- El precio en `OrderItem.price` es el **precio total** (unitario × cantidad) al momento de la compra
- Las órdenes se crean con estado `PENDING` por defecto

### Validaciones

- Todos los endpoints de carrito requieren autenticación
- Los endpoints de creación/actualización/eliminación de libros requieren rol ADMIN
- Las validaciones de stock se realizan antes de añadir al carrito y antes del checkout

### Respuestas

Todas las respuestas siguen el formato:
```json
{
  "success": true/false,
  "message": "Mensaje descriptivo",
  "data": { ... }
}
```

---

## 🚀 Iniciar el Proyecto

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno (.env)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu-password
DB_NAME=example
JWT_SECRET=tu-secret-key
PORT=5000

# Ejecutar en desarrollo
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar producción
npm start
```

---

## 📊 Base de Datos

### Relaciones

- **User** → **Cart** (OneToMany)
- **User** → **Order** (OneToMany)
- **Book** → **Cart** (OneToMany)
- **Book** → **OrderItem** (OneToMany)
- **Order** → **OrderItem** (OneToMany)
- **Cart** → **User** (ManyToOne)
- **Cart** → **Book** (ManyToOne)
- **Order** → **User** (ManyToOne)
- **OrderItem** → **Order** (ManyToOne)
- **OrderItem** → **Book** (ManyToOne)

---

## 🔄 Flujo de Checkout

1. Usuario añade libros al carrito (`POST /carts/add`)
2. Usuario revisa su carrito (`GET /carts`)
3. Usuario hace checkout (`POST /carts/checkout`):
   - Se valida stock disponible
   - Se crea la orden con estado `PENDING`
   - Se crean los `OrderItem` con precio total
   - Se actualiza el stock de los libros
   - Se limpia el carrito
4. Se retorna la orden creada

---

## 📌 Próximas Mejoras

- [ ] Endpoints para gestionar órdenes (listar, actualizar estado)
- [ ] Endpoint para obtener historial de órdenes del usuario
- [ ] Validación de email único en registro
- [ ] Recuperación de contraseña
- [ ] Paginación en listados
- [ ] Filtros avanzados en búsqueda de libros
- [ ] Sistema de reviews/ratings
- [ ] Notificaciones por email

---

**Última actualización:** Enero 2024

