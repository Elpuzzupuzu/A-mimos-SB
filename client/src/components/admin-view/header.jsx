
//aqui hacemos las interfaces para el admin
//lg sirve para ocultar elementos en pantallas grandes , sm:block para mostrar en pantallas pequeñas

import { logoutUser } from "@/store/auth-slice";
import { Button } from "../ui/button";
import {AlignJustify} from "lucide-react"
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";


function AdminHeader({setOpen}){

    const dispatch = useDispatch();
    function handlelogOut(){
        dispatch(logoutUser());

    }



    return <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
        <Button onClick={()=>setOpen(true)} className="lg:hidden sm:block">   
        <AlignJustify />
        <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="flex flex-1 justify-end">
            <Button  onClick={handlelogOut} className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow">
            <LogOut />
                Logout
                </Button>

        </div>

    </header>
    
     
}

export default AdminHeader;
