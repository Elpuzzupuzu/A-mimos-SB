import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItems } from "@/store/shop/cart-slice"; // Asegúrate de que esta acción esté importada

function PaypalSuccessPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [countdown, setCountdown] = useState(2);
    const [showCheckmark, setShowCheckmark] = useState(false);
    
    // Obtener el usuario desde el estado de Redux
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        // Mostrar animación de checkmark después de un breve retraso
        const checkmarkTimer = setTimeout(() => {
            setShowCheckmark(true);
        }, 800);

        // Verifica si el pago fue procesado exitosamente al buscar el `orderId` en sessionStorage
        const orderId = sessionStorage.getItem("currentOrderId");

        if (orderId) {
            // Si el `orderId` está presente en sessionStorage, significa que el pago fue procesado
            // Actualiza el carrito para obtener los productos más recientes usando el user?.id
            dispatch(fetchCartItems(user?.id)).then(() => {
                // Después de actualizar el carrito, redirige a la página de cuenta
                // Configura un contador regresivo visualizado
                const countdownInterval = setInterval(() => {
                    setCountdown(prev => {
                        if (prev <= 1) {
                            clearInterval(countdownInterval);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
                
                setTimeout(() => {
                    navigate("/shop/account"); // Redirigir a la página de cuenta
                }, 2000); // 2 segundos de espera antes de redirigir
                
                return () => clearInterval(countdownInterval);
            });
        } else {
            // Si no hay `orderId` en sessionStorage, redirigir a la página de error o fallo
            navigate("/shop/payment-failed");
        }
        
        return () => clearTimeout(checkmarkTimer);
    }, [dispatch, navigate, user?.id]); // Añadido user?.id como dependencia para asegurar que se actualice

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
                {/* Animación de checkmark */}
                <div className={`mb-6 transform transition-all duration-700 ${showCheckmark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                    <div className="mx-auto h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <svg className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Pago Exitoso!</h1>
                <p className="text-green-600 font-semibold text-lg mb-2">Tu orden ha sido procesada correctamente</p>
                
                <div className="my-6 p-4 border border-green-200 bg-green-50 rounded-lg">
                    <p className="text-gray-700">Estamos preparando tu pedido. Pronto encontrarás todos los detalles en tu cuenta.</p>
                </div>
                
                {/* Pulse effect for redirecting message */}
                <div className="mt-6 relative">
                    <div className="absolute inset-0 bg-green-100 rounded-lg animate-pulse"></div>
                    <div className="relative p-4">
                        <p className="text-gray-800">Redirigiendo a tu cuenta en <span className="font-bold">{countdown}</span> segundos...</p>
                    </div>
                </div>
                
                <div className="mt-6 flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "400ms" }}></div>
                </div>
            </div>
        </div>
    );
}

export default PaypalSuccessPage;