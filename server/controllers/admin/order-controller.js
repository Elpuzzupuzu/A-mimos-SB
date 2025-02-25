

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


////


const updateOrderStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { orderStatus } = req.body;
  
      console.log("ID recibido:", id);
      console.log("Nuevo estado recibido:", orderStatus);
  
      // Verifica si `orderStatus` está presente
      if (!orderStatus) {
        return res.status(400).json({ success: false, message: "El estado del pedido es obligatorio" });
      }
  
      // Verifica si el pedido existe
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ success: false, message: "Pedido no encontrado" });
      }
  
      // Actualiza el pedido y devuelve la versión actualizada
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { orderStatus },
        { new: true } // Devuelve el documento actualizado
      );
  
      return res.status(200).json({
        success: true,
        message: "El estado del pedido se actualizó correctamente",
        data: updatedOrder
      });
    } catch (error) {
      console.error("Error al actualizar el pedido:", error);
      return res.status(500).json({ success: false, message: "Error del servidor" });
    }
  };
  




////



module.exports={
    getAllOrdersOfAllUsers,
    getOrderDetailsForAdmin,
    updateOrderStatus
} 