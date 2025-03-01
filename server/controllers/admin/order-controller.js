const supabase = require('../../config/supabase');

// Obtener todas las órdenes de todos los usuarios
const getAllOrdersOfAllUsers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*'); // Obtenemos todas las órdenes

        if (error || !data.length) {
            return res.status(404).json({
                success: false,
                message: 'No orders found'
            });
        }

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
        });
    }
};

// Obtener detalles de una orden para el administrador
const getOrderDetailsForAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener la orden específica por su id
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single(); // Usamos single() para asegurarnos de que solo recibimos una orden

        if (error || !data) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
        });
    }
};

// Actualizar el estado de una orden
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;

        if (!orderStatus) {
            return res.status(400).json({
                success: false,
                message: 'El estado del pedido es obligatorio'
            });
        }

        // Verificar si la orden existe
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Actualizar el estado de la orden
        const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update({ orderStatus })
            .eq('id', id)
            .single(); // Devuelve el documento actualizado

        if (updateError) {
            throw updateError;
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: updatedOrder
        });

    } catch (error) {
        console.error("Error updating the order:", error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    getAllOrdersOfAllUsers,
    getOrderDetailsForAdmin,
    updateOrderStatus
};
