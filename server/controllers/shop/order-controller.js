const supabase = require('../../config/supabase');

const createOrder = async (req, res) => {
    try {
        console.log('🔹 Request Body:', req.body);

        const {
            userId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethods,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdate,
            paymentId,
            payerId,
            cartId
        } = req.body;

        // console.log('✅ userId:', userId);
        // console.log('✅ cartId:', cartId);
        // console.log('✅ cartItems:', cartItems);

        // Validaciones básicas
        if (!userId || !cartId) {
            return res.status(400).json({
                success: false,
                message: 'Missing userId or cartId'
            });
        }

        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart items are required'
            });
        }

        // Verificar que cada cartItem tenga productId
        for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];
            // console.log(`🔹 Item ${i}:`, item);
            if (!item.productId) {
                return res.status(400).json({
                    success: false,
                    message: `Cart item at index ${i} is missing a productId`
                });
            }
        }

        // Insertar orden en Supabase y asegurar que devuelve la orden insertada
        const { data: order, error } = await supabase
            .from('orders')
            .insert([
                {
                    userId,
                    cartId,
                    cartItems: JSON.stringify(cartItems),
                    addressInfo: JSON.stringify(addressInfo),
                    orderStatus,
                    paymentMethods,
                    paymentStatus,
                    totalAmount,
                    orderDate,
                    orderUpdate,
                    paymentId,
                    payerId
                }
            ])
            .select() // 🔥 Asegura que devuelve la orden insertada
            .single(); // Solo queremos un objeto, no un array

        // Verificar si ocurrió un error en Supabase
        if (error) {
            console.error('❌ Error al insertar la orden en Supabase:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al guardar la orden en la base de datos',
                error: error.message
            });
        }

        // Verificar si la orden es null
        if (!order) {
            console.error('❌ La orden no fue creada correctamente en Supabase');
            return res.status(500).json({
                success: false,
                message: 'No se pudo obtener la orden después de la inserción'
            });
        }

        console.log('✅ Orden insertada correctamente:', order);

        // Simulación de aprobación de PayPal
        const approvalURL = "https://www.paypal.com/approve-order";

        return res.status(201).json({
            success: true,
            approvalURL,
            orderId: order.id
        });

    } catch (error) {
        console.error('❌ Error en createOrder:', error);
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: 'Error occurred while creating order'
            });
        }
    }
};



// Confirmar pago de la orden
// const capturePayment = async (req, res) => {
//     try {
//         const { paymentId, payerId, orderId } = req.body;

//         // Obtener la orden de Supabase
//         const { data: order, error } = await supabase
//             .from('orders')
//             .select('*')
//             .eq('id', orderId)
//             .single(); // Solo una orden

//         if (error || !order) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Order cannot be found'
//             });
//         }

//         // Actualizar la orden con el estado de pago
//         const { data: updatedOrder, error: updateError } = await supabase
//             .from('orders')
//             .update({
//                 paymentStatus: 'paid',
//                 orderStatus: 'confirmed',
//                 paymentId,
//                 payerId
//             })
//             .eq('id', orderId)
//             .single(); // Solo una orden actualizada

//         if (updateError) {
//             throw updateError;
//         }

//         // Verificar que el carrito esté asociado antes de eliminarlo
//         if (order.cartId) {
//             const { data: cart, error: cartError } = await supabase
//                 .from('carts')
//                 .delete()
//                 .eq('id', order.cartId)
//                 .single();

//             if (cartError) {
//                 console.warn(`El carrito con ID ${order.cartId} no existe o ya fue eliminado.`);
//             }
//         } else {
//             console.warn("El pedido no tiene un CartId asociado.");
//         }

//         res.status(200).json({
//             success: true,
//             message: 'Order confirmed and cart deleted',
//             data: updatedOrder
//         });

//     } catch (error) {
//         console.error("Error en capturePayment:", error);
//         res.status(500).json({
//             success: false,
//             message: 'Some error occurred'
//         });
//     }
// };


const capturePayment = async (req, res) => {
    try {
        const { paymentId, payerId, orderId } = req.body;

        console.log("🔹 Recibido en capturePayment:", { paymentId, payerId, orderId });

        // Verificar si los datos esenciales existen
        if (!paymentId || !payerId || !orderId) {
            return res.status(400).json({
                success: false,
                message: "Missing paymentId, payerId, or orderId"
            });
        }

        // Obtener la orden de Supabase
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .select("*")
            .eq("id", orderId)
            .single(); 

        if (orderError || !order) {
            console.error("❌ Error al obtener la orden:", orderError);
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        console.log("✅ Orden encontrada:", order);

        // Actualizar la orden con el estado de pago
        const { data: updatedOrder, error: updateError } = await supabase
            .from("orders")
            .update({
                paymentStatus: "paid",
                orderStatus: "confirmed",
                paymentId,
                payerId
            })
            .eq("id", orderId)
            .select() // 🔥 Asegurar que devuelve la orden actualizada
            .single(); 

        if (updateError) {
            console.error("❌ Error al actualizar la orden:", updateError);
            return res.status(500).json({
                success: false,
                message: "Error updating order payment"
            });
        }

        console.log("✅ Orden actualizada correctamente:", updatedOrder);

        // Verificar que el carrito esté asociado antes de eliminarlo
        if (order.cartId) {
            const { error: cartError } = await supabase
                .from("carts")
                .delete()
                .eq("id", order.cartId);

            if (cartError) {
                console.warn(`⚠️ Error al eliminar carrito ID ${order.cartId}:`, cartError);
            } else {
                console.log(`🗑️ Carrito ID ${order.cartId} eliminado.`);
            }
        } else {
            console.warn("⚠️ El pedido no tiene un cartId asociado.");
        }

        return res.status(200).json({
            success: true,
            message: "Order confirmed and cart deleted",
            data: updatedOrder
        });

    } catch (error) {
        console.error("❌ Error en capturePayment:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred"
        });
    }
};


// Obtener todas las órdenes de un usuario
const getAllOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Obtener las órdenes por userId
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('userId', userId);

        if (error || !orders.length) {
            return res.status(404).json({
                success: false,
                message: 'No orders found'
            });
        }

        res.status(200).json({
            success: true,
            data: orders
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
        });
    }
};

// Obtener detalles de una orden por ID
const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener la orden por ID
        const { data: order, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single(); // Solo una orden

        if (error || !order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
        });
    }
};

module.exports = { createOrder, capturePayment, getAllOrdersByUser, getOrderDetails };
