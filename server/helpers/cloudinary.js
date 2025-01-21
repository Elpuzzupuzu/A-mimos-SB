const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
    cloud_name : "dbogpb2mz",
    api_key : "277444742892654",
    api_secret : "Rbn3Q-xR7t38fMydSvar9RbVNuw"
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file){
    console.log("Subiendo imagen a Cloudinary:", file.slice(0, 100) + "..."); // Ver los primeros 100 caracteres

    const result = await cloudinary.uploader.upload(file, {
        resource_type : 'auto'
    })

    return result;

}


  

const upload = multer({storage});

module.exports = {upload ,imageUploadUtil};
