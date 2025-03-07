
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
            .select()
            .single();

        if (orderError) {
            console.error('❌ Error al insertar la orden en Supabase:', orderError);
            return res.status(500).json({
                success: false,
                message: 'Error al guardar la orden en la base de datos',
                error: orderError.message
            });
        }

        console.log('✅ Orden insertada correctamente:', order);

        // Crear un pago con PayPal
        const paymentPayload = {
            intent: 'sale',
            payer: { payment_method: 'paypal' },
            redirect_urls: {
                return_url: `http://localhost:5173/shop/paypal-return?orderId=${order.id}`,
                cancel_url: 'http://localhost:5173/shop/payment-cancel'
            },
            transactions: [{
                amount: {
                    total: totalAmount.toFixed(2),
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

            const approvalURL = payment.links.find(link => link.rel === 'approval_url')?.href;

            if (!approvalURL) {
                return res.status(500).json({ success: false, message: 'Approval URL not found' });
            }

            res.status(201).json({
                success: true,
                approvalURL,
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

const capturePayment = async (req, res) => {
    try {
        const { paymentId, PayerID, orderId } = req.body;
        console.log("Recibido en capturePayment:", { paymentId, PayerID, orderId });

        if (!paymentId || !PayerID || !orderId) {
            return res.status(400).json({
                success: false,
                message: "Missing paymentId, PayerID, or orderId"
            });
        }

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

        paypal.payment.execute(paymentId, { payer_id: PayerID }, async (error, payment) => {
            if (error) {
                console.error('Error al ejecutar pago en PayPal:', error);
                return res.status(500).json({ success: false, message: 'PayPal execution failed' });
            }

            const { data: updatedOrder, error: updateError } = await supabase
                .from('orders')
                .update({
                    paymentStatus: 'paid',
                    orderStatus: 'confirmed',
                    paymentId,
                    payerId: PayerID
                })
                .eq('id', orderId)
                .select()
                .single();

            if (updateError) {
                console.error('Error al actualizar la orden:', updateError);
                return res.status(500).json({ success: false, message: 'Error updating order payment' });
            }

            console.log("Orden actualizada correctamente:", updatedOrder);

            return res.status(200).json({
                success: true,
                message: 'Order confirmed and cart items deleted',
                data: updatedOrder
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
