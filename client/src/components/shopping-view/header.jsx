import { Link } from "react-router-dom";
import { Cat, House } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"; // Importa `Sheet`
import { Button } from "../ui/button"; // Importa `Button`
import { Menu } from "lucide-react";
import { useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ShoppingCart } from "lucide-react";
import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";


function MenuItems (){
    return <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-4 lg:flex-row">
        {
            shoppingViewHeaderMenuItems.map((menuItem) => 
            <Link className="text-sm font-medium" key={menuItem.id} to={menuItem.path}>{menuItem.label}</Link>)
            
        }

    </nav>
}

function HeaderRightContent (){
    const {user} = useSelector((state)=> state.auth);

    return <div className=" flex lg:items-center lg:flex-row flex-col gap-4 px-4">
        <Button className=""   variant= "outline" size = "icon">
        <ShoppingCart  className="w-6 h-6 " />
        <span className="sr-only">User Cart</span>
        </Button>
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
                <DropdownMenuItem>
                <UserRound className ="mr-2 h-4 w-4 "/>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    </div>
}


function ShoppingHeader(){

    const{isAuthenticated} = useSelector(state=>state.auth)
    // console.log(user, "userShopping")


    return(
       <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <Link to={"/shop/home"} className="flex items-center gap-4 px-4">
                <Cat className="h-6 w-6 gap-2" />
                <span className="font-bold">MimitoShop</span>
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
                </SheetContent>
            </Sheet>
            <div className="hidden lg:block ml:6">
                <MenuItems/>

            </div>
            {
                isAuthenticated? <div>
                    <HeaderRightContent/>
                </div> : null
            }
        </div>
       </header>
    );
}

export default ShoppingHeader;
