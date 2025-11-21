// src/controllers/orders-controllers.ts
import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Book } from "../entities/Book";
import { User } from "../entities/User";
import { OrderStatus } from "../enums/OrderStatus";

export const createOrder = async (req: Request, res: Response) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const { items } = req.body;
    const authUser = (req as any).authUser as { id: string };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Debe proporcionar al menos un ítem para la orden",
      });
    }

    const orderRepository = queryRunner.manager.getRepository(Order);
    const orderItemRepository = queryRunner.manager.getRepository(OrderItem);
    const bookRepository = queryRunner.manager.getRepository(Book);
    const userRepository = queryRunner.manager.getRepository(User);

    // Obtener el usuario
    const user = await userRepository.findOneBy({ id: authUser.id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Verificar stock y calcular total
    let total = 0;
    const orderItems = [];
    const booksToUpdate = [];

    for (const item of items) {
      const book = await bookRepository.findOneBy({ id: item.bookId });
      if (!book) {
        throw new Error(`Libro con ID ${item.bookId} no encontrado`);
      }

      if (book.stock < item.quantity) {
        throw new Error(`Stock insuficiente para el libro: ${book.title}`);
      }

      // Calcular precio total del ítem
      const itemTotal = book.price * item.quantity;
      total += itemTotal;

      // Crear order item
      const orderItem = new OrderItem();
      orderItem.book = book;
      orderItem.quantity = item.quantity;
      orderItem.price = book.price; // Precio unitario

      orderItems.push(orderItem);

      // Actualizar stock
      book.stock -= item.quantity;
      booksToUpdate.push(book);
    }

    // Crear la orden
    const order = new Order();
    order.user = user;
    order.status = OrderStatus.PENDING;
    order.total = total; // Asignar el total calculado
    order.items = orderItems;

    // Guardar todo en una transacción
    await orderRepository.save(order);
    await bookRepository.save(booksToUpdate);

    await queryRunner.commitTransaction();

    // Recargar la orden con las relaciones para la respuesta
    const savedOrder = await orderRepository.findOne({
      where: { id: order.id },
      relations: ["items", "items.book"],
    });

    if (!savedOrder) {
      throw new Error("Error al guardar la orden");
    }

    return res.status(201).json({
      success: true,
      message: "Orden creada exitosamente",
      order: {
        id: savedOrder.id,
        total: savedOrder.total,
        status: savedOrder.status,
        createdAt: savedOrder.createdAt,
        items: savedOrder.items.map((item) => ({
          id: item.id,
          book: {
            id: item.book.id,
            title: item.book.title,
            price: item.book.price,
          },
          quantity: item.quantity,
          price: item.price,
        })),
      },
    });
  } catch (error: any) {
    await queryRunner.rollbackTransaction();
    console.error("Error al crear la orden:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error al crear la orden",
    });
  } finally {
    await queryRunner.release();
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const authUser = (req as any).authUser as { id: string };

    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOne({
      where: { id },
      relations: ["user", "items", "items.book"],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Orden no encontrada",
      });
    }

    // Verificar que el usuario sea el dueño de la orden
    if (order.user.id !== authUser.id) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para ver esta orden",
      });
    }

    return res.json({
      success: true,
      order: {
        id: order.id,
        total: order.total,
        status: order.status,
        items: order.items.map((item) => ({
          id: item.id,
          book: {
            id: item.book.id,
            title: item.book.title,
            price: item.book.price,
          },
          quantity: item.quantity,
          price: item.price,
        })),
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Error al obtener la orden:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener la orden",
    });
  }
};