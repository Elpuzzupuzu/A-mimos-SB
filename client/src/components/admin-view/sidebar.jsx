import { Fragment } from "react";
import { BadgeCheck, ChartNoAxesCombined, LayoutDashboard, ShoppingBasket } from "lucide-react";
import { useNavigate } from "react-router-dom";

/// componentes del side bar admin
const adminSidebarMenuItems = [

    {
        id : 'darshboard',
        label: 'Dashboard',
        path :'/admin/dashboard',
        icon : <LayoutDashboard/>
    }, 
    {
        id : 'products',
        label: 'Products',
        path :'/admin/products',
        icon: <ShoppingBasket/>
    },
    {
        id : 'Orders',
        label: 'orders',
        path :'/admin/orders',
        icon : <BadgeCheck/>
    }
]


///

// aqui se declara la funcion para navegar por el aside 

function MenuItems(){
    const navigate = useNavigate()
    return <nav className="mt-8 flex-col flex gap-2">
        {
            adminSidebarMenuItems.map(menuItem=> <div key={menuItem.id }onClick={()=>navigate(menuItem.path)} className="flex items-center gap-2 rounded-md px-3 py-2">
                {menuItem.icon}
                <span>{menuItem.label}</span>
            </div>)
        }

    </nav>

}

///


function AdminSideBar(){

    const navigate = useNavigate() // esto es una funcion para redirigir 

    return <Fragment>

        <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex ">
            <div onClick={()=>navigate('/admin/dashboard')}  className="flex cursor-pointer items-center gap-2">
            <ChartNoAxesCombined  size={30}/>
                <h1 className="text-xl font-extrabold">Admin Panel</h1>
            </div>
            <MenuItems/>
        </aside>
    </Fragment>
        
    
}

export default AdminSideBar;