import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemstContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
    const navigate = useNavigate();
    console.log(cartItems, "CART-ITEMS");
    

    const totalCartAmount = cartItems && cartItems.length > 0 ? 
    cartItems.reduce((sum, currentItem) => {
        const salePrice = Number(currentItem?.products?.salePrice) || 0;
        const price = Number(currentItem?.products?.price) || 0;
        const quantity = Number(currentItem?.quantity) || 0;
        return sum + ((salePrice > 0 ? salePrice : price) * quantity);
    }, 0)
    : 0;


    return (
        <SheetContent className="sm:max-w-md flex flex-col h-full">
            <SheetHeader>
                <SheetTitle className="text-xl font-bold">Your Cart</SheetTitle>
            </SheetHeader>
            
            {/* Cart items container with scrollbar */}
            <div className="flex-1 mt-6 overflow-y-auto mb-4 pr-2">
                <div className="space-y-4">
                    {
                        cartItems && cartItems.length > 0 ? 
                        cartItems.map(item => (
                            <UserCartItemstContent cartItem={item} key={item._id} />
                        )) : (
                            <div className="text-center py-8 text-gray-500">
                                Your cart is empty
                            </div>
                        )
                    }
                </div>
            </div>
            
            {/* Fixed bottom area for total and checkout button */}
            <div className="border-t pt-4 mt-auto">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-lg">Total: </span>
                    <span className="font-bold text-lg text-pink-600">${totalCartAmount.toFixed(2)}</span>
                </div>
                <Button 
                    onClick={() => {
                        navigate('/shop/checkout'); 
                        setOpenCartSheet(false);
                    }}  
                    className="w-full py-6 font-medium bg-pink-600 hover:bg-pink-700 transition-colors"
                    disabled={!cartItems || cartItems.length === 0}
                >
                    Proceed to Checkout
                </Button>
            </div>
        </SheetContent>
    );
}

export default UserCartWrapper;