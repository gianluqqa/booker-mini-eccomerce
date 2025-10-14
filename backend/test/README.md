# Guía de Testing - Proyecto Booker

## 📋 Información General
Este directorio contiene todos los tests para el backend del proyecto Booker. Para información detallada sobre la estrategia de testing y progreso, consulta [test-plan.md](./test-plan.md).

## 🎯 ¿Qué son estos tests?
Los tests verifican automáticamente que las funcionalidades del backend funcionen correctamente. Incluyen tests para registro de usuarios, carrito de compras y proceso de checkout.

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

### Ejecutar tests de un módulo específico
```bash
# Tests de usuarios
npm test -- users

# Tests de carrito (cuando estén implementados)
npm test -- cart

# Tests de checkout (cuando estén implementados)
npm test -- checkout
```

## 📊 Estado Actual de los Tests

### ✅ Módulo Users (Completado)
- **Test 1**: "should create a new user successfully"
  - ✅ Verifica que un nuevo usuario pueda registrarse
  - ✅ Valida que la respuesta sea correcta
  - ✅ Confirma que los datos del usuario se guarden

- **Test 2**: "should reject duplicate email"
  - ✅ Verifica que el sistema prevenga emails duplicados
  - ✅ Confirma que retorne el código de error correcto (409)

- **Test 3**: "should reject incomplete data"
  - ✅ Verifica que el sistema rechace datos incompletos
  - ✅ Confirma que retorne el código de error correcto (400)

### 🔄 Módulo Cart (En desarrollo)
- Tests pendientes de implementación

### 🔄 Módulo Checkout (En desarrollo)
- Tests pendientes de implementación

## 📖 Cómo Leer los Tests

Cada test sigue 3 pasos simples:

```typescript
it('should do something', async () => {
  // 1. ARRANGE: Configurar datos de prueba
  const userData = { /* tus datos de prueba */ };
  
  // 2. ACT: Ejecutar la acción que quieres probar
  const response = await request(app)
    .post('/users/register')
    .send(userData);
  
  // 3. ASSERT: Verificar que funcionó correctamente
  expect(response.status).toBe(201);
});
```

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

¿Quieres agregar un nuevo test? Sigue este patrón:

```typescript
it('should do something new', async () => {
  // 1. Configurar datos de prueba
  const testData = { /* tus datos */ };
  
  // 2. Hacer la llamada a la API
  const response = await request(app)
    .post('/users/register')
    .send(testData);
  
  // 3. Verificar el resultado
  expect(response.status).toBe(201);
});
```

## 💡 Consejos para Principiantes

1. **Empieza simple**: No trates de probar todo de una vez
2. **Lee los mensajes de error**: Usualmente te dicen qué está mal
3. **Un test, una cosa**: Cada test debe verificar un comportamiento específico
4. **Usa nombres descriptivos**: "should create user" es mejor que "test1"
5. **No te preocupes por ser perfecto**: Los tests siempre se pueden mejorar después

## 📚 Documentación Adicional

- **Plan de Testing**: [test-plan.md](./test-plan.md) - Estrategia y progreso general
- **Resumen Backend**: [backend-summary.md](./backend-summary.md) - Estado de todos los módulos
- **Tests de Usuarios**: [users/users-summary.md](./users/users-summary.md) - Detalles del módulo users

## 🆘 ¿Necesitas Ayuda?

- Revisa la salida de la consola para mensajes de error
- Asegúrate de que tu servidor esté ejecutándose
- Verifica tu conexión a la base de datos
- ¡Pide ayuda si te quedas atascado!