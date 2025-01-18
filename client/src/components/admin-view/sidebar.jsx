import { Fragment } from "react";
import { BadgeCheck, ChartNoAxesCombined, LayoutDashboard, ShoppingBasket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

/// Componentes del side bar admin
const adminSidebarMenuItems = [
    {
        id: "dashboard",
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: <LayoutDashboard />
    }, 
    {
        id: "products",
        label: "Products",
        path: "/admin/products",
        icon: <ShoppingBasket />
    },
    {
        id: "orders",
        label: "Orders",
        path: "/admin/orders",
        icon: <BadgeCheck />
    }
];

/// Menú de navegación
function MenuItems({setOpen}) {
    const navigate = useNavigate();
    return (
        <nav className="mt-8 flex-col flex gap-2">
            {adminSidebarMenuItems.map((menuItem) => (
                <div 
                    key={menuItem.id} 
                    onClick={() => {
                        navigate(menuItem.path);
                        setOpen? setOpen(false) : null;
                    }} 
                    className="cursor-pointer flex text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                    {menuItem.icon}
                    <span>{menuItem.label}</span>
                </div>
            ))}
        </nav>
    );
}

/// Sidebar del Admin
function AdminSideBar({ open, setOpen }) { // Desestructuración correcta
    const navigate = useNavigate(); // Hook dentro del componente correcto

    return (
        <Fragment>
            {/* Sidebar en Sheet para móviles */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="left" className="w-64">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="border-b">
                            <SheetTitle className="flex items-center gap-2 mt-5 mb-4">
                                <ChartNoAxesCombined size={30} />
                                <h1 className="text-2xl font-extrabold">Admin Panel</h1>
                            </SheetTitle>
                        </SheetHeader>
                        <MenuItems setOpen={setOpen} />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Sidebar en pantallas grandes */}
            <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
                <div onClick={() => navigate("/admin/dashboard")} className="flex cursor-pointer items-center gap-2">
                    <ChartNoAxesCombined size={30} />
                    <h1 className="text-2xl font-extrabold">Admin Panel</h1>
                </div>
                <MenuItems />
            </aside>
        </Fragment>
    );
}

export default AdminSideBar;
