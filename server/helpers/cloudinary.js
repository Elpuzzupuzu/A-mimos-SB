const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
    cloud_name : "dbogpb2mz",
    api_key : "277444742892654",
    api_secret : "Rbn3Q-xR7t38fMydSvar9RbVNuw"
});

const storage = new multer.memoryStorage();

async function ImageUploadUtil(file){
    const result = await cloudinary.uploader.upload(file, {
        resource_type : 'auto'
    })

    return result;

}


  

const upload = multer({storage});

module.exports = {upload ,ImageUploadUtil};
