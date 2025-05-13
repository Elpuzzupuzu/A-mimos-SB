const supabase = require('../../config/supabase'); // Importar Supabase

// Buscar productos con coincidencias parciales y paginación
const searchProducts = async (req, res) => {
    try {
        let { query, limit = 10, offset = 0 } = req.query;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Query parameter is required"
            });
        }
        
        // Convertir limit y offset a enteros
        limit = parseInt(limit);
        offset = parseInt(offset);
        
        // Buscar en title, description y category con LIKE
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .or(
                `title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`
            )
            .range(offset, offset + limit - 1); // Aplicar paginación
        
        if (error) throw error;
        
        res.status(200).json({
            success: true,
            data,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: "An error occurred while searching for products"
        });
    }
};

module.exports = { searchProducts };
