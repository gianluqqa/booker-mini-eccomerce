import request from "supertest";
import { app } from "../../src/server";

/**
 * ========================================
 * TESTS DE INTEGRACIÓN: REGISTER + LOGIN
 * ========================================
 * 
 * Estos tests verifican que el flujo completo de registro y login
 * funcione correctamente como un proceso integrado.
 */

describe("Integration Tests: User Register + Login Flow", () => {
  
  //! INT-001: Complete successful flow: Register → Login
  it("INT-001: should complete full user journey from registration to login", async () => {
    console.log("🚀 Starting integration test: Register → Login flow");
    
    // ========================================
    // PASO 1: REGISTRAR UN USUARIO NUEVO
    // ========================================
    const userData = {
      email: `integration-test-${Date.now()}@example.com`,
      password: "IntegrationPass123",
      confirmPassword: "IntegrationPass123",
      name: "Integration",
      surname: "Test",
      address: "456 Integration Street",
      country: "Argentina",
      city: "Córdoba",
      phone: "543512345678"
    };

    console.log("📝 Step 1: Registering new user...");
    const registerResponse = await request(app)
      .post("/users/register")
      .send(userData);

    // Verificar que el registro fue exitoso
    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.email).toBe(userData.email);
    expect(registerResponse.body.name).toBe("Integration");
    expect(registerResponse.body.id).toBeDefined();
    console.log("✅ Registration successful");

    // ========================================
    // PASO 2: HACER LOGIN CON EL USUARIO RECIÉN CREADO
    // ========================================
    const loginData = {
      email: userData.email,
      password: userData.password
    };

    console.log("🔐 Step 2: Logging in with registered user...");
    const loginResponse = await request(app)
      .post("/users/login")
      .send(loginData);

    // Verificar que el login fue exitoso
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.email).toBe(userData.email);
    expect(loginResponse.body.name).toBe("Integration");
    expect(loginResponse.body.surname).toBe("Test");
    expect(loginResponse.body.address).toBe("456 Integration Street");
    expect(loginResponse.body.country).toBe("Argentina");
    expect(loginResponse.body.city).toBe("Córdoba");
    expect(loginResponse.body.phone).toBe("543512345678");
    expect(loginResponse.body.role).toBe("customer");
    expect(loginResponse.body.id).toBeDefined();
    console.log("✅ Login successful");

    // ========================================
    // PASO 3: VERIFICAR CONSISTENCIA DE DATOS
    // ========================================
    console.log("🔍 Step 3: Verifying data consistency...");
    
    // El ID del usuario debe ser el mismo en register y login
    expect(registerResponse.body.id).toBe(loginResponse.body.id);
    
    // Los datos del usuario deben ser consistentes
    expect(registerResponse.body.email).toBe(loginResponse.body.email);
    expect(registerResponse.body.name).toBe(loginResponse.body.name);
    expect(registerResponse.body.surname).toBe(loginResponse.body.surname);
    
    console.log("✅ Data consistency verified");
    console.log("🎉 Integration test completed successfully!");
  });

  //! INT-002: Failed registration → Failed login attempt
  it("INT-002: should handle failed registration and subsequent login failure", async () => {
    console.log("🚀 Starting integration test: Failed Register → Login attempt");
    
    // ========================================
    // PASO 1: INTENTAR REGISTRO CON DATOS INVÁLIDOS
    // ========================================
    const invalidUserData = {
      email: "invalid-email-format", // Email inválido
      password: "123", // Contraseña muy corta
      confirmPassword: "456", // Contraseñas no coinciden
      name: "", // Nombre vacío
      surname: ""
    };

    console.log("📝 Step 1: Attempting registration with invalid data...");
    const registerResponse = await request(app)
      .post("/users/register")
      .send(invalidUserData);

    // Verificar que el registro falló
    expect(registerResponse.status).toBe(400);
    console.log("✅ Registration correctly failed");

    // ========================================
    // PASO 2: INTENTAR LOGIN CON USUARIO QUE NO EXISTE
    // ========================================
    const loginData = {
      email: invalidUserData.email,
      password: invalidUserData.password
    };

    console.log("🔐 Step 2: Attempting login with non-existent user...");
    const loginResponse = await request(app)
      .post("/users/login")
      .send(loginData);

    // Verificar que el login falló (400 porque el email es inválido)
    expect(loginResponse.status).toBe(400);
    expect(loginResponse.body.message).toContain("Email format is invalid");
    console.log("✅ Login correctly failed");
    console.log("🎉 Integration test completed successfully!");
  });

  //! INT-003: Multiple users registration and login
  it("INT-003: should handle multiple users registration and login", async () => {
    console.log("🚀 Starting integration test: Multiple users flow");
    
    const users = [
      {
        email: `user1-${Date.now()}@example.com`,
        password: "Password123",
        confirmPassword: "Password123",
        name: "User",
        surname: "One"
      },
      {
        email: `user2-${Date.now()}@example.com`,
        password: "Password456",
        confirmPassword: "Password456",
        name: "User",
        surname: "Two"
      }
    ];

    // ========================================
    // PASO 1: REGISTRAR MÚLTIPLES USUARIOS
    // ========================================
    console.log("📝 Step 1: Registering multiple users...");
    const registerResponses = [];
    
    for (let i = 0; i < users.length; i++) {
      const response = await request(app)
        .post("/users/register")
        .send(users[i]);
      
      expect(response.status).toBe(201);
      expect(response.body.email).toBe(users[i].email);
      registerResponses.push(response);
      console.log(`✅ User ${i + 1} registered successfully`);
    }

    // ========================================
    // PASO 2: HACER LOGIN CON CADA USUARIO
    // ========================================
    console.log("🔐 Step 2: Logging in with each user...");
    
    for (let i = 0; i < users.length; i++) {
      const loginData = {
        email: users[i].email,
        password: users[i].password
      };

      const loginResponse = await request(app)
        .post("/users/login")
        .send(loginData);

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.email).toBe(users[i].email);
      expect(loginResponse.body.id).toBe(registerResponses[i].body.id);
      console.log(`✅ User ${i + 1} logged in successfully`);
    }

    // ========================================
    // PASO 3: VERIFICAR QUE NO HAY INTERFERENCIA ENTRE USUARIOS
    // ========================================
    console.log("🔍 Step 3: Verifying no user interference...");
    
    // Intentar login con credenciales mezcladas (debe fallar)
    const mixedLoginData = {
      email: users[0].email, // Email del primer usuario
      password: users[1].password // Contraseña del segundo usuario
    };

    const mixedLoginResponse = await request(app)
      .post("/users/login")
      .send(mixedLoginData);

    expect(mixedLoginResponse.status).toBe(401);
    expect(mixedLoginResponse.body.message).toBe("Invalid credentials");
    console.log("✅ User isolation verified");
    console.log("🎉 Multiple users integration test completed successfully!");
  });

  //! INT-004: Edge case: Register with duplicate email → Login attempt
  it("INT-004: should handle duplicate email registration and login attempt", async () => {
    console.log("🚀 Starting integration test: Duplicate email flow");
    
    const uniqueEmail = `duplicate-test-${Date.now()}@example.com`;
    
    // ========================================
    // PASO 1: REGISTRAR PRIMER USUARIO
    // ========================================
    const firstUser = {
      email: uniqueEmail,
      password: "FirstPass123",
      confirmPassword: "FirstPass123",
      name: "First",
      surname: "User"
    };

    console.log("📝 Step 1: Registering first user...");
    const firstRegisterResponse = await request(app)
      .post("/users/register")
      .send(firstUser);

    expect(firstRegisterResponse.status).toBe(201);
    console.log("✅ First user registered successfully");

    // ========================================
    // PASO 2: INTENTAR REGISTRAR SEGUNDO USUARIO CON MISMO EMAIL
    // ========================================
    const secondUser = {
      email: uniqueEmail, // Mismo email
      password: "SecondPass123",
      confirmPassword: "SecondPass123",
      name: "Second",
      surname: "User"
    };

    console.log("📝 Step 2: Attempting to register second user with same email...");
    const secondRegisterResponse = await request(app)
      .post("/users/register")
      .send(secondUser);

    expect(secondRegisterResponse.status).toBe(409);
    console.log("✅ Duplicate registration correctly rejected");

    // ========================================
    // PASO 3: VERIFICAR QUE SOLO EL PRIMER USUARIO PUEDE HACER LOGIN
    // ========================================
    console.log("🔐 Step 3: Verifying only first user can login...");
    
    // Login con credenciales del primer usuario (debe funcionar)
    const firstLoginData = {
      email: firstUser.email,
      password: firstUser.password
    };

    const firstLoginResponse = await request(app)
      .post("/users/login")
      .send(firstLoginData);

    expect(firstLoginResponse.status).toBe(200);
    expect(firstLoginResponse.body.email).toBe(firstUser.email);
    expect(firstLoginResponse.body.name).toBe("First");
    console.log("✅ First user login successful");

    // Login con credenciales del segundo usuario (debe fallar)
    const secondLoginData = {
      email: secondUser.email,
      password: secondUser.password
    };

    const secondLoginResponse = await request(app)
      .post("/users/login")
      .send(secondLoginData);

    expect(secondLoginResponse.status).toBe(401);
    expect(secondLoginResponse.body.message).toBe("Invalid credentials");
    console.log("✅ Second user login correctly failed");
    console.log("🎉 Duplicate email integration test completed successfully!");
  });
});
