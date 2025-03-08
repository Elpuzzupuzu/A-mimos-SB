import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { createNewOrder } from '@/store/shop/order-slice';
import { useToast } from '@/hooks/use-toast';
import { fetchCartId } from '@/store/shop/cart-slice';
import UserCartItemstContent from '@/components/shopping-view/cart-items-content';
import { Button } from '@/components/ui/button';
import Address from '@/components/shopping-view/address';
import img from '../../assets/cbm.jpg';
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
    
    return (
        <div className="flex flex-col bg-gray-50 min-h-screen">
            {/* Enhanced Hero Banner with Overlay */}
            <div className="relative h-[280px] w-full overflow-hidden shadow-md">
                <div className="absolute inset-0 bg-black/30 z-10"></div>
                <img 
                    src={img} 
                    className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105" 
                    alt="Checkout banner"
                />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
                    <h1 className="text-4xl font-bold mb-2 text-center">Checkout</h1>
                    <p className="text-xl opacity-90">Complete your purchase</p>
                </div>
            </div>

            {/* Main Content with Improved Layout */}
            <div className="max-w-6xl mx-auto w-full px-4 py-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Progress Steps */}
                    <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">1</div>
                                <span className="ml-2 font-medium">Address</span>
                            </div>
                            <div className="w-20 h-0.5 bg-gray-300 self-center"></div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">2</div>
                                <span className="ml-2 font-medium">Review</span>
                            </div>
                            <div className="w-20 h-0.5 bg-gray-300 self-center"></div>
                            <div className="flex items-center opacity-50">
                                <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold">3</div>
                                <span className="ml-2 font-medium">Payment</span>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6">
                        {/* Address Section - 3/5 width on large screens */}
                        <div className="lg:col-span-3 order-2 lg:order-1">
                            <div className="bg-white rounded-lg overflow-hidden">
                                <div className="border-b border-gray-200 pb-4 mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">Shipping Address</h2>
                                    <p className="text-gray-500 text-sm">Select the address where you want to receive your order</p>
                                </div>
                                <Address setCurrentSelectedAddress={setCurrentSelectedAddress} />
                            </div>
                        </div>

                        {/* Order Summary Section - 2/5 width on large screens */}
                        <div className="lg:col-span-2 order-1 lg:order-2">
                            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
                                </div>
                                
                                <div className="p-6">
                                    {/* Cart Items with scroll for many items */}
                                    <div className="max-h-80 overflow-y-auto pr-2 mb-6">
                                        {cartItems && cartItems.items && cartItems.items.length > 0 ? (
                                            cartItems.items.map(item => (
                                                <UserCartItemstContent key={item._id} cartItem={item} />
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                                <p className="mt-2">Your cart is empty</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Price Summary */}
                                    <div className="space-y-3 py-4 border-t border-gray-200">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal</span>
                                            <span>${totalCartAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Shipping</span>
                                            <span>Free</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                                            <span>Total</span>
                                            <span className="text-blue-600">${totalCartAmount.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Payment Button */}
                                    <div className="mt-6">
                                        <Button 
                                            onClick={handleInitiatePaypalPayment}
                                            disabled={!currentSelectedAddress || !cartItems?.items?.length || isPaymentStart}
                                            className="w-full py-6 text-lg relative overflow-hidden group"
                                        >
                                            {isPaymentStart ? (
                                                <>
                                                    <span className="mr-2">Processing</span>
                                                    <span className="flex space-x-1 absolute right-4">
                                                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M17.439 19.126L22 12.639V4.007H4.069v8.632l4.562 6.488H17.439zm-12.658.244l-2.334 2.863L1 20.871l4.781-5.984V3.723L22.354 3.5l.146.5v9.117l-4.781 6.896-11.292.236-.646-.879zM6.198 6.864a.751.751 0 0 1 .75-.75h10.104a.75.75 0 0 1 0 1.5H6.948a.75.75 0 0 1-.75-.75zm0 3.701a.75.75 0 0 1 .75-.75h10.104a.75.75 0 1 1 0 1.5H6.948a.75.75 0 0 1-.75-.75z"></path>
                                                    </svg>
                                                    <span>Checkout with PayPal</span>
                                                </>
                                            )}
                                            <div className="absolute inset-0 w-full scale-x-0 group-hover:scale-x-100 group-hover:bg-opacity-10 bg-white bg-opacity-20 origin-left transition-transform"></div>
                                        </Button>
                                    </div>

                                    {/* Secure checkout message */}
                                    <div className="mt-4 flex justify-center items-center text-gray-500 text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                        Secure checkout with PayPal
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShoppingCheckout;