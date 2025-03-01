const supabase = require('../../config/supabase');

// Crear una orden
const createOrder = async (req, res) => {
    try {
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

        // Primero, crear la orden en Supabase
        const { data: order, error } = await supabase
            .from('orders')
            .insert([
                {
                    userId,
                    cartId,
                    cartItems: JSON.stringify(cartItems), // Almacenar los cartItems como JSON
                    addressInfo: JSON.stringify(addressInfo), // Almacenar addressInfo como JSON
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
            .single(); // Solo una orden insertada

        if (error) {
            throw error;
        }

        // Aquí estamos simulando el proceso de pago con PayPal (puedes integrarlo con tu lógica de PayPal)
        // Obtener el enlace de aprobación desde la respuesta de PayPal
        const approvalURL = "https://www.paypal.com/approve-order"; // Esto es solo un placeholder

        res.status(201).json({
            success: true,
            approvalURL,
            orderId: order.id // Aquí usamos el ID de Supabase
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error occurred while creating order'
        });
    }
};

// Confirmar pago de la orden
const capturePayment = async (req, res) => {
    try {
        const { paymentId, payerId, orderId } = req.body;

        // Obtener la orden de Supabase
        const { data: order, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single(); // Solo una orden

        if (error || !order) {
            return res.status(404).json({
                success: false,
                message: 'Order cannot be found'
            });
        }

        // Actualizar la orden con el estado de pago
        const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update({
                paymentStatus: 'paid',
                orderStatus: 'confirmed',
                paymentId,
                payerId
            })
            .eq('id', orderId)
            .single(); // Solo una orden actualizada

        if (updateError) {
            throw updateError;
        }

        // Verificar que el carrito esté asociado antes de eliminarlo
        if (order.cartId) {
            const { data: cart, error: cartError } = await supabase
                .from('carts')
                .delete()
                .eq('id', order.cartId)
                .single();

            if (cartError) {
                console.warn(`El carrito con ID ${order.cartId} no existe o ya fue eliminado.`);
            }
        } else {
            console.warn("El pedido no tiene un CartId asociado.");
        }

        res.status(200).json({
            success: true,
            message: 'Order confirmed and cart deleted',
            data: updatedOrder
        });

    } catch (error) {
        console.error("Error en capturePayment:", error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
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
