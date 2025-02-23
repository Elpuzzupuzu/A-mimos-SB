

const Order = require ('../../models/Order')





const getAllOrdersOfAllUsers = async (req, res) => {
    
    try{

        const orders = await Order.find({})
        if(!orders.length){
            return res.status(404).json({
                success : false,
                message : "no orders found"
            })
        }
        res.status(200).json({
            success : true,
            data : orders   //<--------- hace referencia al await
        }
            
        )

    }catch(error){
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'some error ocurred'
        })
    }
    
    
}


const getOrderDetailsForAdmin = async (req, res) => {
    
    try{
    const {id} = req.params;

    const order = await Order.findById(id)
    if(!order){
        return res.status(404).json({
            success : false,
            message : "order not found"
        })
    }
    res.status(200).json({
        success : true,
        data : order  //<--------- hace referencia al await O rder
    }
        
    )

    



    }catch(error){
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'some error ocurred'
        })
    }
    
    
}


module.exports={getAllOrdersOfAllUsers,getOrderDetailsForAdmin} 