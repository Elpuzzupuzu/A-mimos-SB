

const   Address = require ('../../models/Address')

const addAddress = async( req ,res) =>{
    
    try{

        const{userId, address, city,pincode,phone,notes} = req.body;
        if(!userId || !address || !city || !pincode || !phone || !notes){
            return res.status(400).json({
                success : false,
                message : 'invalid data provide'
            })
        }

        const newlyCreatedAddress = new Address({
            userId,address,city,pincode,phone,notes
        })

        await newlyCreatedAddress.save();

        res.status(201).json({
            success : true,
            data : newlyCreatedAddress
        })


    }catch(error){
        console.log (error)
        res.status(500).json({
            success : false,
            message : 'something was wrong in the server'
        })
    }

}

//////

const fecthAllAddress = async( req ,res) =>{
    
    try{
        
        const {userId} = req.params
        if(!userId){
            return res.status(400).json({
                success : false,
                message : 'user Id is required!'
            })
        }
    
        const addressList = await Address.find({userId})
        res.status(200).json({
            success:true,
            data: addressList
        })

    }catch(error){
        console.log (error)
        res.status(500).json({
            success : false,
            message : 'something was wrong in the server'
        })
    }

}

//////

const editAddress = async( req ,res) =>{
    
    try{

        const {userId, addressId} = req.params;
        const formData =  req.body

        if(!userId || !addressId){
            return res.status(400).json({
                success : false,
                message : 'user Id and adreddId are required!'
            })
        }

        const address = await Address.findOneAndUpdate(
            {
            _id: addressId, userId
        }, formData,
        {new:  true}
    );

    if(!address){
        return res.status(404).json({
            success: false,
            message : 'address not found'
        })
    }

    res.status(200).json({
        success : true,
        data : address
    })


    }catch(error){
        console.log (error)
        res.status(500).json({
            success : false,
            message : 'something was wrong in the server'
        })
    }

}


//////

const deleteAddress = async( req ,res) =>{
    
    try{

        const {userId, addressId} = req.params;
        if(!userId || !addressId){
            return res.status(400).json({
                success : false,
                message : 'user Id and adreddId are required!'
            })
        }

        const address = await Address.findByIdAndDelete({_id : addressId, userId});
        if(!address){
            return res.status(404).json({
                success: false,
                message : 'address not found'
            })
        }

        res.status(200).json({
            succes: true,
            message : 'addres deleted successfully'
        })



    }catch(error){
        console.log (error)
        res.status(500).json({
            sucess : false,
            message : 'something was wrong in the server'
        })
    }

}

////

module.exports = {addAddress,fecthAllAddress,editAddress,deleteAddress}

