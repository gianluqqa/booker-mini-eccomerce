# Tests de Integración - Proyecto Booker

## 🎯 ¿Qué son los Tests de Integración?

Los **tests de integración** son pruebas que verifican que múltiples componentes del sistema funcionen correctamente **juntos**. A diferencia de los tests unitarios (que prueban funciones individuales), los tests de integración prueban **flujos completos** de usuario.

### 🔄 Diferencia entre Tests Unitarios vs Tests de Integración

| Aspecto | Tests Unitarios | Tests de Integración |
|---------|----------------|---------------------|
| **Alcance** | Una función/método | Múltiples componentes |
| **Objetivo** | Verificar lógica individual | Verificar flujos completos |
| **Datos** | Datos mockeados | Datos reales de base de datos |
| **Velocidad** | Muy rápidos | Más lentos |
| **Aislamiento** | Completamente aislados | Interactúan entre sí |

## 📋 Tests de Integración Implementados

### INT-001: Flujo Completo Exitoso
**Objetivo**: Verificar que un usuario puede registrarse y luego hacer login exitosamente.

**Pasos**:
1. ✅ Registrar un usuario nuevo con datos válidos
2. ✅ Hacer login con las credenciales del usuario registrado
3. ✅ Verificar consistencia de datos entre register y login

**¿Qué verifica?**:
- Que el registro funciona correctamente
- Que el login funciona con el usuario recién creado
- Que los datos del usuario son consistentes
- Que el ID del usuario es el mismo en ambos endpoints

### INT-002: Flujo de Fallo
**Objetivo**: Verificar que cuando el registro falla, el login también falla apropiadamente.

**Pasos**:
1. ✅ Intentar registro con datos inválidos (debe fallar)
2. ✅ Intentar login con usuario que no existe (debe fallar)

**¿Qué verifica?**:
- Que la validación de datos funciona correctamente
- Que no se pueden crear usuarios con datos inválidos
- Que el sistema maneja apropiadamente usuarios inexistentes

### INT-003: Múltiples Usuarios
**Objetivo**: Verificar que el sistema puede manejar múltiples usuarios sin interferencia.

**Pasos**:
1. ✅ Registrar múltiples usuarios
2. ✅ Hacer login con cada usuario
3. ✅ Verificar que no hay interferencia entre usuarios

**¿Qué verifica?**:
- Que el sistema puede manejar múltiples usuarios
- Que cada usuario mantiene sus datos separados
- Que las credenciales mezcladas no funcionan

### INT-004: Caso Edge: Email Duplicado
**Objetivo**: Verificar el manejo de emails duplicados en el flujo completo.

**Pasos**:
1. ✅ Registrar primer usuario
2. ✅ Intentar registrar segundo usuario con mismo email (debe fallar)
3. ✅ Verificar que solo el primer usuario puede hacer login

**¿Qué verifica?**:
- Que el sistema previene emails duplicados
- Que el primer usuario sigue siendo válido
- Que el segundo usuario no puede hacer login

## 🚀 Cómo Ejecutar los Tests de Integración

### Opción 1: Ejecutar solo tests de integración
```bash
npm run test:integration
```

### Opción 2: Ejecutar todos los tests
```bash
npm test
```

### Opción 3: Ejecutar con cobertura
```bash
npm run test:coverage
```

### Opción 4: Ejecutar en modo watch (desarrollo)
```bash
npm run test:watch
```

## 📊 Resultados Esperados

Cuando ejecutes los tests de integración, deberías ver algo como esto:

```
Integration Tests: User Register + Login Flow
  🚀 Starting integration test: Register → Login flow
  📝 Step 1: Registering new user...
  ✅ Registration successful
  🔐 Step 2: Logging in with registered user...
  ✅ Login successful
  🔍 Step 3: Verifying data consistency...
  ✅ Data consistency verified
  🎉 Integration test completed successfully!
  ✓ INT-001: should complete full user journey from registration to login (245ms)

  🚀 Starting integration test: Failed Register → Login attempt
  📝 Step 1: Attempting registration with invalid data...
  ✅ Registration correctly failed
  🔐 Step 2: Attempting login with non-existent user...
  ✅ Login correctly failed
  🎉 Integration test completed successfully!
  ✓ INT-002: should handle failed registration and subsequent login failure (89ms)

  ... (más tests)
```

## 🔧 Configuración Técnica

### Archivos Involucrados
- `user-register-login.test.ts`: Tests de integración principales
- `setup.ts`: Configuración de base de datos para tests
- `package.json`: Scripts para ejecutar tests

### Base de Datos
- Los tests usan la misma base de datos que el desarrollo
- Se limpia automáticamente antes de cada test
- Cada test usa emails únicos con timestamps

### Dependencias
- **Jest**: Framework de testing
- **Supertest**: Para hacer requests HTTP a la API
- **TypeORM**: Para interactuar con la base de datos

## 🎓 Conceptos Clave Aprendidos

### 1. **Flujo de Usuario Real**
Los tests de integración simulan lo que hace un usuario real:
- Registrarse en la aplicación
- Hacer login inmediatamente después
- Usar la aplicación normalmente

### 2. **Verificación de Consistencia**
No solo verificamos que cada endpoint funciona, sino que:
- Los datos son consistentes entre endpoints
- El ID del usuario es el mismo
- La información se mantiene correcta

### 3. **Manejo de Errores**
Verificamos que los errores se manejan apropiadamente:
- Registro fallido → Login fallido
- Datos inválidos → Respuestas apropiadas
- Emails duplicados → Prevención correcta

### 4. **Aislamiento de Usuarios**
Cada usuario debe ser independiente:
- No pueden interferir entre sí
- Sus credenciales son únicas
- Sus datos están separados

## 🚨 Troubleshooting

### Error: "Database connection failed"
```bash
# Asegúrate de que la base de datos esté corriendo
npm run dev
```

### Error: "Port already in use"
```bash
# Verifica que no haya otro proceso usando el puerto
netstat -ano | findstr :3000
```

### Error: "Test timeout"
```bash
# Ejecuta con más tiempo
npm run test:debug
```

## 📈 Próximos Pasos

1. **Agregar más flujos**: Cart → Checkout
2. **Tests de rendimiento**: Múltiples usuarios simultáneos
3. **Tests de seguridad**: Validación de tokens JWT
4. **Tests de API**: Documentación automática

---

**Creado por**: Gian Luca Caravone  
**Fecha**: 17-10-2025  
**Versión**: 1.0
