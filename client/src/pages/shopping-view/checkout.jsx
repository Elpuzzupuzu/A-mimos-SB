import Address from '@/components/shopping-view/address';
import img from '../../assets/checkbanner.jpg';
import { useDispatch, useSelector } from 'react-redux';
import UserCartItemstContent from '@/components/shopping-view/cart-items-content';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { createNewOrder } from '@/store/shop/order-slice';
import { useToast } from '@/hooks/use-toast';

function ShoppingCheckout() {
    const { cartItems } = useSelector(state => state.shopCart);
    const {user} =useSelector((state) => state.auth);
    const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
    const {approvalURL} = useSelector(state => state.shopOrder)
    const [isPaymentStart ,setIsPaymentStart] = useState(false)
    const dispatch = useDispatch()
    const {toast} = useToast();
    // console.log(cartItems, "prueba del checkout");

    // console.log(currentSelectedAddress, "address")

    function handleInitiatePaypalPayment(){

        const totalCartAmount = cartItems && cartItems.items && cartItems.items.length > 0
        ? cartItems.items.reduce((sum, currentItem) => 
            sum + ((currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price) * currentItem?.quantity), 0
        ) 
        : 0;
        if(cartItems && cartItems.items && cartItems.items.length === 0){
            toast({
                title : 'your cart is empty',
                variant : 'destructive'

            })

        }

        if(currentSelectedAddress === null){
            toast({
                title : 'please select one address to proceed',
                variant : 'destructive'

            })

        }


        
        if(cartItems.length === 0){
            toast({
                title : 'your card is empty ',
                variant : 'destructive'

            })

        }
        
        const orderData ={
            userId : user?.id,
            cartId : cartItems?._id,
            
            cartItems: cartItems.items.map(singleCartItem=> ({
                productId : singleCartItem?.id,
                title : singleCartItem?.title ,
                image : singleCartItem?.image,
                price : singleCartItem?.salePrice > 0 ? singleCartItem?.salePrice : singleCartItem?.price, 
                quantity : singleCartItem?.quantity
            })),
            addressInfo : {
                addressId : currentSelectedAddress?._id,
                address : currentSelectedAddress?.address,
                city : currentSelectedAddress?.city ,
                pincode : currentSelectedAddress?.pincode,
                phone : currentSelectedAddress?.phone,
                notes: currentSelectedAddress?.notes
            }, 
            orderStatus : 'pending',
            paymentMethods : 'paypal',
            paymentStatus : 'pending',
            totalAmount : totalCartAmount,
            orderDate : new Date(),
            orderUpdate : new Date(),
            paymentId : '',
            payerId : '',
        }

        console.log(orderData, "payment data");
        dispatch(createNewOrder(orderData)).then((data)=>{
            console.log(data , "data");
            if(data?.payload?.success){

                setIsPaymentStart(true)
            }else{
                setIsPaymentStart(false)
            }
            
        })
        
    }

    if(approvalURL){
        window.location.href = approvalURL
    }



    const totalCartAmount = cartItems && cartItems.items && cartItems.items.length > 0
        ? cartItems.items.reduce((sum, currentItem) => 
            sum + ((currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price) * currentItem?.quantity), 0
        ) 
        : 0;

    return (
        <div className="flex flex-col">
            {/* Banner de checkout */}
            <div className="relative h-[300px] w-full overflow-hidden">
                <img 
                    src={img} 
                    className="h-full w-full object-cover object-center" 
                    alt="Checkout banner"
                />
            </div>

            {/* Contenido del checkout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
                <Address setCurrentSelectedAddress={setCurrentSelectedAddress} />

                {/* Sección de items del carrito */}
                <div className="flex flex-col gap-4">
                    {cartItems && cartItems.items && cartItems.items.length > 0 ? (
                        cartItems.items.map(item => (
                            <UserCartItemstContent key={item._id} cartItem={item} />
                        ))
                    ) : (
                        <p>holaa</p>
                    )}

                    {/* Total del carrito */}
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between">
                            <span className="font-bold">Total:</span>
                            <span className="font-bold">${totalCartAmount}</span>
                        </div>
                    </div>
                        <div className='mt-4 w-full'>
                            <Button onClick={handleInitiatePaypalPayment}>
                                CheckOut with paypal
                            </Button>
                        </div>
                </div>
            </div>
        </div>
    );
}

export default ShoppingCheckout;















///TEST


// import Address from '@/components/shopping-view/address';
// import img from '../../assets/checkbanner.jpg';
// import { useDispatch, useSelector } from 'react-redux';
// import UserCartItemstContent from '@/components/shopping-view/cart-items-content';
// import { Button } from '@/components/ui/button';
// import { useState } from 'react';
// import { createNewOrder } from '@/store/shop/order-slice';
// import { useToast } from '@/hooks/use-toast';
// import { Card } from '@/components/ui/card';

// function ShoppingCheckout() {
//     const { cartItems } = useSelector(state => state.shopCart);
//     const {user} = useSelector((state) => state.auth);
//     const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
//     const {approvalURL} = useSelector(state => state.shopOrder);
//     const [isPaymentStart, setIsPaymentStart] = useState(false);
//     const dispatch = useDispatch();
//     const {toast} = useToast();

//     function handleInitiatePaypalPayment(){
//         const totalCartAmount = cartItems && cartItems.items && cartItems.items.length > 0
//         ? cartItems.items.reduce((sum, currentItem) => 
//             sum + ((currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price) * currentItem?.quantity), 0
//         ) 
//         : 0;
        
//         if(cartItems && cartItems.items && cartItems.items.length === 0){
//             toast({
//                 title : 'your cart is empty',
//                 variant : 'destructive'
//             });
//             return;
//         }

//         if(currentSelectedAddress === null){
//             toast({
//                 title : 'please select one address to proceed',
//                 variant : 'destructive'
//             });
//             return;
//         }
        
//         const orderData = {
//             userId : user?.id,
//             cartId : cartItems?._id,
//             cartItems: cartItems.items.map(singleCartItem=> ({
//                 productId : singleCartItem?.id,
//                 title : singleCartItem?.title,
//                 image : singleCartItem?.image,
//                 price : singleCartItem?.salePrice > 0 ? singleCartItem?.salePrice : singleCartItem?.price, 
//                 quantity : singleCartItem?.quantity
//             })),
//             addressInfo : {
//                 addressId : currentSelectedAddress?._id,
//                 address : currentSelectedAddress?.address,
//                 city : currentSelectedAddress?.city,
//                 pincode : currentSelectedAddress?.pincode,
//                 phone : currentSelectedAddress?.phone,
//                 notes: currentSelectedAddress?.notes
//             }, 
//             orderStatus : 'pending',
//             paymentMethods : 'paypal',
//             paymentStatus : 'pending',
//             totalAmount : totalCartAmount,
//             orderDate : new Date(),
//             orderUpdate : new Date(),
//             paymentId : '',
//             payerId : '',
//         };

//         dispatch(createNewOrder(orderData)).then((data)=>{
//             if(data?.payload?.success){
//                 setIsPaymentStart(true);
//             } else {
//                 setIsPaymentStart(false);
//             }
//         });
//     }

//     if(approvalURL){
//         window.location.href = approvalURL;
//     }

//     const totalCartAmount = cartItems && cartItems.items && cartItems.items.length > 0
//         ? cartItems.items.reduce((sum, currentItem) => 
//             sum + ((currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price) * currentItem?.quantity), 0
//         ) 
//         : 0;

//     return (
//         <div className="flex flex-col">
//             <div className="relative h-[300px] w-full overflow-hidden">
//                 <img 
//                     src={img} 
//                     className="h-full w-full object-cover object-center" 
//                     alt="Checkout banner"
//                 />
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
//                 {/* Address section with selectedAddress indication */}
//                 <div className="flex flex-col gap-4">
//                     <h2 className="text-2xl font-bold">Select Delivery Address</h2>
//                     <Card className={`p-4 ${currentSelectedAddress ? 'border-2 border-blue-500 bg-blue-50' : ''}`}>
//                         <Address 
//                             setCurrentSelectedAddress={setCurrentSelectedAddress} 
//                             currentSelectedAddress={currentSelectedAddress}
//                         />
//                     </Card>
//                 </div>

//                 <div className="flex flex-col gap-4">
//                     {cartItems && cartItems.items && cartItems.items.length > 0 ? (
//                         cartItems.items.map(item => (
//                             <UserCartItemstContent key={item._id} cartItem={item} />
//                         ))
//                     ) : (
//                         <p>Your cart is empty</p>
//                     )}

//                     <div className="mt-8 space-y-4">
//                         <div className="flex justify-between">
//                             <span className="font-bold">Total:</span>
//                             <span className="font-bold">${totalCartAmount}</span>
//                         </div>
//                     </div>
//                     <div className='mt-4 w-full'>
//                         <Button 
//                             onClick={handleInitiatePaypalPayment}
//                             className="w-full"
//                             disabled={!currentSelectedAddress || !cartItems?.items?.length}
//                         >
//                             Checkout with PayPal
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ShoppingCheckout;