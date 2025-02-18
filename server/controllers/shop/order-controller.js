const paypal = require('../../helpers/paypal');
const Order = require('../../models/Order');
const Cart = require('../../models/Cart');


const createOrder = async(req , res) =>{
    try{
        const{
            userId,
            cartItems,
            addressInfo, 
            orderStatus,
            paymentMethods,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdate,
            paymentId,
            payerId,
            cartId
            } = req.body;

            const create_payment_json ={
                intent : 'sale',
                payer : {
                    payment_method : 'paypal'

                },
                redirect_urls:{
                    return_url :'http://localhost:5173/shop/paypal-return',
                    cancel_url : 'http://localhost:5173/shop/paypal-cancel'
                },
                transactions:[
                    {
                        items_list :{
                            items : cartItems.map(item => ({
                                name : item.title,
                                sku : item.productId,
                                price : item.price.toFixed(2),
                                currency : 'USD',
                                quantity : item.quantity
                            }))
                        },
                        amount : {
                            currency : 'USD',
                            total : totalAmount.toFixed(2)
                        },
                        description  : 'description'
                    }
                ]
            }

            paypal.payment.create(create_payment_json,async(error,paymentInfo)=> {
                if(error){
                    console.log(error)
                    return res.status(500).json({
                        success : false, 
                        message : 'error while creating paypal payment'
                    })
                }else{
                    const newlyCreatedOrder = new Order({
                        userId,
                        cartId,
                        cartItems,
                        addressInfo, 
                        orderStatus,
                        paymentMethods,
                        paymentStatus,
                        totalAmount,
                        orderDate,
                        orderUpdate,
                        paymentId,
                        payerId,

                    })
                    await newlyCreatedOrder.save();
                    const approvalURL = paymentInfo.links.find(link => link.rel ==='approval_url').href;
                    
                    res.status(201).json({
                        success: true,
                        approvalURL,
                        orderId : newlyCreatedOrder._id
                    })
                }
            })





    }catch(error){
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'some error ocurred'
        })
    }
}


// 


const capturePayment = async (req, res) => {
    try {
        const { paymentId, payerId, orderId } = req.body;
        let order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order cannot be found'
            });
        }

        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed';
        order.paymentId = paymentId;
        order.payerId = payerId;

        // Verificar que el carrito existe antes de eliminarlo
        if (order.cartId) {
            const cart = await Cart.findByIdAndDelete(order.cartId);
            if (!cart) {
                console.warn(`El carrito con ID ${order.cartId} no existe o ya fue eliminado.`);
            }
        } else {
            console.warn("El pedido no tiene un CartId asociado.");
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order confirmed and cart deleted',
            data: order
        });

    } catch (error) {
        console.error("Error en capturePayment:", error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
        });
    }
};


module.exports = {createOrder,capturePayment}