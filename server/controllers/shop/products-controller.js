const Product = require('../../models/Product');

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

module.exports = { getFilteredProducts };
