import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";



function AddressCard({addressInfo ,handleDeleteAddress}){
    return  (
        <Card>
            <CardContent className="grid p-4 gap-4">
                <Label>Address: {addressInfo?.address}</Label>
                <Label> City: {addressInfo?.city}</Label>
                <Label>Pincode: {addressInfo?.pincode}</Label>
                <Label>Phone: {addressInfo?.phone}</Label>
                <Label>Notes: {addressInfo?.notes}</Label>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button >Edit</Button>
                <Button onClick={()=> handleDeleteAddress(addressInfo)}>delete</Button>
            </CardFooter>
        </Card>

    )
}

export default AddressCard;