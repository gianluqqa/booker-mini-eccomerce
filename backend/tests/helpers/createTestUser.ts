import request from "supertest";
import { app } from "../../src/server";
import { RegisterUserDTO } from "../../src/dto/UserDto";

// Helper function para crear usuarios de prueba
export const createTestUser = async (userData: Partial<RegisterUserDTO>) => {
  const defaultUser: RegisterUserDTO = {
    email: `test_${Date.now()}@test.com`,
    password: "Password123!",
    confirmPassword: "Password123!",
    name: "Test",
    surname: "User",
    ...userData
  };

  const response = await request(app)
    .post("/users/register")
    .send(defaultUser);

  expect(response.status).toBe(201);
  return response.body.data;
};