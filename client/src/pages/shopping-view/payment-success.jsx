import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItems } from "@/store/shop/cart-slice"; // Asegúrate de que esta acción esté importada

function PaypalSuccessPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Obtener el usuario desde el estado de Redux
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        // Verifica si el pago fue procesado exitosamente al buscar el `orderId` en sessionStorage
        const orderId = sessionStorage.getItem("currentOrderId");

        if (orderId) {
            // Si el `orderId` está presente en sessionStorage, significa que el pago fue procesado
            // Actualiza el carrito para obtener los productos más recientes usando el user?.id
            dispatch(fetchCartItems(user?.id)).then(() => {
                // Después de actualizar el carrito, redirige a la página de cuenta
                setTimeout(() => {
                    navigate("/shop/account"); // Redirigir a la página de cuenta
                }, 2000); // 2 segundos de espera antes de redirigir
            });
        } else {
            // Si no hay `orderId` en sessionStorage, redirigir a la página de error o fallo
            navigate("/shop/payment-failed");
        }
    }, [dispatch, navigate, user?.id]); // Añadido user?.id como dependencia para asegurar que se actualice

    return (
        <div className="text-center p-10">
            <h1 className="text-2xl font-bold">Procesando tu pago...</h1>
            <p>Por favor, espera mientras confirmamos tu orden.</p>
        </div>
    );
}

export default PaypalSuccessPage;
