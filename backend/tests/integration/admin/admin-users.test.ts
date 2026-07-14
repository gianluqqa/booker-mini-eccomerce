import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { User } from "../../../src/entities/User";
import { createTestUser } from "../../helpers/userActions";
import { loginUser } from "../../helpers/authActions";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import {
  getAllUsersAdmin,
  getUserByIdAdmin,
  deleteUserAdmin,
  deleteAllUsersAdmin,
} from "../../helpers/adminActions";
import {
  initializeTestDb,
  closeTestDb,
  clearDatabase,
} from "../../helpers/dbHelpers";

describe("Users Module - Administration", () => {
  let testUser: User;

  let authToken: string;

  let adminToken: string;

  beforeAll(async () => {
    await initializeTestDb();
  });

  afterAll(async () => {
    await closeTestDb();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  beforeEach(async () => {
    testUser = await createTestUser({
      email: `admin_panel_user_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`,
      name: "Normal",
      surname: "User",
    });

    const loginResponse = await loginUser(app, { email: testUser.email });
    authToken = loginResponse.body.data.accessToken;

    const adminUser = await createTestUser({
      email: `admin_users_${Date.now()}@test.com`,
      role: "admin",
    });
    const adminRes = await loginUser(app, { email: adminUser.email });
    adminToken = adminRes.body.data.accessToken;
  });

  describe("GET /users/", () => {
    it("should reject with 403 if normal user tries to access", async () => {
      const res = await getAllUsersAdmin(app, authToken);
      validateErrorResponse(
        res,
        403,
        "Prohibido: se requiere rol de administrador",
      );
    });

    it("should return user list for an administrator", async () => {
      const res = await getAllUsersAdmin(app, adminToken);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should reject with 403 if normal user tries to access", async () => {
      const res = await getUserByIdAdmin(app, authToken, testUser.id);
      validateErrorResponse(
        res,
        403,
        "Prohibido: se requiere rol de administrador",
      );
    });

    it("should return requested user for an administrator", async () => {
      const res = await getUserByIdAdmin(app, adminToken, testUser.id);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(testUser.id);
    });

    it("should reject with 403 if normal user tries to delete", async () => {
      const res = await deleteUserAdmin(app, authToken, testUser.id);
      validateErrorResponse(
        res,
        403,
        "Prohibido: se requiere rol de administrador",
      );
    });

    it("should delete user and return 200", async () => {
      const userToDelete = await createTestUser({
        email: `to_delete_${Date.now()}@test.com`,
      });
      const res = await deleteUserAdmin(app, adminToken, userToDelete.id);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(userToDelete.id);
    });

    it("should reject with 403 if normal user tries to clear users", async () => {
      const res = await deleteAllUsersAdmin(app, authToken);
      validateErrorResponse(
        res,
        403,
        "Prohibido: se requiere rol de administrador",
      );
    });

    it("should delete all non-admin users", async () => {
      await createTestUser({ email: `extra_user_${Date.now()}@test.com` });
      const res = await deleteAllUsersAdmin(app, adminToken);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.count).toBeDefined();
    });
  });
});
