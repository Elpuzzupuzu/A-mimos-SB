import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle, Sheet } from "@/components/ui/sheet";
import CommonForm from "@/components/common/form";
import { addProductFormElements } from "@/config";
import ProductImageUpload from "@/components/admin-view/image-upload";

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
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imageLoadingState, setImageLoadingState] = useState(false);

  function onSubmit() {}

  console.log(formData, "formdata");

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>Add new product</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4"></div>

      <Sheet open={openCreateProductsDialog} onOpenChange={setOpenCreateProductsDialog}>
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Add new product</SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState = {imageLoadingState}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={'Add product'}
              formControls={addProductFormElements}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
