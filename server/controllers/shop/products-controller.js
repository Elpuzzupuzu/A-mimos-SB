const supabase = require('../../config/supabase'); // Asegúrate de importar el cliente de Supabase

// Obtener productos filtrados y ordenados
const getFilteredProducts = async (req, res) => {
    try {
        const { category = '', brand = '', sortBy = "price-lowtohigh" } = req.query;

        console.log('Received Filters:', { category, brand, sortBy });

        // Filtro solo por categoría
        let { data: products, error } = await supabase
            .from('products')
            .select('*')
            .eq('category', category); // Solo aplicar filtro de categoría

        console.log('Fetched Products (category filter):', products); // Verificar si se trae algún producto

        if (error) throw error;

        res.status(200).json({
            success: true,
            data: products
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
        });
    }
}


// Obtener producto por ID
const getProductDetails = async (req, res) => {
    try {
        const { id } = req.params; // Extraer 'id' de req.params
        
        // Obtener producto por ID en Supabase
        let { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)  // Filtrar por el ID del producto
            .single(); // Solo un producto (en MongoDB era findById)

        if (error) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error(error); 
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
        });
    }
};

module.exports = { getFilteredProducts, getProductDetails };
