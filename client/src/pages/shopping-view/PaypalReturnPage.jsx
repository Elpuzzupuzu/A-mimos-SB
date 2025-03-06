import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para manejar la navegación

function PaypalReturnPage() {
    const navigate = useNavigate();
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Obtener los parámetros de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId');
        const paymentId = urlParams.get('paymentId');
        const payerId = urlParams.get('PayerID');

        // Verificar si los parámetros existen
        if (!orderId || !paymentId || !payerId) {
            setError('Missing required parameters in URL.');
            return;
        }

        // Si los parámetros son válidos, actualizar el estado con los detalles del pago
        setPaymentDetails({
            orderId,
            paymentId,
            payerId,
        });
    }, []);

    // Función para regresar a la página de inicio u otra página
    const handleGoBack = () => {
        navigate('/shop/home'); // Cambia la ruta si lo deseas
    };

    return (
        <div className="payment-capture-container">
            {error ? (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            ) : (
                <div className="payment-details">
                    <h2>Payment Details</h2>
                    <p><strong>Order ID:</strong> {paymentDetails?.orderId}</p>
                    <p><strong>Payment ID:</strong> {paymentDetails?.paymentId}</p>
                    <p><strong>Payer ID:</strong> {paymentDetails?.payerId}</p>
                    {/* Aquí puedes agregar más detalles o hacer una solicitud al backend para obtener más info */}
                    
                    <button onClick={handleGoBack} className="back-button">
                        Go back to Home
                    </button>
                </div>
            )}
        </div>
    );
}

export default PaypalReturnPage;
