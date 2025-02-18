import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";



function PaypalReturnPage (){


    const dispatch = useDispatch();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get('paymentId');
    const payerId = params.get('PayerID');

    // useEffect(()=>{
    //     if(paymentId && payerId){
    //         const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'));
    //         dispatch(capturePayment({paymentId,payerId,orderId})).then( data =>{
    //             if(data?.payload?.success){
    //                 sessionStorage.removeItem('currentOrderId')
    //                 window.location.href = '/shop/payment-success'

    //             }
    //         }
    //         )
    //     }

    // },[paymentId,payerId,dispatch])

    useEffect(() => {
        console.log("Parametros obtenidos de la URL:");
        console.log("paymentId:", paymentId);
        console.log("payerId:", payerId);
    
        if (paymentId && payerId) {
            const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'));
            console.log("orderId obtenido de sessionStorage:", orderId);
    
            dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
                console.log("Respuesta de capturePayment:", data);
    
                if (data?.payload?.success) {
                    sessionStorage.removeItem('currentOrderId');
                    window.location.href = '/shop/payment-success';
                }
            }).catch(error => console.error("Error en capturePayment:", error));
        }
    }, [paymentId, payerId, dispatch]);
    


    return(
        <Card>
            <CardHeader>
                <CardTitle>processing payment...please wait</CardTitle>
            </CardHeader>
        </Card>
    )
}


export default PaypalReturnPage;