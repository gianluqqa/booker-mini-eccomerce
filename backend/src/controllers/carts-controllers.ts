import { Request, Response } from "express";
import {
  addBookToCartService,
  getUserCartService,
  updateCartItemQuantityService,
  removeBookFromCartService,
  clearCartService,
  checkoutCartService,
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
        message: "Unauthorized",
      });
    }

    const { bookId, quantity } = req.body as AddToCartDto;

    // Validaciones básicas
    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "bookId is required",
      });
    }

    if (
      quantity !== undefined &&
      (quantity <= 0 || !Number.isInteger(quantity))
    ) {
      return res.status(400).json({
        success: false,
        message: "quantity must be a positive integer",
      });
    }

    const cartItem = await addBookToCartService(authUser.id, {
      bookId,
      quantity,
    });

    return res.status(200).json({
      success: true,
      message: "Book added to cart successfully",
      data: cartItem,
    });
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Internal server error";

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
        message: "Unauthorized",
      });
    }

    const cart = await getUserCartService(authUser.id);

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Internal server error";

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
        message: "Unauthorized",
      });
    }

    const cartId = req.params.cartId;
    const { quantity } = req.body as UpdateCartDto;

    if (!cartId) {
      return res.status(400).json({
        success: false,
        message: "cartId is required",
      });
    }

    if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({
        success: false,
        message: "quantity must be a positive integer",
      });
    }

    const updatedCartItem = await updateCartItemQuantityService(
      authUser.id,
      cartId,
      { quantity }
    );

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: updatedCartItem,
    });
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Internal server error";

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
        message: "Unauthorized",
      });
    }

    const cartId = req.params.cartId;

    if (!cartId) {
      return res.status(400).json({
        success: false,
        message: "cartId is required",
      });
    }

    await removeBookFromCartService(authUser.id, cartId);

    return res.status(200).json({
      success: true,
      message: "Book removed from cart successfully",
    });
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Internal server error";

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
        message: "Unauthorized",
      });
    }

    await clearCartService(authUser.id);

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Internal server error";

    return res.status(status).json({
      success: false,
      message,
    });
  }
};

//? Convertir carrito a orden (checkout) (POST).
export const checkoutCartController = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).authUser as
      | { id: string; role: string }
      | undefined;
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const order = await checkoutCartService(authUser.id);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        id: order.id,
        userId: order.user.id,
        status: order.status,
        items: order.items.map((item) => ({
          id: item.id,
          book: {
            id: item.book.id,
            title: item.book.title,
            author: item.book.author,
            price: Number(item.book.price), // Precio unitario del libro
          },
          quantity: item.quantity,
          unitPrice: Number(item.book.price), // Precio unitario al momento de la compra
          totalPrice: Number(item.price), // Precio total (unitario * cantidad)
        })),
        createdAt: order.createdAt,
      },
    });
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Internal server error";

    return res.status(status).json({
      success: false,
      message,
    });
  }
};
