import CommonForm from "@/components/common/form";
import { DialogContent, DialogTitle } from "@/components/ui/dialog"; // Importación corregida
import { Separator } from "@/components/ui/separator"; // Importación corregida
import { Label } from "@/components/ui/label"; // Importación corregida
import { useState } from "react";

const initialFormData = {
    status: "",
};

function AdminOrderDetailsView() {
    const [formData, setFormData] = useState(initialFormData);

    function handleUpdateStatus(event) {
        event.preventDefault();
       
    }

    return (
        <DialogContent className="sm:max-w-[600px]">
            <DialogTitle className="text-lg font-semibold">Order Details</DialogTitle>

            <div className="grid gap-6">
                <div className="grid gap-2">
                    <div className="flex mt-9 items-center justify-between">
                        <p className="font-medium">Order ID</p>
                        <span className="text-gray-600">123456</span> {/* Cambiado Label por span */}
                    </div>
                    <div className="flex mt-9 items-center justify-between">
                        <p className="font-medium">Order date</p>
                        <span className="text-gray-600">27/06/24</span>
                    </div>
                    <div className="flex mt-9 items-center justify-between">
                        <p className="font-medium">Order status</p>
                        <span className="text-gray-600">In process</span>
                    </div>
                </div>
                <Separator />
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="font-medium"> Order Details</div>
                        <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                                <span>Product One</span>
                                <span>$100</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="grid gap-4">
                    <div className="grid gap-2 ">
                        <div className="font-medium">Shipping Info</div>
                        <div className="grid gap-0.5 text-muted-foreground">
                            <span>Yael Ruiz</span>
                            <span>Address</span>
                            <span>City</span>
                            <span>Pin code</span>
                            <span>Phone</span>
                            <span>Notes</span>
                        </div>
                    </div>
                </div>
                <div>
                    <CommonForm
                        formControls={[
                            {
                                label: "Order Status",
                                name: "status",
                                componentType: "select",
                                options: [
                                    { id: "pending", label: "Pending" },
                                    { id: "inProcess", label: "In process" },
                                    { id: "inShipping", label: "In Shipping" },
                                    { id: "delivered", label: "Delivered" },
                                    { id: "rejected", label: "Rejected" },
                                ],
                            },
                        ]}
                        formData={formData}
                        setFormData={setFormData}
                        buttonText={"Update Order Status"}
                        onSubmit={handleUpdateStatus}
                    />
                </div>
            </div>
        </DialogContent>
    );
}

export default AdminOrderDetailsView;
