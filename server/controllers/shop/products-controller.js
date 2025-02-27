const supabase = require('../../config/supabase'); // Asegúrate de importar el cliente de Supabase

// Obtener productos filtrados y ordenados

// Obtener productos con filtros dinámicos
const getFilteredProducts = async (req, res) => {
    try {
        let { title, category, brand, minPrice, maxPrice, sortBy } = req.query;
        let query = supabase.from("products").select("*");

        // Aplicar filtros condicionales
        if (title) query = query.ilike("title", `%${title}%`);
        if (category) query = query.eq("category", category);
        if (brand) query = query.eq("brand", brand);
        if (minPrice) query = query.gte("price", minPrice);
        if (maxPrice) query = query.lte("price", maxPrice);

        // Ordenar resultados
        if (sortBy === "price-highlow") {
            query = query.order("price", { ascending: false });
        } else if (sortBy === "price-lowtohigh") {
            query = query.order("price", { ascending: true });
        }

        // Ejecutar la consulta
        const { data, error } = await query;

        if (error) throw error;

        res.status(200).json({
            success: true,
            data,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Error occurred",
        });
    }
};







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
