import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function PaypalSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const paymentId = searchParams.get("paymentId");
    const PayerID = searchParams.get("PayerID");
    const orderId = searchParams.get("orderId"); 

    useEffect(() => {
        if (paymentId && PayerID && orderId) {
            // Hacer una petición al backend para confirmar el pago
            fetch(`http://localhost:5000/api/shop/orders/capture?paymentId=${paymentId}&PayerID=${PayerID}&orderId=${orderId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Redirigir a la página de éxito después de confirmar el pago
                        navigate(`/shop/order-success?orderId=${orderId}`);
                    } else {
                        // Redirigir a una página de error si el pago falla
                        navigate("/shop/payment-failed");
                    }
                })
                .catch(() => navigate("/shop/payment-failed"));
        }
    }, [paymentId, PayerID, orderId, navigate]);

    return (
        <div className="text-center p-10">
            <h1 className="text-2xl font-bold">Procesando tu pago...</h1>
            <p>Por favor, espera mientras confirmamos tu orden.</p>
        </div>
    );
}

export default PaypalSuccessPage;
