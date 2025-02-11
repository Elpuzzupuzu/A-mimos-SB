import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { Item } from "@radix-ui/react-dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, deleteAddress, fetchAllAddresses } from "@/store/shop/address-slice";
import AddressCard from "@/pages/shopping-view/address-card";

const initialAddressFormData = {
    address : '',
    city : '',
    phone : '',
    pincode : '',
    notes : ''
}


function Address (){

    const[formData , setFormData] = useState(initialAddressFormData)
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.auth);
    const {addressList} = useSelector(state => state.shopAddress);




    function handleManageAddress(event){
        event.preventDefault();
        dispatch(addNewAddress({
            ...formData,
            userId : user?.id
        })).then(data => {
            // console.log(data, "pruebas de address");
            if(data?.payload?.success){
                dispatch(fetchAllAddresses(user?.id))
                setFormData(initialAddressFormData)
            }
            
        })


    }

    
    function handleDeleteAddress(getCurrentAddress) {
        dispatch(deleteAddress({ userId: user?.id, addressId: getCurrentAddress?._id }))
          .then(data => {
            if (data?.payload?.success) {
              // Si la eliminación es exitosa, obtenemos la lista actualizada de direcciones
              dispatch(fetchAllAddresses(user?.id))
            }
          })
          .catch(error => {
            console.error("Error eliminando la dirección:", error);
            // Aquí puedes manejar el error, por ejemplo, mostrar un mensaje de error.
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
                    addressInfo={singleAddressItem}/> ) : <p>hola</p>
            }
        </div>
        <CardHeader>
            <CardTitle>
                Add new address
            </CardTitle>
        </CardHeader>
        <CardContent className ="space-y-3">
            <CommonForm
            formControls={addressFormControls}
            formData={formData}
            setFormData={setFormData}
            buttonText={'add'}
            onSubmit={handleManageAddress}
            isBtnDisabled={!isFormValid()}
            
            
            />

        </CardContent>
    </Card>    
    )
}


export default Address;