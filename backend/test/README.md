# Guía de Testing - Proyecto Booker

## 📋 Información General
Este directorio contiene todos los tests para el backend del proyecto Booker. Los tests están organizados en módulos y cubren tanto pruebas manuales como automatizadas.

## 🎯 ¿Qué son estos tests?
Los tests verifican automáticamente que las funcionalidades del backend funcionen correctamente. Actualmente incluyen tests para el módulo de usuarios (registro y login).

## 🚀 Cómo Ejecutar los Tests

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests con cobertura de código
```bash
npm run test:coverage
```

### Ejecutar tests en modo watch (se re-ejecutan al cambiar código)
```bash
npm run test:watch
```

### Generar Reportes HTML
```bash
# Generar todos los reportes
npm run test:report:all

# Generar reporte de registro únicamente
npm run test:report:register

# Generar reporte de login únicamente
npm run test:report:login
```

### Ejecutar tests específicos
```bash
# Tests automatizados de registro de usuarios
npm test -- test/users/automated/unit-tests/register-user-auto.test.ts

# Tests automatizados de login de usuarios
npm test -- test/users/automated/unit-tests/login-user-auto.test.ts
```

### Ejecutar tests con reporte detallado
```bash
# Tests con cobertura y reporte HTML
npm test -- test/users/automated/unit-tests/register-user-auto.test.ts --coverage
```

## 📁 Estructura de Tests

### Jerarquía Completa de Tests
```
test/
├── users/
│   ├── automated/
│   │   ├── unit-tests/
│   │   │   ├── register-user-auto.test.ts    # 5 tests de registro
│   │   │   └── login-user-auto.test.ts       # 7 tests de login
│   │   └── test-reports/
│   │       ├── register-test-report.html     # Reporte HTML de registro
│   │       ├── login-test-report.html        # Reporte HTML de login
│   │       └── README.md                     # Documentación de reportes
│   └── manual/
│       ├── unit-tests/
│       │   ├── register-user-manual.md       # Tests manuales de registro
│       │   └── login-user-manual.md          # Tests manuales de login
│       └── evidences/                        # Evidencias de pruebas
├── integration-tests/                        # Tests de integración
├── setup.ts                                  # Configuración de tests
└── README.md                                 # Esta documentación
```

### Tests Automatizados Disponibles

#### Registro de Usuarios (5 tests):
- **AUTO-001**: Registro exitoso de usuario
- **AUTO-002**: Rechazo de email duplicado
- **AUTO-003**: Validación de datos incompletos
- **AUTO-004**: Validación de formato de email inválido
- **AUTO-005**: Validación de contraseñas que no coinciden

#### Login de Usuarios (6 tests):
- **AUTO-006**: Login exitoso con credenciales válidas
- **AUTO-007**: Rechazo de contraseña incorrecta
- **AUTO-008**: Manejo de usuario inexistente
- **AUTO-009**: Validación de email faltante
- **AUTO-010**: Validación de contraseña faltante
- **AUTO-011**: Validación de formato de email inválido

### Tests Manuales
Los tests manuales están documentados en formato Markdown y incluyen:
- **TC-001 a TC-006**: Tests de registro de usuarios
- **TC-007 a TC-012**: Tests de login de usuarios

## 📖 Cómo Leer los Tests

### Tests Automatizados
Cada test automatizado sigue 3 pasos simples:

```typescript
it('AUTO-001: should create a new user successfully', async () => {
  // 1. ARRANGE: Configurar datos de prueba
  const userData = {
    email: `test-${Date.now()}@example.com`,
    password: "Password123",
    confirmPassword: "Password123",
    name: "John",
    surname: "Doe"
  };
  
  // 2. ACT: Ejecutar la acción que quieres probar
  const response = await request(app)
    .post('/users/register')
    .send(userData);
  
  // 3. ASSERT: Verificar que funcionó correctamente
  expect(response.status).toBe(201);
  expect(response.body.email).toBe(userData.email);
});
```

### Tests Manuales
Los tests manuales están documentados con:
- **Descripción** del test
- **Prerequisites** necesarios
- **Pasos de ejecución**
- **Datos de prueba**
- **Resultados esperados vs actuales**
- **Evidencias** (capturas de pantalla)

## 📊 Estado Actual de los Tests

### Resumen de Ejecución:
- **Total de Tests**: 16 (10 registro + 6 login)
- **Tests Pasando**: 16 ✅
- **Tests Fallando**: 0 ❌
- **Tasa de Éxito**: 100%
- **Tiempo de Ejecución**: ~6.3 segundos

### Cobertura de Código:
- **Controllers**: 93.1% statements
- **Services**: 100% statements
- **Middlewares**: 82.05% statements
- **Overall**: 95.31% statements

## 🔧 Problemas Comunes y Soluciones

### Problema: "Cannot find module"
**Solución:** Asegúrate de estar en la carpeta backend y ejecuta `npm install`

### Problema: "Database connection failed"
**Solución:** Verifica que tu base de datos esté ejecutándose

### Problema: "Test timeout"
**Solución:** Verifica que tu servidor esté ejecutándose en el puerto correcto

### Problema: "Tests no se ejecutan"
**Solución:** Verifica que estés en el directorio correcto y que las dependencias estén instaladas

### Problema: "No tests found"
**Solución:** Verifica que los archivos de test tengan la extensión `.test.ts` y estén en la ubicación correcta

## ➕ Agregar Nuevos Tests

### Tests Automatizados
Para agregar un nuevo test automatizado, sigue este patrón:

```typescript
it('AUTO-013: should do something new', async () => {
  // 1. Configurar datos de prueba
  const testData = {
    email: `test-${Date.now()}@example.com`,
    // ... otros campos
  };
  
  // 2. Hacer la llamada a la API
  const response = await request(app)
    .post('/users/register')
    .send(testData);
  
  // 3. Verificar el resultado
  expect(response.status).toBe(201);
});
```

### Tests Manuales
Para agregar un nuevo test manual:
1. Crea un nuevo archivo `.md` en `test/users/manual/unit-tests/`
2. Sigue el formato de los tests existentes
3. Incluye evidencias (capturas de pantalla) en `test/users/manual/evidences/`
4. Actualiza la numeración (TC-010, TC-011, etc.)

## 💡 Consejos para Principiantes

1. **Empieza simple**: No trates de probar todo de una vez
2. **Lee los mensajes de error**: Usualmente te dicen qué está mal
3. **Un test, una cosa**: Cada test debe verificar un comportamiento específico
4. **Usa nombres descriptivos**: "should create user" es mejor que "test1"
5. **No te preocupes por ser perfecto**: Los tests siempre se pueden mejorar después
6. **Usa los reportes HTML**: Son más fáciles de leer que la consola

## 📚 Documentación Adicional

- **Tests de Usuarios**: [users/users-summary.md](./users/users-summary.md) - Detalles del módulo users
- **Tests Manuales de Registro**: [users/manual/unit-tests/register-user-manual.md](./users/manual/unit-tests/register-user-manual.md)
- **Tests Manuales de Login**: [users/manual/unit-tests/login-user-manual.md](./users/manual/unit-tests/login-user-manual.md)
- **Reportes HTML**: [users/automated/test-reports/README.md](./users/automated/test-reports/README.md)
- **Tests de Integración**: [integration-tests/](./integration-tests/)

## 🆘 ¿Necesitas Ayuda?

- Revisa la salida de la consola para mensajes de error
- Asegúrate de que tu servidor esté ejecutándose
- Verifica tu conexión a la base de datos
- Usa `npm run test:report:all` para generar reportes detallados
- ¡Pide ayuda si te quedas atascado!