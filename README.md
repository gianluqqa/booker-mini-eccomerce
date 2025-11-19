# Booker Mini E-commerce 🛒📚

Un mini e-commerce de libros con backend Node.js/TypeScript y frontend Next.js, orquestado desde la raíz del proyecto.

## 🏗️ Estructura del Proyecto

```
booker-mini-ecommerce/
├── backend/          # API REST con Node.js, TypeScript, TypeORM
│   └── package.json  # Dependencias y scripts del backend
├── frontend/         # Frontend con Next.js, React, Tailwind CSS
│   └── package.json  # Dependencias y scripts del frontend
├── docs/             # Documentación del proyecto
```

## 🚀 Comandos Principales

### Desarrollo
```bash
# Ejecutar ambos servicios simultáneamente
npm run dev

# Ejecutar servicios individualmente
npm run dev:backend   # Solo backend (puerto 3001)
npm run dev:frontend  # Solo frontend (puerto 3000)
```

### Instalación
```bash
# Instalar todas las dependencias del proyecto
npm run install:all
```

### Testing
```bash
# Tests del backend
npm run test
npm run test:watch
npm run test:coverage
npm run test:integration

# Linting
npm run lint          # Frontend
npm run lint:backend  # Backend (si existe)
```

### Build y Producción
```bash
# Construir ambos proyectos
npm run build

# Ejecutar en producción
npm run start         # Solo backend
npm run start:frontend # Solo frontend
npm run start:backend  # Solo backend
```

### Deploy
```bash
# Deploy individual
npm run deploy:frontend
npm run deploy:backend
```

### Utilidades
```bash
# Limpiar todo
npm run clean

# Limpiar e instalar todo de nuevo
npm run clean:install

# Seed de datos
npm run seed:books
```

## 📦 Gestión de Dependencias

### Agregar dependencias
```bash
# Al backend
cd backend && npm install <paquete>

# Al frontend
cd frontend && npm install <paquete>

# Al orquestador (solo herramientas de desarrollo)
npm install <paquete> --save-dev
```

## 🎯 Puertos

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 🛠️ Tecnologías

### Backend
- Node.js + TypeScript
- Express.js
- TypeORM + PostgreSQL
- Jest para testing
- JWT para autenticación

### Frontend
- Next.js 15
- React 19
- Tailwind CSS
- TypeScript

## 📝 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Ejecuta backend y frontend juntos |
| `npm run dev:backend` | Solo backend |
| `npm run dev:frontend` | Solo frontend |
| `npm run build` | Construye ambos proyectos |
| `npm run start` | Ejecuta ambos en producción |
| `npm run test` | Tests del backend |
| `npm run lint` | Linting del frontend |
| `npm run install:all` | Instala todas las dependencias |
| `npm run clean` | Limpia node_modules |
| `npm run clean:install` | Limpia e instala todo |

## 🔄 Flujo de Desarrollo

1. **Clonar el repositorio**
2. **Instalar dependencias**: `npm run install:all`
3. **Configurar variables de entorno** (ver archivos `.env.example` en cada workspace)
4. **Ejecutar en desarrollo**: `npm run dev`
5. **Desarrollar** en `frontend/` y `backend/`
6. **Ejecutar tests**: `npm run test`
7. **Build para producción**: `npm run build`

## 📚 Documentación Adicional

- [Plan de Testing](./docs/test-plan.md)
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
