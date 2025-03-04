const supabase = require('../../config/supabase');

// Agregar una nueva dirección
// Backend: Creación de dirección
const addAddress = async (req, res) => {
    try {
        const { userId, address, city, pincode, phone, notes } = req.body;

        if (!userId || !address || !city || !pincode || !phone || !notes) {
            return res.status(400).json({
                success: false,
                message: 'Invalid data provided'
            });
        }

        const { data, error } = await supabase
            .from('addresses')
            .insert([{
                userId,
                address,
                city,
                pincode,
                phone,
                notes
            }])
            .single(); // Insertar una sola dirección

        if (error) {
            console.log("Error al insertar la dirección:", error);
            throw error;
        }

        // console.log("Dirección insertada exitosamente:", data); // Verificar los datos insertados

        res.status(201).json({
            success: true,
            data  // Asegúrate de que los datos se estén devolviendo correctamente
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong on the server'
        });
    }
};


// Obtener todas las direcciones de un usuario
const fetchAllAddress = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // console.log("User ID recibido:", userId); // Solo una vez
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required!'
            });
        }

        // Realiza la consulta de direcciones solo una vez
        const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .eq('userId', userId);

        if (error) {
            return res.status(500).json({
                success: false,
                message: 'Error fetching addresses',
                error: error.message
            });
        }

        console.log("Direcciones obtenidas:", data); // Verifica que esto solo se muestre una vez

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        console.error("Error en fetchAllAddress:", error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong on the server'
        });
    }
};


// Editar una dirección existente
const editAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;
        const formData = req.body;

        console.log("Datos recibidos para editar la dirección:", { userId, addressId, formData }); // Log de los datos recibidos

        if (!userId || !addressId) {
            return res.status(400).json({
                success: false,
                message: 'User ID and Address ID are required!'
            });
        }

        const { data, error } = await supabase
            .from('addresses')
            .update(formData)
            .match({ id: addressId, userId })
            .single(); // Actualizar una sola dirección

        if (error || !data) {
            console.log("Error al editar la dirección:", error); // Log de error al editar
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        console.log("Dirección editada exitosamente:", data); // Log de la dirección editada

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        console.log("Error en editAddress:", error); // Log del error
        res.status(500).json({
            success: false,
            message: 'Something went wrong on the server'
        });
    }
};

// Eliminar una dirección
// Eliminar una dirección
const deleteAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;  // Usamos req.params para obtener los IDs desde la URL

        if (!userId || !addressId) {
            return res.status(400).json({
                success: false,
                message: 'User ID and Address ID are required!'
            });
        }

        // Eliminar la dirección en Supabase
        const { data, error } = await supabase
            .from('addresses')
            .delete()
            .match({ id: addressId, userId })
            .single();  // Eliminar solo una dirección

        // Verificar si hubo un error o si no se encontró la dirección
        if (error || !data) {
            console.log("Error al eliminar dirección:", error);  // Log detallado del error
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        // Si todo fue bien, logueamos la dirección eliminada
        console.log("Dirección eliminada con éxito:", data);  // Log de la dirección eliminada

        // Respondemos con éxito
        res.status(200).json({
            success: true,
            message: 'Address deleted successfully',
            data  // Retornamos los datos de la dirección eliminada
        });
    } catch (error) {
        console.error("Error al eliminar dirección:", error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong on the server'
        });
    }
};
module.exports = { addAddress, fetchAllAddress, editAddress, deleteAddress };
