const express = require('express');
const { addToCart, fetchCartItems, deleteCartItem, updateCartQuantity,getCartId } = require('../../controllers/shop/cart-controller');

const router = express.Router();

router.post('/add', addToCart);
router.get('/get/:userId', fetchCartItems); // <-- Corrección aquí
router.put('/update-cart', updateCartQuantity); // <-- Corrección aquí
router.delete('/:userId/:productId', deleteCartItem);
router.get('/cart-id/:userId',getCartId)
module.exports = router;
