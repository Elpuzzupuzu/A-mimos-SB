const supabase = require('../../config/supabase'); // Importamos el cliente de Supabase
const { imageUploadUtil } = require("../../helpers/cloudinary");

// Subir imagen
const handleImageUpload = async (req, res) => {
    try {
        console.log("Recibiendo solicitud de subida...");

        if (!req.file) {
            console.log("No se recibió archivo en la solicitud.");
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        // Convertir buffer a base64
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const url = `data:${req.file.mimetype};base64,${b64}`;

        const result = await imageUploadUtil(url);  // Subir la imagen a Cloudinary

        res.json({
            success: true,
            result,
        });
    } catch (error) {
        console.error("❌ Error en subida de imagen:", error);

        res.status(500).json({
            success: false,
            message: "Error en el servidor",
            error: error.message,
        });
    }
};

// Añadir un nuevo producto
const addProduct = async (req, res) => {
    try {
        const {
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock,
        } = req.body;

        // Insertar el producto en Supabase
        const { data, error } = await supabase
            .from('products')
            .insert([
                {
                    image,
                    title,
                    description,
                    category,
                    brand,
                    price,
                    salePrice,
                    totalStock,
                    
                }
            ])
            .select()
            .single();  // Insertar y obtener el producto creado

        if (error) throw error;

        res.status(201).json({
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

// Obtener todos los productos
const fetchAllProducts = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*');  // Obtener todos los productos de la tabla

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

// Editar un producto
const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock,
        } = req.body;

        // Buscar el producto por ID
        let { data: findProduct, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !findProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Actualizar el producto
        const updatedProduct = {
            title: title || findProduct.title,
            description: description || findProduct.description,
            category: category || findProduct.category,
            brand: brand || findProduct.brand,
            price: price || findProduct.price,
            salePrice: salePrice || findProduct.salePrice,
            totalStock: totalStock || findProduct.totalStock,
            image: image || findProduct.image,
            
        };

        // Actualizar el producto en Supabase
        const { data, error: updateError } = await supabase
            .from('products')
            .update(updatedProduct)
            .eq('id', id)
            .select()
            .single();

        if (updateError) throw updateError;

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

// Eliminar un producto
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Eliminar el producto por ID
        const { data, error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Error occurred",
        });
    }
};

module.exports = {
    handleImageUpload,
    addProduct,
    fetchAllProducts,
    editProduct,
    deleteProduct,
};
