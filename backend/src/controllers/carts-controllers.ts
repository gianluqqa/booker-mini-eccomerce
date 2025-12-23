import { Request, Response } from "express";
import {
  addBookToCartService,
  getUserCartService,
  updateCartItemQuantityService,
  removeBookFromCartService,
  clearCartService,
} from "../services/carts-services";
import { AddToCartDto, UpdateCartDto } from "../dto/CartDto";

//? Añadir un libro al carrito (POST).
export const addBookToCartController = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).authUser as
      | { id: string; role: string }
      | undefined;
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    const { bookId, quantity } = req.body as AddToCartDto;

    // Validaciones básicas
    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "bookId es requerido",
      });
    }

    if (
      quantity !== undefined &&
      (quantity <= 0 || !Number.isInteger(quantity))
    ) {
      return res.status(400).json({
        success: false,
        message: "La cantidad debe ser un número entero positivo",
      });
    }

    const cartItem = await addBookToCartService(authUser.id, {
      bookId,
      quantity,
    });

    return res.status(200).json({
      success: true,
      message: "Libro agregado al carrito exitosamente",
      data: cartItem,
    });
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Error interno del servidor";

    return res.status(status).json({
      success: false,
      message,
    });
  }
};

//? Obtener el carrito del usuario (GET).
export const getUserCartController = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).authUser as
      | { id: string; role: string }
      | undefined;
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    const cart = await getUserCartService(authUser.id);

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Error interno del servidor";

    return res.status(status).json({
      success: false,
      message,
    });
  }
};

//? Actualizar cantidad de un item del carrito (PUT).
export const updateCartItemQuantityController = async (
  req: Request,
  res: Response
) => {
  try {
    const authUser = (req as any).authUser as
      | { id: string; role: string }
      | undefined;
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    const cartId = req.params.cartId;
    const { quantity } = req.body as UpdateCartDto;

    if (!cartId) {
      return res.status(400).json({
        success: false,
        message: "cartId es requerido",
      });
    }

    if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({
        success: false,
        message: "La cantidad debe ser un número entero positivo",
      });
    }

    const updatedCartItem = await updateCartItemQuantityService(
      authUser.id,
      cartId,
      { quantity }
    );

    return res.status(200).json({
      success: true,
      message: "Item del carrito actualizado exitosamente",
      data: updatedCartItem,
    });
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Error interno del servidor";

    return res.status(status).json({
      success: false,
      message,
    });
  }
};

//? Eliminar un item del carrito (DELETE).
export const removeBookFromCartController = async (
  req: Request,
  res: Response
) => {
  try {
    const authUser = (req as any).authUser as
      | { id: string; role: string }
      | undefined;
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    const cartId = req.params.cartId;

    if (!cartId) {
      return res.status(400).json({
        success: false,
        message: "cartId es requerido",
      });
    }

    await removeBookFromCartService(authUser.id, cartId);

    return res.status(200).json({
      success: true,
      message: "Libro eliminado del carrito exitosamente",
    });
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Error interno del servidor";

    return res.status(status).json({
      success: false,
      message,
    });
  }
};

//? Limpiar todo el carrito del usuario (DELETE).
export const clearCartController = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).authUser as
      | { id: string; role: string }
      | undefined;
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    await clearCartService(authUser.id);

    return res.status(200).json({
      success: true,
      message: "Carrito vaciado exitosamente",
    });
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Error interno del servidor";

    return res.status(status).json({
      success: false,
      message,
    });
  }
};
