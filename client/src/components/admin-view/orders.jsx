import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Button } from "../ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import AdminOrderDetailsView from "@/pages/admin-view/order-details";

function AdminOrdersView() {
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

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
                        <TableRow>
                            <TableCell>123456</TableCell>
                            <TableCell>27/06/2024</TableCell>
                            <TableCell>In process</TableCell>
                            <TableCell>$1000</TableCell>
                            <TableCell>
                                <Dialog.Root open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
                                    <Dialog.Trigger asChild>
                                        <Button onClick={() => setOpenDetailsDialog(true)}>View Details</Button>
                                    </Dialog.Trigger>
                                    <Dialog.Portal>
                                        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                                        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                                            <Dialog.Close asChild>
                                                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">×</button>
                                            </Dialog.Close>
                                            <AdminOrderDetailsView />
                                        </Dialog.Content>
                                    </Dialog.Portal>
                                </Dialog.Root>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default AdminOrdersView;
