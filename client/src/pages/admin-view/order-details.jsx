import { DialogContent } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";



function AdminOrderDetailsView(){
    return (
        <DialogContent className="sm:max-w-[600px]">
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <div className="flex mt-9 items-center justify-between">
                        <p className="font-medium">Order ID</p>
                        <Label>123456</Label>
                    </div>
                    <div className="flex mt-9 items-center justify-between">
                        <p className="font-medium">Order date</p>
                        <Label>27/06/24</Label>
                    </div>
                    <div className="flex mt-9 items-center justify-between">
                        <p className="font-medium">Order status</p>
                        <Label>In process</Label>
                    </div>
                </div>
            </div>
        </DialogContent>
    )


}

export default AdminOrderDetailsView; 