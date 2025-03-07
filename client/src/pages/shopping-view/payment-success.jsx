import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PaypalSuccessPage() {
    const navigate = useNavigate();

    useEffect(() => {
        // Verifica si el pago fue procesado exitosamente al buscar el `orderId` en sessionStorage
        const orderId = sessionStorage.getItem("currentOrderId");

        if (orderId) {
            // Si el `orderId` está presente en sessionStorage, significa que el pago fue procesado
            // Redirige a la página de cuenta después de 2 segundos (opcional)
            setTimeout(() => {
                navigate("/shop/account"); // Redirigir a la página de cuenta
            }, 2000); // 2 segundos de espera antes de redirigir
        } else {
            // Si no hay `orderId` en sessionStorage, redirigir a la página de error o fallo
            navigate("/shop/payment-failed");
        }
    }, [navigate]);

    return (
        <div className="text-center p-10">
            <h1 className="text-2xl font-bold">Procesando tu pago...</h1>
            <p>Por favor, espera mientras confirmamos tu orden.</p>
        </div>
    );
}

export default PaypalSuccessPage;
