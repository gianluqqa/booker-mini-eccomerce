import request from "supertest";
import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe("Authentication Module - API Tests", () => {
    // Inicializamos la base de datos antes de todas las pruebas
    beforeAll(async () => {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
    });

    // Cerramos la conexión después de todas las pruebas
    afterAll(async () => {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    });

    describe("TC-AUTH-001: Registro exitoso de nuevo usuario", () => {
        it("debería registrar un nuevo usuario con éxito y devolver status 201", async () => {
            const uniqueSuffix = Date.now();
            const userData = {
                name: "Test",
                surname: "User",
                email: `test_${uniqueSuffix}@example.com`,
                password: "Password123!",
                confirmPassword: "Password123!",
                address: "Calle Falsa 123",
                country: "Argentina",
                city: "CABA",
                phone: "1122334455"
            };

            const response = await request(app)
                .post("/users/register")
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("id");
            expect(response.body.email).toBe(userData.email);
            expect(response.body.name).toBe(userData.name);
            expect(response.body).not.toHaveProperty("password");
        });
    });
});
