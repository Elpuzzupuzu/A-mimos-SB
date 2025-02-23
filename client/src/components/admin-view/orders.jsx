import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";

import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";

import AdminOrderDetailsView  from "./order-details"
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";

function AdminOrdersView() {
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const dispatch = useDispatch();

    const {orderList,orderDetails} = useSelector((state)=> state.adminOrder);

    useEffect(()=>{

        dispatch(getAllOrdersForAdmin())
    }, [dispatch])
    
    console.log(orderList, "pp")

    return (
        <Card>
            <CardHeader>
                <CardTitle>All orders</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Order date</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Order Price</TableHead>
                            <TableHead className="sr-only">
                                <span>Details</span>
                            </TableHead>
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
                                <Dialog open={openDetailsDialog} 
                                // onOpenChange={()=>
                                // {setOpenDetailsDialog(false); 
                                // dispatch(resetOrderDetails())}}
                                >
                                <Button 
                                // onClick={()=>handleFetchOrderDetails(orderItem?._id)}
                                >View Details</Button>
                                <AdminOrderDetailsView orderDetails={orderDetails}/>
                                </Dialog>
                               
                            </TableCell>
                            
                        </TableRow>  )
                        : <p>hola :D</p>
                    }  
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default AdminOrdersView;
