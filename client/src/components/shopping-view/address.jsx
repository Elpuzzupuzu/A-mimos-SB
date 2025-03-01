import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
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
  const { addressList, isLoading } = useSelector(state => state.shopAddress);
  const { toast } = useToast();

  // Cargar direcciones al montar el componente o cuando el usuario cambia
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllAddresses(user?.id)); 
    }
  }, [dispatch, user?.id]);

  // Función para manejar la adición o edición de una dirección
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
      dispatch(editaAddress({
        userId: user?.id,
        addressId: currentEditedId,
        formData
      })).then((data) => {
        if (data?.payload?.success) {
          // Actualizar la lista de direcciones de forma optimista
          const updatedAddressList = addressList.map(address =>
            address.id === currentEditedId ? { ...address, ...formData } : address
          );
          dispatch(fetchAllAddresses(user?.id));  // Recargar las direcciones después de la edición
          setCurrentEditedId(null);
          setFormData(initialAddressFormData);  // Reiniciar el formulario
          toast({
            title: 'Address updated successfully'
          });
        }
      });
    } else {
      dispatch(addNewAddress({
        ...formData,
        userId: user?.id
      })).then((data) => {
        if (data?.payload?.success) {
          // Actualizar la lista de direcciones
          dispatch(fetchAllAddresses(user?.id));  // Recargar las direcciones
          setFormData(initialAddressFormData);  // Reiniciar el formulario
          toast({
            title: 'Address added successfully'
          });
        }
      });
    }
  }

  // Función para manejar la edición de una dirección
  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?.id);
    setFormData({
      address: getCurrentAddress?.address,
      city: getCurrentAddress?.city,
      phone: getCurrentAddress?.phone,
      pincode: getCurrentAddress?.pincode,
      notes: getCurrentAddress?.notes
    });
  }

  // Función para manejar la eliminación de una dirección
  async function handleDeleteAddress(getCurrentAddress) {
    if (!getCurrentAddress || !getCurrentAddress.id) {
      toast({
        title: 'Invalid address',
        variant: 'destructive'
      });
      return;
    }
  
    try {
      // First dispatch the delete action
      const result = await dispatch(deleteAddress({ 
        userId: user?.id, 
        addressId: getCurrentAddress.id 
      }));
      
      // Check if the deletion was successful based on the action result
      if (result.payload?.success) {
        toast({
          title: 'Address deleted successfully',
          variant: 'destructive'
        });
        // Only fetch if needed, or rely on the optimistic update
        dispatch(fetchAllAddresses(user?.id));
      } else {
        toast({
          title: 'Failed to delete address',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast({
        title: 'Error deleting address',
        variant: 'destructive'
      });
    }
  }

  // Función para validar si el formulario está completo
  function isFormValid() {
    return Object.keys(formData).map(key => formData[key].trim() !== '').every((item) => item);
  }

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {
          addressList && addressList.length > 0 ?
            addressList.filter(singleAddressItem => singleAddressItem && singleAddressItem.id) // Filtrar los elementos null o undefined
              .map(singleAddressItem => (
                <AddressCard
                  key={singleAddressItem.id}
                  handleDeleteAddress={handleDeleteAddress}
                  handleEditAddress={handleEditAddress}
                  setCurrentSelectedAddress={setCurrentSelectedAddress}
                  addressInfo={singleAddressItem}
                />
              )) : <p>Your address list is empty</p>
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












/////TEST

// import { useEffect, useState } from "react";
// import CommonForm from "../common/form";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { addressFormControls } from "@/config";
// import { Item } from "@radix-ui/react-dropdown-menu";
// import { useDispatch, useSelector } from "react-redux";
// import { addNewAddress, deleteAddress, editaAddress, fetchAllAddresses } from "@/store/shop/address-slice";
// import AddressCard from "@/pages/shopping-view/address-card";
// import { useToast } from "@/hooks/use-toast";

// const initialAddressFormData = {
//     address: '',
//     city: '',
//     phone: '',
//     pincode: '',
//     notes: ''
// }

// function Address({ setCurrentSelectedAddress }) {
//     const [formData, setFormData] = useState(initialAddressFormData);
//     const [currentEditedId, setCurrentEditedId] = useState(null);
//     const [selectedAddressId, setSelectedAddressId] = useState(null);
//     const dispatch = useDispatch();
//     const { user } = useSelector(state => state.auth);
//     const { addressList } = useSelector(state => state.shopAddress);
//     const { toast } = useToast();

//     // Keep all your existing functions
//     function handleManageAddress(event) {
//         event.preventDefault();

//         if (addressList.length >= 3 && currentEditedId === null) {
//             setFormData(initialAddressFormData);
//             toast({
//                 title: 'You can add max 3 address',
//                 variant: 'destructive'
//             });
//             return;
//         }

//         currentEditedId !== null ? dispatch(editaAddress({
//             userId: user?.id,
//             addressId: currentEditedId,
//             formData
//         })).then((data) => {
//             if (data?.payload?.success) {
//                 dispatch(fetchAllAddresses(user?.id));
//                 setCurrentEditedId(null);
//                 setFormData(initialAddressFormData);
//                 toast({
//                     title: 'address updated successfully'
//                 });
//             }
//         }) :

//             dispatch(addNewAddress({
//                 ...formData,
//                 userId: user?.id
//             })).then(data => {
//                 if (data?.payload?.success) {
//                     dispatch(fetchAllAddresses(user?.id));
//                     setFormData(initialAddressFormData);
//                     toast({
//                         title: 'address added successfully'
//                     });
//                 }
//             });
//     }

//     function handleEditAddress(getCurrentAddress) {
//         setCurrentEditedId(getCurrentAddress?._id);
//         setFormData({
//             ...formData,
//             address: getCurrentAddress?.address,
//             city: getCurrentAddress?.city,
//             phone: getCurrentAddress?.phone,
//             pincode: getCurrentAddress?.pincode,
//             notes: getCurrentAddress?.notes
//         });
//     }

//     function handleDeleteAddress(getCurrentAddress) {
//         dispatch(deleteAddress({ userId: user?.id, addressId: getCurrentAddress?._id }))
//             .then(data => {
//                 if (data?.payload?.success) {
//                     dispatch(fetchAllAddresses(user?.id))
//                         .then(response => console.log("fetchAllAddresses response:", response))
//                         .catch(error => console.error("Error obteniendo direcciones:", error));
//                     toast({
//                         title: 'address deleted successfully',
//                         variant: 'destructive'
//                     });
//                     // Clear selection if deleted address was selected
//                     if (selectedAddressId === getCurrentAddress?._id) {
//                         setSelectedAddressId(null);
//                         setCurrentSelectedAddress(null);
//                     }
//                 }
//             })
//             .catch(error => {
//                 console.error("Error eliminando la dirección:", error);
//             });
//     }

//     function handleSelectAddress(address) {
//         setSelectedAddressId(address._id);
//         setCurrentSelectedAddress(address);
//     }

//     function isFormValid() {
//         return Object.keys(formData).map(key => formData[key].trim() !== '').
//             every((Item) => Item);
//     }

//     useEffect(() => {
//         if (user?.id) {
//             dispatch(fetchAllAddresses(user?.id));
//         }
//     }, [dispatch, user]);

//     return (
//         <Card>
//             <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
//                 {addressList && addressList.length > 0 ? (
//                     addressList.map(singleAddressItem => (
//                         <div
//                             key={singleAddressItem._id}
//                             onClick={() => handleSelectAddress(singleAddressItem)}
//                             className={`cursor-pointer transition-all duration-200 
//                                 ${selectedAddressId === singleAddressItem._id 
//                                     ? 'ring-2 ring-blue-500 bg-blue-50' 
//                                     : 'hover:bg-gray-50'}`}
//                         >
//                             <AddressCard
//                                 handleDeleteAddress={handleDeleteAddress}
//                                 handleEditAddress={handleEditAddress}
//                                 setCurrentSelectedAddress={setCurrentSelectedAddress}
//                                 addressInfo={singleAddressItem}
//                             />
//                         </div>
//                     ))
//                 ) : (
//                     <p>tu lista de direcciones esta vacia</p>
//                 )}
//             </div>
//             <CardHeader>
//                 <CardTitle>
//                     {currentEditedId !== null ? 'Edit Address' : 'add new address'}
//                 </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//                 <CommonForm
//                     formControls={addressFormControls}
//                     formData={formData}
//                     setFormData={setFormData}
//                     buttonText={currentEditedId !== null ? "Edit Address" : "add new address"}
//                     onSubmit={handleManageAddress}
//                     isBtnDisabled={!isFormValid()}
//                 />
//             </CardContent>
//         </Card>
//     );
// }

// export default Address;