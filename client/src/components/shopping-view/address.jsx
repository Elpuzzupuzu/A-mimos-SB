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
    address : '',
    city : '',
    phone : '',
    pincode : '',
    notes : ''
}


function Address (){

    const[formData , setFormData] = useState(initialAddressFormData)
    const[currentEditedId, setCurrentEditedId] = useState(null); 
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.auth);
    const {addressList} = useSelector(state => state.shopAddress);
    const {toast} = useToast();




    function handleManageAddress(event){
        event.preventDefault();

        if(addressList.length >= 3 && currentEditedId ===null){
            setFormData(initialAddressFormData)
            toast({
                title : 'You can add max 3 address',
                variant : 'destructive'
            })
            return;
        }

        currentEditedId !== null ? dispatch(editaAddress({
            userId : user?.id, addressId : currentEditedId , formData
        })).then((data)=>{
            if(data?.payload?.success){
                dispatch(fetchAllAddresses(user?.id))
                setCurrentEditedId(null)
                setFormData(initialAddressFormData)
                toast({
                    title : 'address updated successfully'
                })
            }
        }) : 

        dispatch(addNewAddress({
            ...formData,
            userId : user?.id
        })).then(data => {
            // console.log(data, "pruebas de address");
            if(data?.payload?.success){
                dispatch(fetchAllAddresses(user?.id))
                setFormData(initialAddressFormData)
                toast({
                    title : 'address added successfully'
                })
            }
            
        })
    }


    function handleEditAddress(getCurrentAddress){
        setCurrentEditedId(getCurrentAddress?._id) 
        setFormData({
            ...formData,
            address : getCurrentAddress?.address,
            city : getCurrentAddress?.city,
            phone : getCurrentAddress?.phone,
            pincode : getCurrentAddress?.pincode,
            notes : getCurrentAddress?.notes
        })

    }

    
    function handleDeleteAddress(getCurrentAddress) {
        dispatch(deleteAddress({ userId: user?.id, addressId: getCurrentAddress?._id }))
          .then(data => {
            
            // Ajuste en la condición para evitar el error tipográfico
            if (data?.payload?.success ) {
              console.log("Dirección eliminada con éxito, actualizando lista...");
              dispatch(fetchAllAddresses(user?.id))
                .then(response => console.log("fetchAllAddresses response:", response))
                .catch(error => console.error("Error obteniendo direcciones:", error));
                toast({
                    title : 'address deleleted succssfully',
                    variant : 'destructive'

                })
            } else {
              console.warn("La eliminación no fue exitosa.");
            }
          })
          .catch(error => {
            console.error("Error eliminando la dirección:", error);
          });
    }
      
      

    function isFormValid(){
        return Object.keys(formData).map(key => formData[key].trim() !=='').
        every((Item) => Item)
    }

    // depurando como mono 2 hrs de la 53 a la 60 por un maldito ?.
    useEffect(() => {
        if (user?.id) {
            dispatch(fetchAllAddresses(user?.id));
        }
    }, [dispatch, user]);
     
    // console.log(addressList, "lista")
  
    

    return (
    <Card>
        <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {
                addressList && addressList.length > 0 ?
                addressList.map(singleAddressItem => <AddressCard 
                    handleDeleteAddress={handleDeleteAddress} 
                    handleEditAddress ={handleEditAddress}
                    
                    addressInfo={singleAddressItem}/> ) : <p>tu lista de direcciones esta vacia</p>
                    
            }
        </div>
        <CardHeader>
            <CardTitle>
                {
                    currentEditedId !== null? 'Edit Address' : 'add new address'
                }
            </CardTitle>
        </CardHeader>
        <CardContent className ="space-y-3">
            <CommonForm
            formControls={addressFormControls}
            formData={formData}
            setFormData={setFormData}
            buttonText={  currentEditedId !== null? "Edit Address":"add new address"}
            onSubmit={handleManageAddress}
            isBtnDisabled={!isFormValid()}
            
            
            />

        </CardContent>
    </Card>    
    )
}


export default Address;