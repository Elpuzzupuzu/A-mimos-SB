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



