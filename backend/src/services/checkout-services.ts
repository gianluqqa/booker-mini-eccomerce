import { AppDataSource } from "../config/data-source";
import { Cart } from "../entities/Cart";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Book } from "../entities/Book";
import { User } from "../entities/User";
import { OrderStatus } from "../enums/OrderStatus";
import { OrderResponseDto } from "../dto/OrderDto";

//? Procesar checkout y crear orden (POST).
export const processCheckoutService = async (userId: string): Promise<OrderResponseDto> => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const cartRepository = queryRunner.manager.getRepository(Cart);
    const orderRepository = queryRunner.manager.getRepository(Order);
    const orderItemRepository = queryRunner.manager.getRepository(OrderItem);
    const bookRepository = queryRunner.manager.getRepository(Book);
    const userRepository = queryRunner.manager.getRepository(User);

    // Obtener todos los items del carrito
    const cartItems = await cartRepository.find({
      where: { user: { id: userId } },
      relations: ["book"],
    });

    if (cartItems.length === 0) {
      throw { status: 400, message: "El carrito está vacío" };
    }

    // Verificar usuario
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw { status: 404, message: "Usuario no encontrado" };
    }

    // Verificar stock y calcular total
    let total = 0;
    const orderItems = [];

    for (const cartItem of cartItems) {
      const book = cartItem.book;
      
      if (book.stock < cartItem.quantity) {
        throw {
          status: 400,
          message: `Stock insuficiente para el libro: ${book.title}`,
        };
      }

      // Calcular precio total del ítem
      const itemTotal = Number(book.price) * cartItem.quantity;
      total += itemTotal;

      // Crear order item
      const orderItem = orderItemRepository.create({
        order: null, // Se asignará después de crear la orden
        book: book,
        quantity: cartItem.quantity,
        price: itemTotal, // Precio total del item (precio unitario * cantidad)
      });

      orderItems.push(orderItem);

      // Actualizar stock
      book.stock -= cartItem.quantity;
      await bookRepository.save(book);
    }

    // Crear la orden
    const order = orderRepository.create({
      user: user,
      status: OrderStatus.PENDING,
      total: total,
    });
    const savedOrder = await orderRepository.save(order);

    // Asignar la orden a los items y guardarlos
    for (const orderItem of orderItems) {
      orderItem.order = savedOrder;
    }
    await orderItemRepository.save(orderItems);

    // Limpiar el carrito
    await cartRepository.remove(cartItems);

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
    console.error("Error durante el checkout:", error);
    if (error.status && error.message) throw error;
    throw { status: 500, message: "No se pudo procesar el checkout" };
  } finally {
    await queryRunner.release();
  }
};