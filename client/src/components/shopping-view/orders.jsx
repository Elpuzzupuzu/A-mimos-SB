import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByUserId, getOrderDetails } from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";




function ShoppingOrders (){


    const[openDetailsDialog,setOpenDetailsDialog] = useState(false)
    const dispatch = useDispatch();

    const {user} =useSelector((state) => state.auth);
    const {orderList,orderDetails} = useSelector((state)=> state.shopOrder);
    


    function handleFetchOrderDetails(getId){
        dispatch(getOrderDetails(getId))

    }
    

    useEffect(()=>{
        if(orderDetails !== null) setOpenDetailsDialog(true);
    },[orderDetails])


    useEffect(()=>{
        dispatch(getAllOrdersByUserId(user?.id))

    },[dispatch , user?.id])

    console.log(orderDetails, "ORDER DETAILS");
    



    return (<Card>
        <CardHeader>
            <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Order date</TableHead>
                        <TableHead>Order Status</TableHead>
                        <TableHead>Order Price</TableHead>
                        <TableHead className="sr-only"><span>Details</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        orderList && orderList.length > 0 ?
                        orderList.map(orderItem =>  <TableRow>
                            <TableCell>{orderItem?._id}</TableCell>
                            <TableCell>{orderItem?.orderDate.split('T'[0])}</TableCell>
                            <TableCell>
                            <Badge className={`${orderItem?.orderStatus === 'confirmed' ? 'bg-green-500' : 'bg-yellow-300'}`}>
                                {orderItem?.orderStatus}
                            </Badge>
                            </TableCell>
                            <TableCell>${orderItem?.totalAmount}</TableCell>
                            <TableCell>
                                <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
                                <Button onClick={()=>handleFetchOrderDetails(orderItem?._id)}>View Details</Button>
                                <ShoppingOrderDetailsView/>
                                </Dialog>
                               
                            </TableCell>
                            
                        </TableRow>  )
                        : <p>hola :D</p>
                    }
                    
                </TableBody>
            </Table>
        </CardContent>
    </Card>
    )
        
    
}


export default ShoppingOrders;