import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Minus, Plus, Trash } from "lucide-react";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";

function UserCartItemstContent({ cartItem }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { toast } = useToast();

    // **Eliminar producto del carrito**
    const handleCartItemDelete = (getCartItem) => {
        dispatch(deleteCartItem({ userId: user?.id, productId: getCartItem?.product_id })).then((data) => {
            if (data?.payload?.success) {
                toast({ title: "Item removed from cart successfully" });
            } else {
                toast({ title: "Error removing item", variant: "destructive" });
            }
        });
    };

    // **Actualizar cantidad de un producto en el carrito**
    const handleUpdateQuantity = (getCartItem, typeOfAction) => {
        const updatedQuantity = typeOfAction === "plus" ? getCartItem?.quantity + 1 : getCartItem?.quantity - 1;
        if (updatedQuantity < 1) return; // Evita valores negativos

        dispatch(
            updateCartQuantity({
                userId: user?.id,
                productId: getCartItem?.product_id,
                quantity: updatedQuantity,
            })
        ).then((data) => {
            if (data?.payload?.success) {
                toast({ title: "Cart updated successfully" });
            } else {
                toast({ title: "Error updating cart", variant: "destructive" });
            }
        });
    };

    return (
        <div className="flex items-center space-x-4 border-b py-2">
            {/* Imagen del producto */}
            <img
                src={cartItem?.products?.image || cartItem?.image}
                alt={cartItem?.products?.title || cartItem?.title}
                className="w-20 h-20 rounded object-cover"
            />

            {/* Información del producto */}
            <div className="flex-1">
                <h3 className="font-extrabold text-sm">{cartItem?.products?.title || cartItem?.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={cartItem?.quantity === 1}
                        onClick={() => handleUpdateQuantity(cartItem, "minus")}
                        className="h-8 w-8 rounded-full"
                    >
                        <Minus className="w-4 h-4" />
                        <span className="sr-only">Decrease</span>
                    </Button>
                    <span className="font-semibold">{cartItem?.quantity}</span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdateQuantity(cartItem, "plus")}
                        className="h-8 w-8 rounded-full"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="sr-only">Increase</span>
                    </Button>
                </div>
            </div>

            {/* Precio y eliminar */}
            <div className="flex flex-col items-end">
                <p className="font-semibold">
                    ${((cartItem?.products?.salePrice > 0 ? cartItem?.products?.salePrice : cartItem?.products?.price) * cartItem?.quantity).toFixed(2)}
                </p>
                <Trash
                    onClick={() => handleCartItemDelete(cartItem)}
                    className="cursor-pointer m-1 hover:text-red-600 transition duration-200"
                    size={20}
                />
            </div>
        </div>
    );
}

export default UserCartItemstContent;
