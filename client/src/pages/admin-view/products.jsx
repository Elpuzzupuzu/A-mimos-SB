import { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle, Sheet } from "@/components/ui/sheet";
import CommonForm from "@/components/common/form";
import { addProductFormElements } from "@/config";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { useDispatch, useSelector } from "react-redux";
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/products-slice";
import axios from "axios"; // Asegúrate de tener axios importado
import { useToast } from "@/hooks/use-toast";
import AdminProductTile from "@/components/admin-view/product-tile";
const initialFormData = {
  image: null,
  title: '',
  description: '',
  category: '',
  brand: '',
  price: "",
  salePrice: '',
  totalStock: '',
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null)



  const { productList } = useSelector(state => state.adminProducts);
  const dispatch = useDispatch();
  const{toast} = useToast()


  // Función para subir la imagen a Cloudinary
  async function uploadImageToCloudinary() {
    setImageLoadingState(true);

    const data = new FormData();
    data.append("my_file", imageFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Respuesta del servidor:", response.data);

      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.url);
      } else {
        console.error("Error: La carga de la imagen no fue exitosa. Respuesta:", response.data);
      }
    } catch (error) {
      console.error("Error uploading image:", error.response?.data || error.message);
    } finally {
      setImageLoadingState(false);
    }
  }

  // Función para enviar el formulario
  async function onSubmit(event) {
    event.preventDefault();

    // Espera que la imagen esté subida antes de continuar
    // if (!uploadedImageUrl) {
    //   console.log("Esperando la carga de la imagen...");
    //   return; OJO CON ESTO
    // }

    currentEditedId !== null ?
    dispatch(editProduct({id: currentEditedId,
      formData})).then ((data) => {
        console.log(data, "EDIT");
        
        if(data?.payload.success){
          dispatch(fetchAllProducts())
          setFormData(initialFormData)
          setOpenCreateProductsDialog(false)
          setCurrentEditedId(null)
        }
      }) :

    dispatch(addNewProduct({
      ...formData,
      image: uploadedImageUrl,
    })).then((data) => {
      console.log(data);
      if(data?.payload?.success){
        dispatch(fetchAllProducts())
        setOpenCreateProductsDialog(false);
        setImageFile(null);
        setFormData(initialFormData)                                                  /// test
        toast({
          title : 'product add successfully'
        })
        console.log(productList, uploadedImageUrl, "productList");

      }
    });
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);


  function handleDelete(getCurrentProductId){
    console.log(getCurrentProductId, "id delete")
    dispatch(deleteProduct(getCurrentProductId)).then (data=>{
      if(data?.payload?.success){
        toast({
          title : 'product deleted successfully',
          variant : 'destructive'
        })
        dispatch(fetchAllProducts());
      }
    })

  }


  function isFormValid() {
    return Object.keys(formData).map(key=> formData[key] !== '').
    every(item => item);
  }
  

  useEffect(() => {
    if (imageFile) {
      uploadImageToCloudinary(); // Subir la imagen cuando se selecciona
    }
  }, [imageFile]);

  console.log(productList, uploadedImageUrl, "productList");

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>Add new product</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {
          productList && productList.length > 0 ?
          productList.map((productItem)=> (
            <AdminProductTile setFormData={setFormData} 
            setOpenCreateProductsDialog={setOpenCreateProductsDialog} 
            setCurrentEditedId={setCurrentEditedId} 
            product={productItem}
            handleDelete={handleDelete}
            />

          ))
          : null
          
        }
      </div>

      <Sheet open={openCreateProductsDialog} 
      onOpenChange={() =>{
        setOpenCreateProductsDialog (false)
        setCurrentEditedId(null)
        setFormData (initialFormData)

      }}>
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {
                currentEditedId !== null ? 
                'Edit Product' : 'Add New Product'
              }
              </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode = {currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? 'Edit ' : 'Add'}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
