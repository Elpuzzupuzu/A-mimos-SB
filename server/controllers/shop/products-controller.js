const Product = require('../../models/Product');






// const getFilteredProducts = async (req, res) => {
//     try {
//         const { category = [], brand = [], sortBy = "price-lowtohigh", page = 1, limit = 4} = req.query;

//         // Mostrar los parámetros recibidos
//         console.log('Received Query Params:', { category, brand, sortBy, page, limit });

//         let filters = {};

//         if (category.length) {
//             filters.category = { $in: category.split(',') };
//         }

//         if (brand.length) {
//             filters.brand = { $in: brand.split(',') };
//         }

//         // Mostrar los filtros que se aplicarán en la consulta
//         console.log('Filters:', filters);

//         let sort = {};

//         switch (sortBy) {
//             case 'price-lowtohigh':
//                 sort.price = 1;
//                 break;
//             case 'price-hightolow':
//                 sort.price = -1;
//                 break;
//             case 'title-atoz':
//                 sort.title = 1;
//                 break;
//             case 'title-ztoa':
//                 sort.title = -1;
//                 break;
//             default:
//                 sort.price = 1;
//                 break;
//         }

//         // Mostrar el criterio de ordenación
//         console.log('Sort:', sort);

//         const pageNum = parseInt(page, 10) || 1;
//         const limitNum = parseInt(limit, 6) || 2;
//         const skip = (pageNum - 1) * limitNum;

//         // Mostrar la información de paginación
//         console.log('Page:', pageNum);
//         console.log('Limit:', limitNum);
//         console.log('Skip:', skip);

//         // Contar el número total de productos que coinciden con los filtros
//         const totalProducts = await Product.countDocuments(filters);
//         console.log('Total Products:', totalProducts);

//         // Obtener los productos filtrados, ordenados y paginados
//         const products = await Product.find(filters).sort(sort).skip(skip).limit(limitNum);
//         console.log('Products:', products);

//         // Devolver los productos con información de paginación
//         res.status(200).json({
//             success: true,
//             data: products,
//             currentPage: pageNum,
//             totalPages: Math.ceil(totalProducts / limitNum),
//             totalProducts
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             message: 'Some error occurred'
//         });
//     }
// };


//FIN DEL CADIDATO



const getFilteredProducts = async (req, res) => {
    try {
        const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

        let filters = {};

        // Filtro por categoría
        if (category.length) {
            filters.category = { $in: category.split(',') };
        }

        // Filtro por marca
        if (brand.length) {
            filters.brand = { $in: brand.split(',') };
        }

        let sort = {};

        // Configurar el orden
        switch (sortBy) {
            case 'price-lowtohigh':
                sort.price = 1;
                break;

            case 'price-hightolow':
                sort.price = -1;
                break;

            case 'title-atoz':
                sort.title = 1;
                break;

            case 'title-ztoa':
                sort.title = -1;
                break;

            default:
                sort.price = 1;
                break;
        }

        // Obtener los productos con los filtros y orden
        const products = await Product.find(filters).sort(sort);

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

// Find product by ID product details
const getProductDetails = async (req, res) => {
    try {
        const { id } = req.params; // Extraer 'id' de req.params
        const product = await Product.findById(id);

        if (!product) {
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
