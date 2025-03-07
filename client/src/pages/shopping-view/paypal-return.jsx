import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function PaypalReturn() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
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
                if (data.success) {
                    navigate("/shop/payment-success"); // \ud83d\udd39 Redirigir a éxito
                } else {
                    navigate("/shop/payment-failed"); // \ud83d\udd39 Redirigir a fallo
                }
            })
            .catch(error => {
                console.error("\u274c Error en fetch:", error);
                navigate("/shop/payment-failed");
            });
        } else {
            console.warn("\u26a0\ufe0f Faltan parámetros en la URL de PayPal.");
            navigate("/shop/payment-failed");
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-xl font-bold">Procesando pago...</h2>
            <p>Por favor espera mientras confirmamos tu pago.</p>
        </div>
    );
}

export default PaypalReturn;
