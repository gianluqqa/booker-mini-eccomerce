import { Request, Response } from "express";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { AppDataSource } from "../config/data-source";
import { Order } from "../entities/Order";
import { OrderStatus } from "../enums/OrderStatus";

export const createPayment = async (req: Request, res: Response) => {
  try {
    // Verificar autenticación
    const authUser = (req as any).authUser as
      | { id: string; role: string }
      | undefined;
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    // Obtener orderId del body
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId es requerido",
      });
    }

    // Obtener la orden de la base de datos
    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOne({
      where: { id: orderId },
      relations: ["user", "items", "items.book"],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Orden no encontrada",
      });
    }

    // Verificar que la orden pertenezca al usuario autenticado
    if (order.user.id !== authUser.id) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para acceder a esta orden",
      });
    }

    // Verificar que la orden tenga items
    if (!order.items || order.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "La orden no tiene items",
      });
    }

    // Configurar cliente de Mercado Pago
    console.log('🔑 Configurando cliente de Mercado Pago...');
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });

    if (!process.env.MP_ACCESS_TOKEN) {
      console.error('❌ Token de Mercado Pago no configurado');
      return res.status(500).json({
        success: false,
        message: "Token de Mercado Pago no configurado",
      });
    }

    console.log('✅ Token de Mercado Pago configurado correctamente');
    const preference = new Preference(client);

    // Construir items para Mercado Pago
    const items = order.items.map((item) => ({
      id: item.id,
      title: item.book.title,
      description: `Libro: ${item.book.title} - Autor: ${item.book.author}`,
      quantity: item.quantity,
      unit_price: Number(item.book.price), // Precio unitario
    }));

    // Calcular subtotal (suma de todos los totalPrice de los items)
    const subtotal = order.items.reduce(
      (total, item) => total + Number(item.price),
      0
    );

    // Calcular impuestos (21% IVA)
    const tax = subtotal * 0.21;

    // Agregar item de impuestos si es mayor a 0
    if (tax > 0) {
      items.push({
        id: `tax-${orderId}`,
        title: "Impuestos (IVA 21%)",
        description: "Impuesto al Valor Agregado",
        quantity: 1,
        unit_price: tax,
      });
    }

    // Obtener URLs del frontend desde variables de entorno
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    console.log('🌐 FRONTEND_URL:', frontendUrl);
    console.log('🔗 MP_WEBHOOK_URL:', process.env.MP_WEBHOOK_URL);

    // Crear preferencia de pago
    console.log('🛒 Creando preferencia de pago con Mercado Pago...');
    const result = await preference.create({
      body: {
        items: items,
        back_urls: {
          success: `${frontendUrl}/success`,
          failure: `${frontendUrl}/failure`,
          pending: `${frontendUrl}/pending`,
        },
        external_reference: orderId, // Referencia externa para identificar la orden
        notification_url: process.env.MP_WEBHOOK_URL, // URL para webhooks
      },
    });

    console.log('✅ Preferencia de pago creada exitosamente:', {
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point
    });

    return res.status(200).json({
      success: true,
      message: "Preferencia de pago creada exitosamente",
      data: {
        init_point: result.init_point,
        preferenceId: result.id,
        orderId: orderId,
      },
    });
  } catch (error: any) {
    console.error("Error creando pago:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error creando pago",
    });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    console.log("🔔 Webhook recibido - Headers:", req.headers);
    console.log("🔔 Webhook recibido - Body:", req.body);
    
    const { type, data } = req.body;
    
    console.log("🔔 Webhook procesado:", { type, data });

    // Verificar si es una notificación de pago
    if (type === "payment") {
      const paymentId = data.id;
      
      console.log(`💳 Pago recibido: ${paymentId}`);
      
      // Si es un pago de prueba (ID numérico simple), lo manejamos diferente
      if (paymentId && typeof paymentId === 'string' && /^\d+$/.test(paymentId)) {
        console.log("🧪 Detectado pago de prueba, simulando aprobación");
        
        // Para pagos de prueba, no intentamos obtener de Mercado Pago
        // Simplemente respondemos que recibimos el webhook
        return res.status(200).json({ 
          received: true, 
          message: "Webhook de prueba recibido correctamente",
          test_payment: true 
        });
      }
      
      // 1. Obtener detalles del pago desde Mercado Pago (solo para pagos reales)
      try {
        const client = new MercadoPagoConfig({
          accessToken: process.env.MP_ACCESS_TOKEN!,
        });
        
        const payment = new Payment(client);
        const paymentData = await payment.get({ id: paymentId });
        
        console.log("📊 Datos del pago:", {
          id: paymentData.id,
          status: paymentData.status,
          status_detail: paymentData.status_detail,
          external_reference: paymentData.external_reference,
          amount: paymentData.transaction_amount
        });
        
        // 2. Verificar si el pago fue aprobado
        if (paymentData.status === 'approved') {
          const orderId = paymentData.external_reference;
          
          if (orderId) {
            console.log(`✅ Pago aprobado para orden: ${orderId}`);
            
            // 3. Actualizar el estado de la orden en la base de datos
            try {
              const orderRepository = AppDataSource.getRepository(Order);
              
              // Actualizar la orden a PAID
              const updateResult = await orderRepository.update(
                { id: orderId },
                { status: OrderStatus.PAID }
              );
              
              console.log(`🔄 Orden actualizada: ${orderId}, filas afectadas: ${updateResult.affected}`);
              
              // Verificar que la orden se actualizó correctamente
              const updatedOrder = await orderRepository.findOne({ where: { id: orderId } });
              if (updatedOrder) {
                console.log(`✅ Orden ${orderId} ahora tiene estado: ${updatedOrder.status}`);
              }
              
            } catch (dbError) {
              console.error("❌ Error actualizando la orden:", dbError);
            }
          }
        } else if (paymentData.status === 'rejected' || paymentData.status === 'cancelled') {
          console.log(`❌ Pago rechazado/cancelado: ${paymentId}`);
          // Aquí podrías manejar pagos fallidos si es necesario
        }
      } catch (mpError) {
        console.error("❌ Error obteniendo datos del pago de Mercado Pago:", mpError);
        // No fallamos completamente si no podemos obtener el pago
      }
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error("❌ Error en webhook:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error procesando webhook",
    });
  }
};
