
// import { Card, CardContent, CardFooter } from "../ui/card";
// import { Button } from "../ui/button";

// function AdminProductTile({product
//      , setFormData, 
//      setOpenCreateProductsDialog, 
//      setCurrentEditedId,
//      handleDelete
//     }){

//     return (
//         <Card className = "w-full max-w-sm mx-auto">
//             <div>
//                 <div className="relative ">
//                     <img src={product?.image}
//                     alt={product?.tile}
//                     className="w-full h-[300px] object-cover rounded-t-lg"
//                     />
//                 </div>
//                 <CardContent>
//                     <h2 className="text-xl font-bold mb-2 mt-2 ">{product?.title}</h2>
//                     <div className="flex justify-between items-center mb-2">
//                         <span className={`${product?.salePrice > 0 ? 'line-through' : ''}text-lg font-semibold text-primary`}>${product?.price}        
//                         </span>
//                         {
//                             product?.salePrice > 0 ? <span className="text-lg font-bold">${product?.salePrice}</span> : null
//                         }
                        
//                     </div>
//                 </CardContent>
//                 <CardFooter className = "flex justify-between items-center">
//                         <Button onClick={()=>{
//                             setOpenCreateProductsDialog(true)
//                             setCurrentEditedId(product?.id)
//                             setFormData(product);
//                         }}>Edit</Button>
//                         <Button onClick={()=> handleDelete(product?.id)}>Delete</Button>


//                 </CardFooter>

//             </div>
//         </Card>




//     );
// }



// export default AdminProductTile;



import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete
}) {
  return (
    <Card className="w-full max-w-sm mx-auto transition-all duration-300 hover:shadow-lg">
      <div>
        <div className="relative">
          <img 
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product?.salePrice > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md font-semibold text-sm">
              SALE
            </div>
          )}
        </div>
        <CardContent className="p-5">
          <h2 className="text-xl font-bold mb-3 truncate">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <div className="flex flex-col">
              <span className={`${product?.salePrice > 0 ? 'line-through text-gray-500 text-sm' : 'text-lg font-semibold text-primary'}`}>
                ${product?.price}
              </span>
              {product?.salePrice > 0 && (
                <span className="text-lg font-bold text-red-500">${product?.salePrice}</span>
              )}
            </div>
            {product?.inventory && (
              <span className="text-sm text-gray-500">
                {product.inventory > 10 ? 'In Stock' : `${product.inventory} left`}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center p-4 border-t">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?.id);
              setFormData(product);
            }}
          >
            <Pencil size={16} />
            Edit
          </Button>
          <Button 
            variant="destructive"
            className="flex items-center gap-2"
            onClick={() => handleDelete(product?.id)}
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;