import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import mimos from "../../assets/mimos3.jpg"



import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";

import { ArrowUpDownIcon, CloudCog } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useSearchParams } from "react-router-dom";





function createSearchParamshelper(filterParams){
    const queryParams = [];

    for(const[key,value] of Object.entries(filterParams)){
        if(Array.isArray(value) && value.length > 0){
            const paramValue = value.join(',')

            queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
        }
    } 
    return queryParams.join("&")

}



function ShoppingListing(){

    const dispatch = useDispatch();
    const {productList, productDetails} = useSelector(state => state.shopProducts)
    const{user} = useSelector(state =>state.auth)
    // const {cartItems} =useSelector(state => state.shopCart)
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
    const {toast} = useToast()

    useEffect(()=>{
        if(filters !==null && sort !== null )
        dispatch(fetchAllFilteredProducts({filterParams : filters,sortParams : sort}));
    },[dispatch, sort , filters])


    // console.log(productDetails, "pruebas product details");
    
   // funcion para ordenar

   function handleSort(value){
    // console.log(value , "sort")
    setSort(value);

   }

   function handleFilter(getSectionId, getCurrentOption){
    // console.log(getSectionId, getCurrentOption, "filtros" );

    let cpyFilters = {...filters};
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if(indexOfCurrentSection === -1 ){
        cpyFilters = {
            ...cpyFilters,
            [getSectionId] : [getCurrentOption]
        }
    } else{
        const indexOfCurrentSection = cpyFilters[getSectionId].indexOf(getCurrentOption);
        if(indexOfCurrentSection === -1) cpyFilters[getSectionId].push(getCurrentOption)
            else cpyFilters[getSectionId].splice(indexOfCurrentSection,1)
    }

    setFilters(cpyFilters)
    sessionStorage.setItem("filters",JSON.stringify(cpyFilters))

   }


   //handleGetProductDetails


   function handleGetProductDetails(getCurrentProductId){
    // console.log(getCurrentProductId, "current id");
    dispatch(fetchProductDetails(getCurrentProductId))


   }

   function handleAddtoCart(getCurrentProductId){
    console.log(getCurrentProductId , "getcurrentproductID");
    dispatch(
        addToCart({
            userId : user?.id, 
            productId: getCurrentProductId , 
            quantity:1})
        ).then((data) => {
            if(data?.payload?.success){
                dispatch(fetchCartItems(user?.id));
                toast({
                    title : 'Product is added to cart',
                })

            }
        })
    

   }

   useEffect(()=>{
    if(productDetails !== null) setOpenDetailsDialog(true) 

   },[productDetails])

    // console.log(filters,setSearchParams, "filters");

   useEffect(()=>{
    setSort ("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem('filters')) || {})

   }, [])




   useEffect(()=>{
    if(filters && Object.keys(filters).length > 0){
        const createQueryString =  createSearchParamshelper(filters)
        setSearchParams(new URLSearchParams(createQueryString))
    }

   },[filters])

//    console.log(cartItems, "cartItems");
   

    return <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
        <ProductFilter filters={filters} handleFilter={handleFilter}/>
        <div className="bg-background w-full rounded-lg shadow-sm ">
            <div className="p-4 border-b gap-3 flex items-center justify-between">
                <h2 className="text-lg font-extrabold">All products</h2>
                <div className="flex items-center gap-3 ">
                    <span className="text-muted-foreground">10</span>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <ArrowUpDownIcon className=" h-4 w-4"/>
                            <span>Sort by </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px] ">
                        <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                            {sortOptions.map(sortItem => <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                                {sortItem.label}</DropdownMenuRadioItem>)}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-4">   
            {
    productList?.data && productList.data.length > 0 ?
    productList.data.map(productItem => <ShoppingProductTile handleAddtoCart={handleAddtoCart} handleGetProductDetails={handleGetProductDetails} key={productItem._id} product={productItem}/>) : <img className="w-full" src={mimos}/>
}

            
            </div>
           
        </div>
        <ProductDetailsDialog 
        open={openDetailsDialog} 
        setOpen={setOpenDetailsDialog} 
        productDetails={productDetails}
        />

    </div>      
    
}
export default ShoppingListing;
























//// CANDIDATO A PAGINAR
// function ShoppingListing() {
//     const dispatch = useDispatch();
//     const { productList, productDetails } = useSelector(state => state.shopProducts);
//     const { user } = useSelector(state => state.auth);
//     const [filters, setFilters] = useState({});
//     const [sort, setSort] = useState(null);
//     const [searchParams, setSearchParams] = useSearchParams();
//     const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);  // Estado para la página actual
//     const [pageSize, setPageSize] = useState(5);  // Tamaño de la página
//     const { toast } = useToast();

//     useEffect(() => {
//         if (filters !== null && sort !== null) {
//             dispatch(fetchAllFilteredProducts({ 
//                 filterParams: filters, 
//                 sortParams: sort,
//                 page: currentPage,  // Añadir la página actual
//                 pageSize: pageSize  // Añadir el tamaño de la página
//             }));
//         }
//     }, [dispatch, sort, filters, currentPage, pageSize]);  // Añadir dependencias de la paginación

//     function handleSort(value) {
//         setSort(value);
//     }

//         function createSearchParamshelper(filterParams){
//         const queryParams = [];

//         for(const[key,value] of Object.entries(filterParams)){
//             if(Array.isArray(value) && value.length > 0){
//                 const paramValue = value.join(',')

//                 queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
//             }
//         } 
//         return queryParams.join("&")

//     }

//     function handleFilter(getSectionId, getCurrentOption) {
//         let cpyFilters = { ...filters };
//         const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

//         if (indexOfCurrentSection === -1) {
//             cpyFilters = {
//                 ...cpyFilters,
//                 [getSectionId]: [getCurrentOption]
//             };
//         } else {
//             const indexOfCurrentSection = cpyFilters[getSectionId].indexOf(getCurrentOption);
//             if (indexOfCurrentSection === -1) cpyFilters[getSectionId].push(getCurrentOption)
//             else cpyFilters[getSectionId].splice(indexOfCurrentSection, 1);
//         }

//         setFilters(cpyFilters);
//         sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
//     }

//     function handleGetProductDetails(getCurrentProductId) {
//         dispatch(fetchProductDetails(getCurrentProductId));
//     }

//     function handleAddtoCart(getCurrentProductId) {
//         dispatch(
//             addToCart({
//                 userId: user?.id,
//                 productId: getCurrentProductId,
//                 quantity: 1
//             })
//         ).then((data) => {
//             if (data?.payload?.success) {
//                 dispatch(fetchCartItems(user?.id));
//                 toast({
//                     title: 'Product is added to cart',
//                 });
//             }
//         });
//     }

//     useEffect(() => {
//         if (productDetails !== null) setOpenDetailsDialog(true);
//     }, [productDetails]);

//     useEffect(() => {
//         setSort("price-lowtohigh");
//         setFilters(JSON.parse(sessionStorage.getItem('filters')) || {});
//     }, []);

//     useEffect(() => {
//         if (filters && Object.keys(filters).length > 0) {
//             const createQueryString = createSearchParamshelper(filters);
//             setSearchParams(new URLSearchParams(createQueryString));
//         }
//     }, [filters]);

//     // Funciones para la paginación
//     function handlePageChange(newPage) {
//         setCurrentPage(newPage);
//     }

//     function handlePageSizeChange(newPageSize) {
//         setPageSize(newPageSize);
//         setCurrentPage(1);  // Reiniciar a la primera página cuando el tamaño de la página cambie
//     }

//     return (
//         <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
//             <ProductFilter filters={filters} handleFilter={handleFilter} />
//             <div className="bg-background w-full rounded-lg shadow-sm ">
//                 <div className="p-4 border-b gap-3 flex items-center justify-between">
//                     <h2 className="text-lg font-extrabold">All products</h2>
//                     <div className="flex items-center gap-3 ">
//                         <span className="text-muted-foreground">{productList?.totalCount || 0}</span>
//                         <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                                 <Button variant="outline" size="sm" className="flex items-center gap-1">
//                                     <ArrowUpDownIcon className=" h-4 w-4" />
//                                     <span>Sort by </span>
//                                 </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end" className="w-[200px] ">
//                                 <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
//                                     {sortOptions.map(sortItem => <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
//                                         {sortItem.label}</DropdownMenuRadioItem>)}
//                                 </DropdownMenuRadioGroup>
//                             </DropdownMenuContent>
//                         </DropdownMenu>
//                     </div>
//                 </div>
//                 <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                     {
//                         productList?.data && productList.data.length > 0 ?
//                             productList.data.map(productItem => <ShoppingProductTile handleAddtoCart={handleAddtoCart} handleGetProductDetails={handleGetProductDetails} key={productItem._id} product={productItem} />) : <img className="w-full" src={mimos} />
//                     }
//                 </div>

//                 {/* Paginación */}
//                 <div className="flex justify-between items-center p-4">
//                     <Button 
//                         variant="outline" 
//                         disabled={currentPage === 1} 
//                         onClick={() => handlePageChange(currentPage - 1)}>
//                         Prev
//                     </Button>
//                     <span>{`Page ${currentPage}`}</span>
//                     <Button 
//                         variant="outline" 
//                         disabled={productList?.data?.length < pageSize} 
//                         onClick={() => handlePageChange(currentPage + 1)}>
//                         Next
//                     </Button>
//                 </div>

//             </div>
//             <ProductDetailsDialog 
//                 open={openDetailsDialog} 
//                 setOpen={setOpenDetailsDialog} 
//                 productDetails={productDetails} 
//             />
//         </div>
//     );
// }

// export default ShoppingListing;
