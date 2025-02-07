import { Link, useNavigate } from "react-router-dom";
import { Cat, House, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"; // Importa `Sheet`
import { Button } from "../ui/button"; // Importa `Button`
import { Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ShoppingCart } from "lucide-react";
import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";


function MenuItems (){
    return <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-4 lg:flex-row">
        {
            shoppingViewHeaderMenuItems.map((menuItem) => 
            <Link className="text-lg font-medium text-pink-500 hover:text-purple-600" key={menuItem.id} to={menuItem.path}>{menuItem.label}</Link>)
            
        }

    </nav>
}

function HeaderRightContent (){
    const {user} = useSelector((state)=> state.auth);
    const {cartItems} =useSelector(state => state.shopCart)
    const [openCartSheet , setOpenCartSheet] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function handleLogout(){
        dispatch(logoutUser())

    }

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchCartItems(user.id));
        }
    }, [dispatch, user?.id]);
    

    console.log("Estado del carrito en Redux:", cartItems);

    // Verifica el estado de cartItems después de la carga
        useEffect(() => {
            console.log("Estado de cartItems en el useEffect:", cartItems);
        }, [cartItems]);
            


    return <div className=" flex lg:items-center lg:flex-row flex-col gap-4 px-4">
        <Sheet open={openCartSheet} onOpenChange={()=> setOpenCartSheet(false)}>
        <Button onClick={()=> setOpenCartSheet(true)} className=""   variant= "outline" size = "icon">
        <ShoppingCart  className="w-6 h-6 " />
        <span className="sr-only">User Cart</span>
        </Button>
        <UserCartWrapper 
                cartItems={cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items : []} 
            /> 
        </Sheet>
      
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="bg-pink-600 rounded-full">
                    <AvatarFallback className= "w-10 h-10bg-black text-white font-extrabold">
                        {user?.userName.slice(0,2).toUpperCase()}
                        </AvatarFallback>
                </Avatar>

            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="w-56 justify-between px-10">
                <DropdownMenuLabel>Logged in as {user?.userName} </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem className="cursor-pointer"  onClick={()=>navigate('/shop/account')}>
                    <UserRound className ="mr-2 h-4 w-4 "/>
                    Account
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4"/>
                    LogOut
                </DropdownMenuItem>


            </DropdownMenuContent>
        </DropdownMenu>
    </div>
}


function ShoppingHeader(){

    const{isAuthenticated} = useSelector(state=>state.auth)
    // console.log(user, "userShopping")
    // console.log(cartItems, "CART ITEMS");
    


    return(
       <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <Link to={"/shop/home"} className="flex items-center gap-4 px-4">
                <Cat className="text-purple-800 h-6 w-6 gap-2" />
                <span className="font-bold text-pink-400">MimitoShop</span>
            </Link>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle Header menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side= "left" className ="w-full max-w-xs">
                    <MenuItems/>
                    <HeaderRightContent/>
                </SheetContent>
            </Sheet>
            <div className="hidden lg:block ml:6">
                <MenuItems/>

            </div>
            
                <div className="hidden lg:block">
                    <HeaderRightContent/>
                </div> 
            
        </div>
       </header>
    );
}

export default ShoppingHeader;
