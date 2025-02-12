import Address from '@/components/shopping-view/address';
import img from '../../assets/checkbanner.jpg';
import { useSelector } from 'react-redux';
import UserCartItemstContent from '@/components/shopping-view/cart-items-content';
import { Button } from '@/components/ui/button';

function ShoppingCheckout() {
    const { cartItems } = useSelector(state => state.shopCart);
    console.log(cartItems, "prueba del checkout");

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
                <Address />

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
                            <Button>
                                CheckOut with paypal
                            </Button>
                        </div>
                </div>
            </div>
        </div>
    );
}

export default ShoppingCheckout;
