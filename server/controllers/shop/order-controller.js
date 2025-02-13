const paypal = require('../../helpers/paypal');
const Order = require('../../models/Order');

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
            payerId} = req.body;

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


const capturePayment = async(req , res) =>{
    try{

    }catch(error){
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'some error ocurred'
        })
    }
}

module.exports = {createOrder,capturePayment}