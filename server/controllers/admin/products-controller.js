const { ImageUploadUtil } = require("../../helpers/cloudinary");
const product = require("../../models/product");



const handleImageUpload = async(req, res)=>{
    try{
        
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const url = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await ImageUploadUtil(url); // OJO CON ESTO NECESITA ESTAR CORRECTO PARA QUE SE INTERPRETE EN Cloudinary

        res.json({
            succes : true,
            result
        })

    }catch(error){
        console.log(error);
        res.json({
            success : false,
            message : 'error ocurred'
        })
    }
}

//add a new product

const addProduct = async (req,res)=>{
    try{
        const {image,title,description,category,brand,price,salePrice, totalStock} = req.body;
        const newlyCreatedProduct = new product({
            image,title,description,category,brand,price,salePrice, totalStock

        })

        await newlyCreatedProduct.save();
        res.status(201).json({
            success : true,
            data : newlyCreatedProduct
        });


    }catch(e){
        res.status(500).json({
            succes : false,
            message: "Error occured"
        });
    }

}



//fetch all products

const fetchAllProducts = async(req,res)=>{
    try{ 
        
        const listOfProducts = await product.find({});
        res.status.json({
            success : true,
            data: listOfProducts
        })
    }catch(e){
        res.status(500).json({
            succes : false,
            message: "Error occured"
        });
    }
}

//edit a product

const editProduct = async(req,res)=>{
    try{
        const{id} = req.params;
        const {image,title,description,category,brand,price,salePrice, totalStock} = req.body;

        const findProduct = await product.findById(id);
        if(!findProduct) return res.status(404).json({
            success : false,
            message : "product NOT found :("
        });

        product.title = title || findProduct.title
        product.title = description || findProduct.description
        product.title = category || findProduct.category
        product.title = brand || findProduct.brand
        product.title = price || findProduct.price
        product.title = salePrice || findProduct.salePrice
        product.title = totalStock || findProduct.totalStock
        product.title = image || findProduct.image

        await findProduct.save();
        res.status(200).json({
            success : true,
            data : findProduct

        })


        product.title = title || findProduct.title




    }catch(e){
        res.status(500).json({
            succes : false,
            message: "Error occured"
        });
    }
}

//delete product

const deleteProduct =async(req,res)=>{
    try{
        const {id} = req.params
        const product = await product.findByIdAndUpdate(id);
        if(!product) return res.status(404).json({
            success : false,
            message : "product NOT found :("
        })
        res.status(200).json({
            succes : true, 
            message : "Product deleted successfully :)"
        })
            

    }catch(e){
        res.status(500).json({
            succes : false,
            message: "Error occured"
        });
    }
}

module.exports ={handleImageUpload, addProduct,fetchAllProducts,editProduct,deleteProduct}