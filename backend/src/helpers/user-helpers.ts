import { User } from "../entities/User";

/**
 * Excluye información sensible del usuario antes de retornarlo
 * @param user - Usuario con todos sus campos
 * @returns Usuario sin campos sensibles (password, etc.)
 */
export const excludeSensitiveData = (user: User) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

