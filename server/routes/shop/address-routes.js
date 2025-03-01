const express = require('express');
const { addAddress, fetchAllAddress, editAddress, deleteAddress } = require('../../controllers/shop/address-controller');

const router = express.Router();

// Rutas de direcciones
router.post('/add', addAddress);
router.get('/get/:userId', fetchAllAddress); // Corregido el nombre de la función
router.put('/update/:userId/:addressId', editAddress);
router.delete('/delete/:userId/:addressId', deleteAddress);

module.exports = router;
