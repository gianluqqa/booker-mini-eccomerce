import { AppDataSource } from "../config/data-source";
import { Cart } from "../entities/Cart";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Book } from "../entities/Book";
import { User } from "../entities/User";
import { StockReservation } from "../entities/StockReservation";
import { OrderStatus } from "../enums/OrderStatus";
import { OrderResponseDto } from "../dto/OrderDto";

const RESERVATION_MINUTES = 10;

//? Crear reserva de stock para checkout
export const createStockReservationForCheckoutService = async (userId: string): Promise<any> => {
  const stockReservationRepository = AppDataSource.getRepository(StockReservation);
  const cartRepository = AppDataSource.getRepository(Cart);
  const bookRepository = AppDataSource.getRepository(Book);
  const userRepository = AppDataSource.getRepository(User);

  try {
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
        throw { status: 400, message: `Stock insuficiente para: ${cartItem.book.title}` };
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

    // Crear expiración (10 minutos)
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
      message: "Reserva creada. Tienes 10 minutos para completar la compra."
    };
  } catch (error: any) {
    if (error.status && error.message) throw error;
    throw { status: 500, message: "No se pudo crear la reserva de stock" };
  }
};

//? Cancelar checkout y liberar reserva de stock
export const cancelCheckoutService = async (userId: string): Promise<any> => {
  const stockReservationRepository = AppDataSource.getRepository(StockReservation);

  try {
    const reservation = await stockReservationRepository.findOne({
      where: { userId: userId },
    });

    if (!reservation) {
      throw { status: 404, message: "No hay reserva de stock activa para cancelar" };
    }

    await stockReservationRepository.remove(reservation);

    return {
      message: "Reserva de stock cancelada exitosamente",
      reservationId: reservation.id,
    };
  } catch (error: any) {
    if (error.status && error.message) throw error;
    throw { status: 500, message: "No se pudo cancelar la reserva de stock" };
  }
};

//? Procesar checkout y crear orden (POST).
export const processCheckoutService = async (userId: string, paymentData?: {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvc: string;
}): Promise<OrderResponseDto> => {
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

    console.log('Procesando checkout con datos de pago:', paymentData);

    // Obtener reserva válida del usuario
    const reservation = await stockReservationRepository.findOne({
      where: { userId: userId },
    });

    if (!reservation) {
      throw { status: 400, message: "No hay reserva de stock válida. Primero reserva el stock." };
    }

    // Verificar que la reserva no haya expirado
    const now = new Date();
    if (reservation.expiresAt <= now) {
      throw { status: 400, message: "La reserva ha expirado. Por favor, reserva nuevamente." };
    }

    // Parsear los items desde JSON
    let reservationItems;
    try {
      reservationItems = JSON.parse(reservation.itemsJson);
    } catch (error) {
      throw { status: 500, message: "Error al procesar los items de la reserva" };
    }

    // Verificar usuario
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw { status: 404, message: "Usuario no encontrado" };
    }

    // Calcular total y crear order items usando la reserva
    let total = 0;
    const orderItems = [];

    for (const reservationItem of reservationItems) {
      // Obtener el libro real de la base de datos
      const book = await bookRepository.findOne({ where: { id: reservationItem.bookId } });
      if (!book) {
        throw { status: 404, message: `Libro no encontrado: ${reservationItem.bookTitle}` };
      }

      // Verificar stock real (por si cambió desde la reserva)
      if (book.stock < reservationItem.quantity) {
        throw { status: 400, message: `Stock insuficiente para el libro: ${book.title}` };
      }

      // Calcular precio total del ítem
      const itemTotal = Number(book.price) * reservationItem.quantity;
      total += itemTotal;

      // Crear order item
      const orderItem = orderItemRepository.create({
        order: null, // Se asignará después de crear la orden
        book: book,
        quantity: reservationItem.quantity,
        price: itemTotal, // Precio total del item (precio unitario * cantidad)
      });

      orderItems.push(orderItem);

      // Actualizar stock real
      book.stock -= reservationItem.quantity;
      await bookRepository.save(book);
    }

    // Determinar el estado de la orden
    let orderStatus = OrderStatus.PENDING;
    
    // Si se recibieron datos de pago, procesar el pago y cambiar a confirmed
    if (paymentData && paymentData.cardNumber && paymentData.cardName && paymentData.expiryDate && paymentData.cvc) {
      console.log('Procesando pago con datos completos...');
      // Simulación de procesamiento de pago (aquí iría la integración real con pasarela de pago)
      const paymentSuccessful = true; // Simulación exitosa
      
      if (paymentSuccessful) {
        orderStatus = OrderStatus.PAID;
        console.log('Pago procesado exitosamente, orden confirmada');
      } else {
        throw { status: 400, message: "El pago fue rechazado" };
      }
    } else {
      console.log('No se recibieron datos de pago completos, orden queda como pendiente');
    }

    // Crear la orden con el estado determinado
    const order = orderRepository.create({
      user: user,
      status: orderStatus,
      total: total,
    });
    const savedOrder = await orderRepository.save(order);

    console.log('Orden creada con estado:', orderStatus);

    // Asignar la orden a los items y guardarlos
    for (const orderItem of orderItems) {
      orderItem.order = savedOrder;
    }
    await orderItemRepository.save(orderItems);

    // Eliminar la reserva usada
    await stockReservationRepository.remove(reservation);

    // Limpiar el carrito
    const cartItems = await cartRepository.find({
      where: { user: { id: userId } },
    });
    if (cartItems.length > 0) {
      await cartRepository.remove(cartItems);
    }

    await queryRunner.commitTransaction();

    // Recargar la orden con las relaciones para la respuesta
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
      items: orderWithRelations.items.map((item) => {
        const unitPrice = Number(item.book.price); // precio unitario del libro
        const totalPrice = Number(item.price); // precio total guardado
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
    if (error.status && error.message) throw error;
    throw { status: 500, message: "No se pudo procesar el checkout" };
  } finally {
    await queryRunner.release();
  }
};