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

### Ejecutar tests específicos de usuarios
```bash
# Tests automatizados de registro de usuarios
npm test -- test/users/automated/unit-tests/register-user-auto.test.ts

# Generar reporte HTML de tests de usuarios
npm run test:report:users
```

### Ejecutar tests con reporte detallado
```bash
# Tests con cobertura y reporte HTML
npm test -- test/users/automated/unit-tests/register-user-auto.test.ts --coverage
```

## 📁 Estructura de Tests

### Ejemplo de Jerarquia de Tests Automatizados
```
test/
├── users/
│   ├── automated/
│   │   ├── unit-tests/
│   │   │   ├── register-user-auto.test.ts    # 5 tests de registro
│   │   │   └── login-user-auto.test.ts       # Tests de login
│   │   └── test-reports/
│   │       └── users-test-report.html        # Reporte HTML generado
│   └── manual/
│       ├── unit-tests/
│       │   ├── register-user-manual.md       # Tests manuales de registro
│       │   └── login-user-manual.md          # Tests manuales de login
│       └── evidences/                        # Evidencias de pruebas
├── integration-tests/
│   └── user-register-login-integration.test.ts
```

### Tests Manuales
Los tests manuales están documentados en formato Markdown y incluyen:
- **TC-001 a TC-006**: Tests de registro de usuarios
- **TC-007 a TC-009**: Tests de login de usuarios

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

## 🔧 Problemas Comunes y Soluciones

### Problema: "Cannot find module"
**Solución:** Asegúrate de estar en la carpeta backend y ejecuta `npm install`

### Problema: "Database connection failed"
**Solución:** Verifica que tu base de datos esté ejecutándose

### Problema: "Test timeout"
**Solución:** Verifica que tu servidor esté ejecutándose en el puerto correcto

### Problema: "Tests no se ejecutan"
**Solución:** Verifica que estés en el directorio correcto y que las dependencias estén instaladas

## ➕ Agregar Nuevos Tests

### Tests Automatizados
Para agregar un nuevo test automatizado, sigue este patrón:

```typescript
it('AUTO-006: should do something new', async () => {
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

## 📚 Documentación Adicional

- **Tests de Usuarios**: [users/users-summary.md](./users/users-summary.md) - Detalles del módulo users
- **Tests Manuales de Registro**: [users/manual/unit-tests/register-user-manual.md](./users/manual/unit-tests/register-user-manual.md)
- **Tests Manuales de Login**: [users/manual/unit-tests/login-user-manual.md](./users/manual/unit-tests/login-user-manual.md)
- **Reporte HTML**: [users/automated/test-reports/users-test-report.html](./users/automated/test-reports/users-test-report.html)
- **Tests de Integración**: [integration-tests/user-register-login-integration.test.ts](./integration-tests/user-register-login-integration.test.ts)

## 🆘 ¿Necesitas Ayuda?

- Revisa la salida de la consola para mensajes de error
- Asegúrate de que tu servidor esté ejecutándose
- Verifica tu conexión a la base de datos
- ¡Pide ayuda si te quedas atascado!