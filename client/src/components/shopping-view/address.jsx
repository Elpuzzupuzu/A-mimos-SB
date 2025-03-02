import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { Item } from "@radix-ui/react-dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, deleteAddress, editaAddress, fetchAllAddresses } from "@/store/shop/address-slice";
import AddressCard from "@/pages/shopping-view/address-card";
import { useToast } from "@/hooks/use-toast";

const initialAddressFormData = {
    address: '',
    city: '',
    phone: '',
    pincode: '',
    notes: ''
};

function Address({ setCurrentSelectedAddress }) {
    const [formData, setFormData] = useState(initialAddressFormData);
    const [currentEditedId, setCurrentEditedId] = useState(null);
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { addressList } = useSelector(state => state.shopAddress);
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);


    function handleManageAddress(event) {
        event.preventDefault();

        if (addressList.length >= 3 && currentEditedId === null) {
            setFormData(initialAddressFormData);
            toast({
                title: 'You can add max 3 addresses',
                variant: 'destructive'
            });
            return;
        }

        if (currentEditedId !== null) {
            // Edit address logic
            dispatch(editaAddress({
                userId: user?.id, addressId: currentEditedId, formData
            }))
                .unwrap()
                .then((data) => {
                    if (data?.success) {
                        dispatch(fetchAllAddresses(user?.id)).unwrap(); // Update addresses after edit
                        setCurrentEditedId(null);
                        setFormData(initialAddressFormData);
                        toast({
                            title: 'Address updated successfully'
                        });
                    }
                })
                .catch(error => {
                    console.error('Error updating address:', error);
                    toast({
                        title: 'Error updating address',
                        variant: 'destructive'
                    });
                });
        } else {
            // Add new address logic
            dispatch(addNewAddress({
                ...formData,
                userId: user?.id
            }))
                .unwrap()
                .then(data => {
                    if (data?.payload?.success) {
                        dispatch(fetchAllAddresses(user?.id)).unwrap(); // Update address list after adding
                        setFormData(initialAddressFormData);
                        toast({
                            title: 'Address added successfully'
                        });
                    }
                })
                .catch(error => {
                    console.error('Error adding address:', error);
                    toast({
                        title: 'Error adding address',
                        variant: 'destructive'
                    });
                });
        }
    }

    function handleEditAddress(getCurrentAddress) {
        setCurrentEditedId(getCurrentAddress?.id);
        setFormData({
            ...formData,
            address: getCurrentAddress?.address,
            city: getCurrentAddress?.city,
            phone: getCurrentAddress?.phone,
            pincode: getCurrentAddress?.pincode,
            notes: getCurrentAddress?.notes
        });
    }

    async function handleDeleteAddress(getCurrentAddress) {
        if (!getCurrentAddress || !getCurrentAddress.id) {
            console.error("Invalid address:", getCurrentAddress);
            return; // Exit if no valid address
        }

        try {
            const deleteResponse = await dispatch(deleteAddress({ userId: user?.id, addressId: getCurrentAddress.id })).unwrap();
            if (deleteResponse?.success) {
                dispatch(fetchAllAddresses(user?.id)).unwrap(); // Refresh addresses after deletion
                toast({
                    title: 'Address deleted successfully',
                    variant: 'destructive'
                });
            } else {
                console.warn("Deletion was not successful.");
            }
        } catch (error) {
            console.error("Error deleting address:", error);
            await dispatch(fetchAllAddresses(user?.id)).unwrap(); // Refresh addresses on error
            toast({
                title: 'Error deleting address',
                variant: 'destructive'
            });
        }
    }

    function isFormValid() {
        return Object.keys(formData).map(key => formData[key].trim() !== '').every((item) => item);
    }


  useEffect(() => {
    if (user?.id && !isLoading) {  // Verifica que no estamos en un proceso de carga
        setIsLoading(true);  // Inicia el estado de carga
        dispatch(fetchAllAddresses(user?.id))
            .unwrap()
            .then(() => {
                console.log("Address list updated:", addressList);
                setIsLoading(false);  // Cambia el estado de carga a falso cuando termine
            })
            .catch((error) => {
                console.error("Error updating address list:", error);
                setIsLoading(false);  // Asegura que el estado de carga se cambie incluso en caso de error
            });
    }
}, [dispatch, user?.id, addressList]);  // addressList se mantiene, pero controlamos la carga con `isLoading`
  

    return (
        <Card>
            <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {
                    addressList && addressList.length > 0 ?
                        addressList.map(singleAddressItem => <AddressCard
                            handleDeleteAddress={handleDeleteAddress}
                            handleEditAddress={handleEditAddress}
                            setCurrentSelectedAddress={setCurrentSelectedAddress}
                            addressInfo={singleAddressItem} />) :
                        <p>Your address list is empty</p>
                }
            </div>
            <CardHeader>
                <CardTitle>
                    {currentEditedId !== null ? 'Edit Address' : 'Add New Address'}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <CommonForm
                    formControls={addressFormControls}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={currentEditedId !== null ? "Edit Address" : "Add New Address"}
                    onSubmit={handleManageAddress}
                    isBtnDisabled={!isFormValid()}
                />
            </CardContent>
        </Card>
    );
}

export default Address;
