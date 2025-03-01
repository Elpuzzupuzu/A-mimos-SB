import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Heart, Share2, ShoppingCart, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
    if (!productDetails) return null;

    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.auth);
    const {toast} = useToast()
    
    function handleAddtoCart(getCurrentProductId){
        console.log(getCurrentProductId, "getcurrentproductID");
        dispatch(
            addToCart({
                userId: user?.id, 
                productId: getCurrentProductId, 
                quantity: 1
            })
        ).then((data) => {
            if(data?.payload?.success){
                dispatch(fetchCartItems(user?.id));
                toast({
                    title: 'Product is added to cart',
                })
            }
        })
    }

    function handelDialogClose(){
        setOpen(false)
        dispatch(setProductDetails());
    }

    return (
        <Dialog open={open} onOpenChange={handelDialogClose}>
            <DialogContent className="p-0 sm:p-0 max-w-[95vw] sm:max-w-[800px] lg:max-w-[1000px] overflow-hidden max-h-[90vh] rounded-xl">
                <div className="grid md:grid-cols-2 h-full">
                    {/* Enhanced image section with overlay options */}
                    <div className="relative h-full min-h-[300px] bg-gray-100">
                        <img
                            src={productDetails?.image || "/placeholder.jpg"}
                            alt={productDetails?.title || "Product image"}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                            <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 bg-white/80 backdrop-blur-sm hover:bg-white shadow-md">
                                <Heart className="h-5 w-5 text-gray-700" />
                            </Button>
                            <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 bg-white/80 backdrop-blur-sm hover:bg-white shadow-md">
                                <Share2 className="h-5 w-5 text-gray-700" />
                            </Button>
                        </div>
                        {productDetails?.salePrice > 0 && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                                Sale
                            </div>
                        )}
                    </div>

                    {/* Enhanced product information section */}
                    <div className="flex flex-col p-6 overflow-y-auto max-h-[90vh]">
                        <DialogTitle className="text-2xl font-bold tracking-tight mb-2">
                            {productDetails?.title || "Product details"}
                        </DialogTitle>

                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">(4.5)</span>
                        </div>

                        {/* Price section with improved styling */}
                        <div className="flex items-baseline gap-3 mb-4">
                            <p className={`text-3xl font-bold ${productDetails?.salePrice > 0 ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                ${productDetails?.price}
                            </p>
                            {productDetails?.salePrice > 0 && (
                                <p className="text-3xl font-bold text-red-600">
                                    ${productDetails.salePrice}
                                </p>
                            )}
                        </div>

                        <p className="text-gray-600 text-base leading-relaxed mb-6">
                            {productDetails?.description || "No description available"}
                        </p>

                        {/* Add to cart section with improved layout */}
                        <div className="mt-auto space-y-4">
                            <Button 
                                onClick={() => handleAddtoCart(productDetails?.id)} 
                                className="w-full py-6 text-base font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-800 transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </Button>
                            
                            <Separator className="my-6" />
                            
                            {/* Reviews section with improved styling */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold">Reviews</h2>
                                    <span className="text-sm text-blue-600 font-medium cursor-pointer">View all</span>
                                </div>
                                
                                <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2">
                                    <div className="flex gap-3 items-start bg-gray-50 p-4 rounded-lg">
                                        <Avatar className="w-10 h-10 border-2 border-blue-100">
                                            <AvatarFallback className="bg-blue-50 text-blue-600 text-sm">
                                                YR
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold">Yael Ruiz</h3>
                                                <span className="text-xs text-gray-500">2 days ago</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-gray-600 text-sm">
                                                This is an awesome plushie
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Add review section */}
                                <div className="mt-4 space-y-3">
                                    <h3 className="text-base font-medium">Add your review</h3>
                                    <div className="flex gap-2">
                                        <Input placeholder="Write a review" className="rounded-lg border-gray-300" />
                                        <Button className="whitespace-nowrap bg-gray-900 hover:bg-gray-800">Submit</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ProductDetailsDialog;