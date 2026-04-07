import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../enums/UserRole";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"] as string | undefined;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false, 
        message: "No autorizado: se requiere un token de autenticación" 
      });
    }

    const token = authHeader.slice("Bearer ".length).trim();
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string; role: UserRole; iat: number; exp: number };

    (req as any).authUser = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false, 
      message: "No autorizado: token inválido o expirado" 
    });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authUser = (req as any).authUser as { id: string; role: UserRole } | undefined;
  if (!authUser) {
    return res.status(401).json({ 
      success: false, 
      message: "No autorizado" 
    });
  }
  if (authUser.role !== UserRole.ADMIN) {
    return res.status(403).json({ 
      success: false, 
      message: "Prohibido: se requiere rol de administrador" 
    });
  }
  next();
};
