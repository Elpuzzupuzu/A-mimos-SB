import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemstContent from "./cart-items-content";

function UserCartWrapper({ cartItems }) {

    const totalCartAmount = cartItems && cartItems.length >0 ? 
    cartItems.reduce((sum,currentItem) => sum +(
        currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price
    )* currentItem?.quantity,0)
    : 0




    return (
        <SheetContent className="sm:max-w-md">
            <SheetHeader>
                <SheetTitle>your cart</SheetTitle>
            </SheetHeader>
            <div className="mt-8 space-y-4">
                {
                    // Verifica si cartItems existe y tiene elementos
                    cartItems && cartItems.length > 0 ? 
                    // Mapea los items para renderizar cada uno
                    cartItems.map(item => (
                        <UserCartItemstContent cartItem={item} key={item._id} />
                    )) : null
                }
            </div>
            <div className="mt-8 space-y-4">
                <div className="flex justify-between">
                    <span className="font-bold">Total: </span>
                    <span className="font-bold">${totalCartAmount}</span> {/* Aquí el total es estático por ahora */}
                </div>
            </div>
            <Button className="w-full mt-6 bg-pink-600 hover:bg-pink-700">Checkout</Button>
        </SheetContent>
    );
}

export default UserCartWrapper;
