import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function PaypalReturn() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        // Start loading animation
        const loadingInterval = setInterval(() => {
            setLoadingProgress(prev => {
                const newProgress = prev + Math.random() * 15;
                return newProgress > 90 ? 90 : newProgress; // Cap at 90% until complete
            });
        }, 500);

        const paymentId = searchParams.get("paymentId");
        const payerId = searchParams.get("PayerID");
        const orderId = searchParams.get("orderId");

        console.log("\ud83d\udce9 Datos recibidos en PayPal Return:", { paymentId, payerId, orderId });

        if (paymentId && payerId && orderId) {
            fetch("http://localhost:5000/api/shop/orders/capture", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, payerId, orderId })
            })
            .then(response => response.json())
            .then(data => {
                console.log("\ud83d\udce9 Respuesta del backend:", data);
                clearInterval(loadingInterval);
                setLoadingProgress(100);
                
                // Small delay to show completed progress before redirecting
                setTimeout(() => {
                    if (data.success) {
                        navigate("/shop/payment-success"); // 🔹 Redirigir a éxito
                    } else {
                        navigate("/shop/payment-failed"); // 🔹 Redirigir a fallo
                    }
                }, 500);
            })
            .catch(error => {
                console.error("\u274c Error en fetch:", error);
                clearInterval(loadingInterval);
                setLoadingProgress(100);
                setTimeout(() => navigate("/shop/payment-failed"), 500);
            });
        } else {
            console.warn("\u26a0\ufe0f Faltan parámetros en la URL de PayPal.");
            clearInterval(loadingInterval);
            setLoadingProgress(100);
            setTimeout(() => navigate("/shop/payment-failed"), 500);
        }

        return () => clearInterval(loadingInterval);
    }, [searchParams, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mb-6">
                    {/* PayPal logo */}
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">P</span>
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Procesando tu pago</h2>
                    <p className="text-gray-600 mb-6">Estamos confirmando tu transacción con PayPal</p>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <div 
                            className="bg-blue-500 h-4 rounded-full transition-all duration-500" 
                            style={{ width: `${loadingProgress}%` }}
                        ></div>
                    </div>
                    
                    {/* Loading animation - 3 dots */}
                    <div className="flex justify-center space-x-2 mt-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                    </div>
                </div>
                
                <p className="text-sm text-gray-500">
                    Por favor no cierres esta ventana mientras procesamos tu pago
                </p>
            </div>
        </div>
    );
}

export default PaypalReturn;