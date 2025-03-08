import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  // Diccionario de colores para cada estado de la orden
  const statusColors = {
    pending: "bg-yellow-400 text-black",
    confirmed: "bg-green-500 text-white",
    inProcess: "bg-blue-500 text-white",
    inShipping: "bg-purple-500 text-white",
    delivered: "bg-gray-500 text-white",
    rejected: "bg-red-500 text-white",
  };
  
  

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogTitle className="text-lg font-semibold">Order Details</DialogTitle>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-9 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <span className="text-gray-600">{orderDetails?.id}</span>
          </div>
          <div className="flex mt-9 items-center justify-between">
            <p className="font-medium">Order date</p>
            <span className="text-gray-600">{orderDetails?.orderDate.split("T")[0]}</span>
          </div>
          <div className="flex mt-9 items-center justify-between">
            <p className="font-medium">Total Amount</p>
            <span className="text-gray-600">${orderDetails?.totalAmount}</span>
          </div>
          <div className="flex mt-9 items-center justify-between">
            <p className="font-medium">Payment Method</p>
            <span className="text-gray-600">{orderDetails?.paymentMethods}</span>
          </div>
          <div className="flex mt-9 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <span className="text-gray-600">{orderDetails?.paymentStatus}</span>
          </div>
          <div className="flex mt-9 items-center justify-between">
            <p className="font-medium">Order status</p>
            <span className="text-gray-600">
              <Badge className={`${statusColors[orderDetails?.orderStatus] || "bg-gray-300 text-black"}`}>
                {orderDetails?.orderStatus}
              </Badge>
            </span>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <li key={item.id} className="flex items-center justify-between">
                      <span>Product: {item.title}</span>
                      <span>Quantity: {item.quantity}</span>
                      <span>Price: ${item.price}</span>
                      <span>Subtotal: ${item.price * item.quantity}</span>
                    </li>
                  ))
                : <li>No items in this order</li>}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
