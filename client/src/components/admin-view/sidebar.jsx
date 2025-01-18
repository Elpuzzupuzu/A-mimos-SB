import { Fragment } from "react";
import { ChartNoAxesCombined } from "lucide-react";
import { useNavigate } from "react-router-dom";



function MenuItems(){
    
}


function AdminSideBar(){

    const navigate = useNavigate() // esto es una funcion para redirigir 

    return <Fragment>

        <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex ">
            <div onClick={()=>navigate('/admin/dashboard')}  className="flex cursor-pointer items-center gap-2">
            <ChartNoAxesCombined  size={30}/>
                <h1 className="text-xl font-extrabold">Admin Panel</h1>
            </div>
        </aside>
    </Fragment>
        
    
}

export default AdminSideBar;