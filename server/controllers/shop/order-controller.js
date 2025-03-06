

const supabase = require('../../config/supabase');
const paypal = require('../../helpers/paypal');  // Importar PayPal

// 🔹 Crear una orden y generar `approvalURL` de PayPal
const createOrder = async (req, res) => {
    try {
        console.log('🔹 Request Body:', req.body);

        const {
            userId, cartItems, addressInfo, orderStatus, paymentMethods,
            paymentStatus, totalAmount, orderDate, orderUpdate, cartId
        } = req.body;

        // Verificar que cartId y userId estén presentes
        console.log("📦 Datos recibidos:", { userId, cartId });
        
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
            if (!item.productId) {
                return res.status(400).json({
                    success: false,
                    message: `Cart item at index ${i} is missing a productId`
                });
            }
        }

        // Insertar la orden en Supabase
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([{
                userId,
                cartId,  // Aseguramos que cartId se está enviando correctamente
                cartItems: JSON.stringify(cartItems),
                addressInfo: JSON.stringify(addressInfo),
                orderStatus,
                paymentMethods,
                paymentStatus,
                totalAmount,
                orderDate,
                orderUpdate,
                paymentId: '',
                payerId: ''
            }])
            .select() // 🔥 Asegura que devuelve la orden insertada
            .single();  // Solo queremos un objeto, no un array

        // Verificar si ocurrió un error al insertar la orden
        if (orderError) {
            console.error('❌ Error al insertar la orden en Supabase:', orderError);
            return res.status(500).json({
                success: false,
                message: 'Error al guardar la orden en la base de datos',
                error: orderError.message
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

        // Crear un pago con PayPal
        const paymentPayload = {
            intent: 'sale',
            payer: { payment_method: 'paypal' },
            redirect_urls: {
                return_url: `http://localhost:5000/api/shop/orders/capture?orderId=${order.id}`,
                cancel_url: 'http://localhost:5000/cancel'
            },
            transactions: [{
                amount: {
                    total: totalAmount.toFixed(2),  // Total en formato correcto
                    currency: 'USD'
                },
                description: 'Compra en Mimittos Shop'
            }]
        };

        paypal.payment.create(paymentPayload, async (error, payment) => {
            if (error) {
                console.error('❌ Error al crear pago en PayPal:', error);
                return res.status(500).json({ success: false, message: 'Error creating PayPal payment' });
            }

            // Buscar el enlace de aprobación
            const approvalURL = payment.links.find(link => link.rel === 'approval_url')?.href;

            if (!approvalURL) {
                return res.status(500).json({ success: false, message: 'Approval URL not found' });
            }

            // Devolver la URL de aprobación de PayPal
            res.status(201).json({
                success: true,
                approvalURL,  // Esta es la URL para redirigir al usuario a PayPal
                orderId: order.id
            });
        });

    } catch (error) {
        console.error('❌ Error en createOrder:', error);
        res.status(500).json({
            success: false,
            message: 'Error occurred while creating order'
        });
    }
};



// Obtener todas las órdenes de un usuario



// const capturePayment = async (req, res) => {
//     try {
//         const { paymentId, PayerID, orderId } = req.query;  // PayPal envía estos datos en la URL

//         // Verificar si los datos esenciales existen
//         console.log("Recibido en capturePayment:", { paymentId, PayerID, orderId });

//         if (!paymentId || !PayerID || !orderId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Missing paymentId, PayerID, or orderId"
//             });
//         }

//         // Obtener la orden de Supabase
//         const { data: order, error: orderError } = await supabase
//             .from('orders')
//             .select('*')
//             .eq('id', orderId)
//             .single(); 

//         if (orderError || !order) {
//             console.error("Error al obtener la orden:", orderError);
//             return res.status(404).json({
//                 success: false,
//                 message: "Order not found"
//             });
//         }

//         console.log("Orden encontrada:", order);

//         // Ejecutar el pago con PayPal
//         paypal.payment.execute(paymentId, { payer_id: PayerID }, async (error, payment) => {
//             if (error) {
//                 console.error('Error al ejecutar pago en PayPal:', error);
//                 return res.status(500).json({
//                     success: false,
//                     message: 'PayPal execution failed'
//                 });
//             }

//             // Actualizar la orden con el estado de pago y asegurarse de que cartId no se pierda
//             const { data: updatedOrder, error: updateError } = await supabase
//                 .from('orders')
//                 .update({
//                     paymentStatus: 'paid',
//                     orderStatus: 'confirmed',
//                     paymentId,
//                     payerId: PayerID,
//                     cartId: order.cartId  // Asegurarse que cartId no se pierda
//                 })
//                 .eq('id', orderId)
//                 .select()
//                 .single();

//             if (updateError) {
//                 console.error('Error al actualizar la orden:', updateError);
//                 return res.status(500).json({
//                     success: false,
//                     message: 'Error updating order payment'
//                 });
//             }

//             console.log("Orden actualizada correctamente:", updatedOrder);

//             // Eliminar todos los elementos de la tabla cart_items donde cartId sea igual al recibido
//             if (order.cartId) {
//                 const { error: cartItemsError } = await supabase
//                     .from('cart_items')
//                     .delete()
//                     .eq('cart_id', order.cartId);

//                 if (cartItemsError) {
//                     console.warn(`Error al eliminar items del carrito ID ${order.cartId}:`, cartItemsError);
//                 } else {
//                     console.log(`Items del carrito ID ${order.cartId} eliminados.`);
//                 }
//             } else {
//                 console.warn('El pedido no tiene un cartId asociado.');
//             }

//             return res.status(200).json({
//                 success: true,
//                 message: 'Order confirmed and cart items deleted',
//                 data: updatedOrder,
//                 redirectURL: "http://localhost:5173/shop/payment-success",  // Asegúrate de enviar esta URL correctamente

//             });
//         });

//     } catch (error) {
//         console.error('Error en capturePayment:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'An error occurred'
//         });
//     }
// };

const capturePayment = async (req, res) => {
    try {
        const { paymentId, PayerID, orderId } = req.query;  // PayPal envía estos datos en la URL

        // Verificar si los datos esenciales existen
        console.log("Recibido en capturePayment:", { paymentId, PayerID, orderId });

        if (!paymentId || !PayerID || !orderId) {
            return res.status(400).json({
                success: false,
                message: "Missing paymentId, PayerID, or orderId"
            });
        }

        // Obtener la orden de Supabase
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single(); 

        if (orderError || !order) {
            console.error("Error al obtener la orden:", orderError);
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        console.log("Orden encontrada:", order);

        // Ejecutar el pago con PayPal
        paypal.payment.execute(paymentId, { payer_id: PayerID }, async (error, payment) => {
            if (error) {
                console.error('Error al ejecutar pago en PayPal:', error);
                return res.status(500).json({
                    success: false,
                    message: 'PayPal execution failed'
                });
            }

            // Actualizar la orden con el estado de pago y asegurarse de que cartId no se pierda
            const { data: updatedOrder, error: updateError } = await supabase
                .from('orders')
                .update({
                    paymentStatus: 'paid',
                    orderStatus: 'confirmed',
                    paymentId,
                    payerId: PayerID,
                    cartId: order.cartId  // Asegurarse que cartId no se pierda
                })
                .eq('id', orderId)
                .select()
                .single();

            if (updateError) {
                console.error('Error al actualizar la orden:', updateError);
                return res.status(500).json({
                    success: false,
                    message: 'Error updating order payment'
                });
            }

            console.log("Orden actualizada correctamente:", updatedOrder);

            // Eliminar todos los elementos de la tabla cart_items donde cartId sea igual al recibido
            if (order.cartId) {
                const { error: cartItemsError } = await supabase
                    .from('cart_items')
                    .delete()
                    .eq('cart_id', order.cartId);

                if (cartItemsError) {
                    console.warn(`Error al eliminar items del carrito ID ${order.cartId}:`, cartItemsError);
                } else {
                    console.log(`Items del carrito ID ${order.cartId} eliminados.`);
                }
            } else {
                console.warn('El pedido no tiene un cartId asociado.');
            }

            // Redirigir a la página de éxito
            const redirectURL = "http://localhost:5173/shop/payment-success";  // Aquí se define la URL de redirección

            // Asegúrate de que el redirectURL esté presente en la respuesta
            return res.status(200).json({
                success: true,
                message: 'Order confirmed and cart items deleted',
                data: updatedOrder,
                redirectURL,  // Asegúrate de incluir redirectURL aquí
            });
        });

    } catch (error) {
        console.error('Error en capturePayment:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred'
        });
    }
};









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
