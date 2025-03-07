import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { createNewOrder } from '@/store/shop/order-slice';
import { useToast } from '@/hooks/use-toast';
import { fetchCartId } from '@/store/shop/cart-slice';
import UserCartItemstContent from '@/components/shopping-view/cart-items-content';
import { Button } from '@/components/ui/button';
import Address from '@/components/shopping-view/address';
import img from '../../assets/checkbanner.jpg';
import { useSearchParams, useNavigate } from "react-router-dom";

function ShoppingCheckout() {
    const { cartItems } = useSelector(state => state.shopCart);
    const { user } = useSelector((state) => state.auth);
    const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
    const { approvalURL } = useSelector(state => state.shopOrder);
    const [isPaymentStart, setIsPaymentStart] = useState(false);
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { cartId } = useSelector(state => state.shopCart);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.id && !cartId) {
            dispatch(fetchCartId(user.id)); 
        }
    }, [dispatch, user?.id, cartId]);

    const totalCartAmount = cartItems?.items?.length > 0
        ? cartItems.items.reduce((sum, currentItem, index) => {
            const price = Number(currentItem?.products?.salePrice ?? currentItem?.products?.price);
            const quantity = Number(currentItem?.quantity);

            if (isNaN(price) || isNaN(quantity)) {
                console.warn(`Invalid data in item ${index}: Price or Quantity is NaN`);
                return sum;
            }

            return sum + (price * quantity);
        }, 0)
        : 0;

    function handleInitiatePaypalPayment() {
        if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
            toast({ title: 'Your cart is empty', variant: 'destructive' });
            return;
        }
    
        if (currentSelectedAddress === null) {
            toast({ title: 'Please select one address to proceed', variant: 'destructive' });
            return;
        }
    
        setIsPaymentStart(true);
    
        const orderData = {
            userId: user?.id,
            cartId: cartId,
            cartItems: cartItems.items.map(singleCartItem => ({
                productId: singleCartItem?.product_id,
                title: singleCartItem?.products?.title,
                image: singleCartItem?.products?.image,
                price: singleCartItem?.products?.salePrice > 0 ? singleCartItem?.products?.salePrice : singleCartItem?.products?.price,
                quantity: singleCartItem?.quantity
            })),
            addressInfo: {
                addressId: currentSelectedAddress?.id,
                address: currentSelectedAddress?.address,
                city: currentSelectedAddress?.city,
                pincode: currentSelectedAddress?.pincode,
                phone: currentSelectedAddress?.phone,
                notes: currentSelectedAddress?.notes
            },
            orderStatus: 'pending',
            paymentMethods: 'paypal',
            paymentStatus: 'pending',
            totalAmount: totalCartAmount,
            orderDate: new Date(),
            orderUpdate: new Date(),
            paymentId: '',
            payerId: '',
        };
    
        dispatch(createNewOrder(orderData)).then((data) => {
            if (data?.payload?.success) {
                const redirectURL = data?.payload?.approvalURL;
    
                if (redirectURL) {
                    console.log("Redirigiendo a: ", redirectURL);
                    window.location.href = redirectURL;
                } else {
                    toast({ title: "Error: No redirect URL found", variant: "destructive" });
                }
            } else {
                setIsPaymentStart(false);
            }
        });
    }

    // useEffect(() => {
    //     // Capturamos los parámetros de la URL
    //     const paymentId = searchParams.get("paymentId");
    //     const payerId = searchParams.get("PayerID");
    //     const orderId = searchParams.get("orderId");
    
    //     // Verificamos que los parámetros no sean null antes de continuar
    //     if (paymentId && payerId && orderId) {
    //         console.log("📩 Enviando datos al backend:", { paymentId, payerId, orderId });
    
    //         fetch("http://localhost:5000/api/shop/orders/capture", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ paymentId, payerId, orderId })
    //         })
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log("📩 Respuesta del backend:", data);
    //             if (data.success) {
    //                 navigate("/shop/payment-success");
    //             } else {
    //                 navigate("/shop/payment-failed");
    //             }
    //         })
    //         .catch(error => {
    //             console.error("❌ Error en fetch:", error);
    //             navigate("/shop/payment-failed");
    //         });
    //     } else {
    //         console.error("Faltan parámetros en la URL:", { paymentId, payerId, orderId });
    //     }
    // }, [searchParams, navigate]);
    

    

    return (
        <div className="flex flex-col">
            <div className="relative h-[300px] w-full overflow-hidden">
                <img 
                    src={img} 
                    className="h-full w-full object-cover object-center" 
                    alt="Checkout banner"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
                <Address setCurrentSelectedAddress={setCurrentSelectedAddress} />

                <div className="flex flex-col gap-4">
                    {cartItems && cartItems.items && cartItems.items.length > 0 ? (
                        cartItems.items.map(item => (
                            <UserCartItemstContent key={item._id} cartItem={item} />
                        ))
                    ) : (
                        <p>Your cart is empty</p>
                    )}

                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between">
                            <span className="font-bold">Total:</span>
                            <span className="font-bold">${totalCartAmount}</span>
                        </div>
                    </div>

                    <div className="mt-4 w-full">
                        <Button 
                            onClick={handleInitiatePaypalPayment}
                            disabled={!currentSelectedAddress || !cartItems?.items?.length || isPaymentStart}
                        >
                            Checkout with PayPal
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShoppingCheckout;



// import Address from '@/components/shopping-view/address';
// import img from '../../assets/checkbanner.jpg';
// import { useDispatch, useSelector } from 'react-redux';
// import UserCartItemstContent from '@/components/shopping-view/cart-items-content';
// import { Button } from '@/components/ui/button';
// import { useEffect, useState } from 'react';
// import { createNewOrder } from '@/store/shop/order-slice';
// import { useToast } from '@/hooks/use-toast';
// import { fetchCartId } from '@/store/shop/cart-slice';

// function ShoppingCheckout() {
//     const { cartItems } = useSelector(state => state.shopCart);
//     const { user } = useSelector((state) => state.auth);
//     const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
//     const { approvalURL } = useSelector(state => state.shopOrder);
//     const [isPaymentStart, setIsPaymentStart] = useState(false);
//     const dispatch = useDispatch();
//     const { toast } = useToast();
//     const{cartId}  = useSelector(state => state.shopCart);



    
    
    

//     // Asignar cartId a una constante dentro del useEffect
//     useEffect(() => {
//         // Verifica que user.id exista y que cartId no haya sido asignado
//         if (user?.id && !cartId) {
//             dispatch(fetchCartId(user.id)); // Despachar solo si cartId no está disponible
//         }
//     }, [dispatch, user?.id, cartId]);  // Dependencias: user.id y cartId

//     // Asignar el cartId a una constante después de que se haya despachado
//     const currentCartId = cartId;  // Asignamos el valor de cartId a una constante local


//     // Calcular el total del carrito
//     const totalCartAmount = cartItems?.items?.length > 0 
//     ? cartItems.items.reduce((sum, currentItem, index) => {
//         // Accede correctamente a salePrice y price dentro de products
//         const price = Number(currentItem?.products?.salePrice ?? currentItem?.products?.price);
//         const quantity = Number(currentItem?.quantity);
        
        
//         if (isNaN(price) || isNaN(quantity)) {
//             console.warn(`Invalid data in item ${index}: Price or Quantity is NaN`);
//             return sum; // Salta este item si alguno de los valores es NaN
//         }
        
//         return sum + (price * quantity);
//     }, 0)
//     : 0;


//     //  console.log(cartItems, "estructura")
       

//     function handleInitiatePaypalPayment() {
//         if (cartItems && cartItems.items && cartItems.items.length === 0) {
//             toast({
//                 title: 'Your cart is empty',
//                 variant: 'destructive'
//             });
//             return;
//         }
    
//         if (currentSelectedAddress === null) {
//             toast({
//                 title: 'Please select one address to proceed',
//                 variant: 'destructive'
//             });
//             return;
//         }
    
//         // 🔹 Deshabilitar botón para evitar múltiples clics
//         setIsPaymentStart(true);
    
//         console.log('Cart Items before creating order:', cartItems.items);
    
//         const orderData = {
//             userId: user?.id,
//             cartId: currentCartId,
//             cartItems: cartItems.items.map(singleCartItem => ({
//                 productId: singleCartItem?.product_id,
//                 title: singleCartItem?.products?.title,
//                 image: singleCartItem?.products?.image,
//                 price: singleCartItem?.products?.salePrice > 0 ? singleCartItem?.products?.salePrice : singleCartItem?.products?.price,
//                 quantity: singleCartItem?.quantity
//             })),
//             addressInfo: {
//                 addressId: currentSelectedAddress?.id,
//                 address: currentSelectedAddress?.address,
//                 city: currentSelectedAddress?.city,
//                 pincode: currentSelectedAddress?.pincode,
//                 phone: currentSelectedAddress?.phone,
//                 notes: currentSelectedAddress?.notes
//             },
//             orderStatus: 'pending',
//             paymentMethods: 'paypal',
//             paymentStatus: 'pending',
//             totalAmount: totalCartAmount,
//             orderDate: new Date(),
//             orderUpdate: new Date(),
//             paymentId: '',
//             payerId: '',
//         };
    
//         console.log(orderData, "Payment Data");
    
//         dispatch(createNewOrder(orderData)).then((data) => {
//             if (data?.payload?.success) {
//                 setIsPaymentStart(true);
//             } else {
//                 setIsPaymentStart(false);
//             }
//         });
//     }
    
    

//     if (approvalURL) {
//         window.location.href = approvalURL;
//     }
 

//     return (
//         <div className="flex flex-col">
//             {/* Banner de checkout */}
//             <div className="relative h-[300px] w-full overflow-hidden">
//                 <img 
//                     src={img} 
//                     className="h-full w-full object-cover object-center" 
//                     alt="Checkout banner"
//                 />
//             </div>

//             {/* Contenido del checkout */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
//                 {/* Sección de dirección */}
//                 <Address setCurrentSelectedAddress={setCurrentSelectedAddress} />

//                 {/* Sección de items del carrito */}
//                 <div className="flex flex-col gap-4">
//                     {cartItems && cartItems.items && cartItems.items.length > 0 ? (
//                         cartItems.items.map(item => (
//                             <UserCartItemstContent key={item._id} cartItem={item} />
//                         ))
//                     ) : (
//                         <p>Your cart is empty</p>
//                     )}

//                     {/* Total del carrito */}
//                     <div className="mt-8 space-y-4">
//                         <div className="flex justify-between">
//                             <span className="font-bold">Total:</span>
//                             <span className="font-bold">${totalCartAmount}</span>
//                         </div>
//                     </div>
                    
//                     {/* Botón de checkout */}
//                     <div className="mt-4 w-full">
//                         <Button 
//                             onClick={handleInitiatePaypalPayment}
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
