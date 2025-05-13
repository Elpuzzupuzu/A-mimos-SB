const express = require('express');
const { searchProducts } = require('../../controllers/shop/search-product-controller');

const router = express.Router();

// Ruta para buscar productos
router.get("/search", searchProducts);

module.exports = router;