import { Outlet } from "react-router-dom";
import mimos from "../../assets/mimos3.jpg"

function AuthLayout() {
    return (
        <div className="flex min-h-screen w-full">
            {/* Left Section - Welcome Banner */}
            <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-b from-pink-500 to-pink-700 w-1/2 p-12">
                {/* Main Content */}
                <div className="max-w-md space-y-8 text-center">
                    {/* Main Image */}
                    <div className="mb-8">
                        <img 
                            src={mimos} 
                            alt="Mimito Shop" 
                            className="rounded-2xl shadow-2xl w-full object-cover"
                        />
                    </div>

                    {/* Welcome Text */}
                    <div className="space-y-4">
                        <h1 className="text-5xl font-extrabold tracking-tight text-white">
                            Bienvenido 
                        </h1>
                        <p className="text-xl text-pink-100">
                            Tu tienda favorita para tus gustos
                        </p>
                    </div>

                    {/* Featured Benefits */}
                    <div className="grid grid-cols-2 gap-6 mt-12">
                        <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
                            <h3 className="text-lg font-semibold text-white">Productos de Calidad</h3>
                            <p className="text-pink-100 text-sm">Seleccionados especialmente para ti</p>
                        </div>
                        <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
                            <h3 className="text-lg font-semibold text-white">Envío Rápido</h3>
                            <p className="text-pink-100 text-sm">Recibe tus productos en tiempo récord</p>
                        </div>
                        <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
                            <h3 className="text-lg font-semibold text-white">Atención 24/7</h3>
                            <p className="text-pink-100 text-sm">Estamos aquí para ayudarte</p>
                        </div>
                        <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
                            <h3 className="text-lg font-semibold text-white">Garantía Total</h3>
                            <p className="text-pink-100 text-sm">Satisfacción garantizada</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section - Auth Forms */}
            <div className="flex flex-1 items-center justify-center bg-background">
                <div className="w-full max-w-md space-y-8 px-4 py-12 sm:px-6">
                    {/* Mobile Welcome Text with Image */}
                    <div className="lg:hidden text-center mb-8">
                        <img 
                            src="/api/placeholder/200/150" 
                            alt="Mimito Shop" 
                            className="mx-auto mb-6 rounded-xl shadow-lg"
                        />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Bienvenido a MimitoShop
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Tu tienda favorita para consentir a tus mascotas
                        </p>
                    </div>

                    {/* Auth Form Content */}
                    <Outlet />

                    {/* Bottom Text */}
                    <p className="mt-8 text-center text-sm text-gray-500 lg:hidden">
                        ¿Necesitas ayuda? Contáctanos
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;