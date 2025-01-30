const express = require('express');

const{ 
    getFilteredProducts
    

} =require('../../controllers/shop/products-controller');


const router = express.Router();

// router.post("/upload-image", upload.single("my_file"),handleImageUpload)
// router.post("/add",addProduct)
// router.put("/edit/:id",editProduct)
// router.delete("/delete/:id",deleteProduct)
router.get("/get",getFilteredProducts)

module.exports = router;