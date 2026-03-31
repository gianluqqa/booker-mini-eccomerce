import { AppDataSource } from "../config/data-source";
import { Cart } from "../entities/Cart";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Book } from "../entities/Book";
import { User } from "../entities/User";
import { StockReservation } from "../entities/StockReservation";
import { OrderStatus } from "../enums/OrderStatus";
import { OrderResponseDto } from "../dto/OrderDto";
import { setupOrderExpiration, cancelOrderExpiration } from "./order-expiration-service";

const RESERVATION_MINUTES = 5;

//? Crear reserva de stock para checkout
export const createStockReservationForCheckoutService = async (userId: string): Promise<any> => {
  const stockReservationRepository = AppDataSource.getRepository(StockReservation);
  const cartRepository = AppDataSource.getRepository(Cart);
  const bookRepository = AppDataSource.getRepository(Book);
  const userRepository = AppDataSource.getRepository(User);
  const orderRepository = AppDataSource.getRepository(Order);

  try {

    // 🔍 VERIFICAR SI YA EXISTE ORDEN PENDING
    const existingPendingOrder = await orderRepository.findOne({
      where: {
        user: { id: userId },
        status: OrderStatus.PENDING
      }
    });

    if (existingPendingOrder) {
      throw {
        status: 409,
        message: "Ya tienes una orden pendiente. No se puede crear otra reserva."
      };
    }
    const cartItems = await cartRepository.find({
      where: { user: { id: userId } },
      relations: ["book"],
    });

    if (cartItems.length === 0) {
      throw { status: 400, message: "El carrito está vacío" };
    }

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw { status: 404, message: "Usuario no encontrado" };
    }

    // Eliminar reserva anterior si existe
    const existingReservation = await stockReservationRepository.findOne({
      where: { userId: userId },
    });
    if (existingReservation) {
      await stockReservationRepository.remove(existingReservation);
    }

    // Validar stock de todos los items
    for (const cartItem of cartItems) {
      if (cartItem.book.stock < cartItem.quantity) {
        throw { 
          status: 409, 
          message: "Stock insuficiente para el libro solicitado" 
        };
      }
    }

    // Preparar items para la reserva
    const reservationItems = cartItems.map(item => ({
      bookId: item.book.id,
      bookTitle: item.book.title,
      quantity: item.quantity,
      price: Number(item.book.price),
    }));

    // Calcular total
    const totalAmount = reservationItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Crear expiración (2 minutos)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + RESERVATION_MINUTES);

    // Crear UNA SOLA reserva para todo el carrito
    const reservation = stockReservationRepository.create({
      userId: userId,
      itemsJson: JSON.stringify(reservationItems),
      totalAmount: totalAmount,
      expiresAt: expiresAt,
    });

    const savedReservation = await stockReservationRepository.save(reservation);

    return {
      reservationId: savedReservation.id,
      items: reservationItems,
      totalAmount: totalAmount,
      expiresAt: expiresAt,
      totalMinutes: RESERVATION_MINUTES,
      message: "Reserva creada. Tienes 5 minutos para completar la compra."
    };
  } catch (error: any) {
    if (error.status && error.message) throw error;
    throw { status: 500, message: "No se pudo crear la reserva de stock" };
  }
};

//? Cancelar checkout y liberar reserva de stock
export const cancelCheckoutService = async (userId: string): Promise<any> => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const orderRepository = queryRunner.manager.getRepository(Order);
    const orderItemRepository = queryRunner.manager.getRepository(OrderItem);
    const bookRepository = queryRunner.manager.getRepository(Book);
    const stockReservationRepository = queryRunner.manager.getRepository(StockReservation);


    // Buscar orden PENDING activa
    const pendingOrder = await orderRepository.findOne({
      where: {
        user: { id: userId },
        status: OrderStatus.PENDING
      },
      relations: ['items', 'items.book']
    });

    if (pendingOrder) {

      // Cancelar expiración automática
      cancelOrderExpiration(pendingOrder.id);

      // Devolver stock de los items de la orden
      for (const item of pendingOrder.items) {
        const book = await bookRepository.findOne({
          where: { id: item.book.id }
        });

        if (book) {
          book.stock += item.quantity;
          await bookRepository.save(book);
        }
      }

      // Cambiar estado a cancelled
      pendingOrder.status = OrderStatus.CANCELLED;
      await orderRepository.save(pendingOrder);

      // Eliminar items de la orden
      await orderItemRepository.delete({ order: { id: pendingOrder.id } });

      // Eliminar la orden
      await orderRepository.delete({ id: pendingOrder.id });

    }

    // Limpiar el carrito del usuario
    const cartRepository = queryRunner.manager.getRepository(Cart);
    const cartItems = await cartRepository.find({
      where: { user: { id: userId } },
    });

    if (cartItems.length > 0) {
      await cartRepository.remove(cartItems);
    }

    // También eliminar cualquier reserva de stock antigua (por compatibilidad)
    const reservation = await stockReservationRepository.findOne({
      where: { userId: userId },
    });

    if (reservation) {
      await stockReservationRepository.remove(reservation);
    }

    await queryRunner.commitTransaction();

    return {
      message: pendingOrder
        ? "Orden cancelada y stock devuelto exitosamente"
        : "Reserva de stock cancelada exitosamente",
      orderId: pendingOrder?.id,
      reservationId: reservation?.id,
    };
  } catch (error: any) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Error en cancelCheckoutService:', error);
    if (error.status && error.message) throw error;
    throw { status: 500, message: "No se pudo cancelar el checkout" };
  } finally {
    await queryRunner.release();
  }
};

//? Procesar checkout - Crear orden PENDING o procesar pago (POST).
export const processCheckoutService = async (userId: string, paymentData?: { cardNumber: string; cardName: string; expiryDate: string; cvc: string; }): Promise<OrderResponseDto> => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const cartRepository = queryRunner.manager.getRepository(Cart);
    const orderRepository = queryRunner.manager.getRepository(Order);
    const orderItemRepository = queryRunner.manager.getRepository(OrderItem);
    const bookRepository = queryRunner.manager.getRepository(Book);
    const userRepository = queryRunner.manager.getRepository(User);
    const stockReservationRepository = queryRunner.manager.getRepository(StockReservation);


    // Verificar usuario
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw { status: 404, message: "Usuario no encontrado" };
    }

    // Verificar si ya existe una orden PENDING para este usuario
    const existingPendingOrder = await orderRepository.findOne({
      where: {
        user: { id: userId },
        status: OrderStatus.PENDING
      },
      relations: ["items", "items.book"],
    });


    // CASO 1: YA EXISTE ORDEN PENDING - Procesar pago
    if (existingPendingOrder) {

      // Si no hay datos de pago completos, ERROR - no se debe crear otra orden
      if (!paymentData || !paymentData.cardNumber || !paymentData.cardName || !paymentData.expiryDate || !paymentData.cvc) {
        throw {
          status: 409,
          message: "Ya tienes una orden pendiente. Completa el pago o cancela antes de continuar."
        };
      }

      // Procesar pago y cambiar estado a PAID

      // Simulación de procesamiento de pago
      const paymentSuccessful = true; // Simulación exitosa

      if (!paymentSuccessful) {
        throw { status: 400, message: "El pago fue rechazado" };
      }

      // Cambiar estado a PAID y eliminar expiración
      existingPendingOrder.status = OrderStatus.PAID;
      existingPendingOrder.expiresAt = undefined;
      await orderRepository.save(existingPendingOrder);


      // Cancelar expiración automática
      cancelOrderExpiration(existingPendingOrder.id);

      // Eliminar cualquier reserva de stock existente
      const reservation = await stockReservationRepository.findOne({
        where: { userId: userId },
      });
      if (reservation) {
        await stockReservationRepository.remove(reservation);
      }

      // Limpiar el carrito
      const cartItems = await cartRepository.find({
        where: { user: { id: userId } },
      });
      if (cartItems.length > 0) {
        await cartRepository.remove(cartItems);
      }

      await queryRunner.commitTransaction();

      return {
        id: existingPendingOrder.id,
        total: existingPendingOrder.total,
        status: existingPendingOrder.status,
        createdAt: existingPendingOrder.createdAt,
        items: existingPendingOrder.items.map((item) => {
          const unitPrice = Number(item.book.price);
          const totalPrice = Number(item.price);
          return {
            id: item.id,
            book: {
              id: item.book.id,
              title: item.book.title,
              author: item.book.author,
              price: unitPrice,
            },
            quantity: item.quantity,
            price: unitPrice,
            unitPrice: unitPrice,
            totalPrice: totalPrice,
          };
        }),
      };
    }

    // CASO 2: NO EXISTE ORDEN PENDING - Crear nueva orden PENDING

    // Obtener items del carrito
    const cartItems = await cartRepository.find({
      where: { user: { id: userId } },
      relations: ["book"],
    });

    if (cartItems.length === 0) {
      throw { status: 400, message: "El carrito está vacío" };
    }

    // Validar stock y crear items
    let total = 0;
    const orderItems = [];

    for (const cartItem of cartItems) {
      const book = await bookRepository.findOne({ where: { id: cartItem.book.id } });
      if (!book) {
        throw { status: 404, message: `Libro no encontrado: ${cartItem.book.title}` };
      }

      if (book.stock < cartItem.quantity) {
        throw { 
          status: 409, 
          message: "Stock insuficiente para el libro solicitado" 
        };
      }

      const itemTotal = Number(book.price) * cartItem.quantity;
      total += itemTotal;

      const orderItem = orderItemRepository.create({
        order: null, // Se asignará después
        book: book,
        quantity: cartItem.quantity,
        price: itemTotal,
      });

      orderItems.push(orderItem);
    }

    // Determinar estado y expiración según si hay datos de pago
    let orderStatus = OrderStatus.PENDING;
    let expiresAt: Date | undefined = undefined;

    if (paymentData && paymentData.cardNumber && paymentData.cardName && paymentData.expiryDate && paymentData.cvc) {
      // Si hay datos de pago completos, procesar pago inmediatamente

      // Simulación de procesamiento de pago
      const paymentSuccessful = true; // Simulación exitosa

      if (paymentSuccessful) {
        orderStatus = OrderStatus.PAID;

        // Reducir stock real solo si el pago es exitoso
        for (const cartItem of cartItems) {
          const book = await bookRepository.findOne({ where: { id: cartItem.book.id } });
          if (book) {
            book.stock -= cartItem.quantity;
            await bookRepository.save(book);
          }
        }

        // Limpiar carrito solo si el pago es exitoso
        await cartRepository.remove(cartItems);
      } else {
        throw { status: 400, message: "El pago fue rechazado" };
      }
    } else {
      // Si no hay datos de pago, crear expiración de 5 minutos y reservar stock
      expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + RESERVATION_MINUTES);
      // Reservar stock temporalmente para orden PENDING
      for (const cartItem of cartItems) {
        const book = await bookRepository.findOne({ where: { id: cartItem.book.id } });
        if (book) {
          book.stock -= cartItem.quantity;
          await bookRepository.save(book);
        }
      }

      // Crear registro de reserva de stock en la base de datos
      const reservationItems = cartItems.map(item => ({
        bookId: item.book.id,
        bookTitle: item.book.title,
        quantity: item.quantity,
        price: Number(item.book.price),
      }));

      const reservationTotal = reservationItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const stockReservation = stockReservationRepository.create({
        userId: userId,
        itemsJson: JSON.stringify(reservationItems),
        totalAmount: reservationTotal,
        expiresAt: expiresAt,
      });

      await stockReservationRepository.save(stockReservation);
    }

    // Crear la orden
    const order = orderRepository.create({
      user: user,
      status: orderStatus,
      total: total,
      expiresAt: expiresAt,
    });

    const savedOrder = await orderRepository.save(order);

    // Asignar orden a los items y guardar
    for (const orderItem of orderItems) {
      orderItem.order = savedOrder;
    }
    await orderItemRepository.save(orderItems);

    await queryRunner.commitTransaction();

    // Configurar expiración automática solo si es PENDING
    if (orderStatus === OrderStatus.PENDING) {
      setupOrderExpiration(savedOrder.id, RESERVATION_MINUTES);
    }

    // Recargar la orden con relaciones para la respuesta
    const orderWithRelations = await orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ["items", "items.book"],
    });

    if (!orderWithRelations) {
      throw { status: 500, message: "Error al crear la orden" };
    }

    return {
      id: orderWithRelations.id,
      total: orderWithRelations.total,
      status: orderWithRelations.status,
      createdAt: orderWithRelations.createdAt,
      expiresAt: orderWithRelations.expiresAt,
      items: orderWithRelations.items.map((item) => {
        const unitPrice = Number(item.book.price);
        const totalPrice = Number(item.price);
        return {
          id: item.id,
          book: {
            id: item.book.id,
            title: item.book.title,
            author: item.book.author,
            price: unitPrice,
          },
          quantity: item.quantity,
          price: unitPrice,
          unitPrice: unitPrice,
          totalPrice: totalPrice,
        };
      }),
    };
  } catch (error: any) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Error en processCheckoutService:', error);
    if (error.status && error.message) throw error;
    throw { status: 500, message: "No se pudo procesar el checkout" };
  } finally {
    await queryRunner.release();
  }
};