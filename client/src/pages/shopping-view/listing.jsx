import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import mimos from "../../assets/mallowizq.jpg";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function createSearchParamshelper(filterParams) {
    const queryParams = [];
    for (const [key, value] of Object.entries(filterParams)) {
        if (Array.isArray(value) && value.length > 0) {
            const paramValue = value.join(',');
            queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
        }
    }
    return queryParams.join("&");
}

function ShoppingListing() {
    const dispatch = useDispatch();
    const { productList, productDetails } = useSelector(state => state.shopProducts);
    const { user } = useSelector(state => state.auth);
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (filters !== null && sort !== null) {
            dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }));
        }
    }, [dispatch, sort, filters]);

    const categorySearchParam = searchParams.get('category');
    console.log(productList, "Lista de productos");

    function handleSort(value) {
        setSort(value);
    }

    function handleFilter(getSectionId, getCurrentOption) {
        let cpyFilters = { ...filters };
        const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

        if (indexOfCurrentSection === -1) {
            cpyFilters = {
                ...cpyFilters,
                [getSectionId]: [getCurrentOption]
            };
        } else {
            const indexOfCurrentSection = cpyFilters[getSectionId].indexOf(getCurrentOption);
            if (indexOfCurrentSection === -1) cpyFilters[getSectionId].push(getCurrentOption);
            else cpyFilters[getSectionId].splice(indexOfCurrentSection, 1);
        }

        setFilters(cpyFilters);
        sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
    }

    function handleGetProductDetails(getCurrentProductId) {
        dispatch(fetchProductDetails(getCurrentProductId));
    }

   

    function handleAddtoCart(getCurrentProductId) {
        dispatch(
            addToCart({
                userId: user?.id,
                productId: getCurrentProductId,
                quantity: 1
            })
        ).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchCartItems(user?.id)); // Esto debe obtener los productos del carrito, incluyendo cartId
                toast({
                    title: 'Product is added to cart',
                });
            }
        });
    }
    

    useEffect(() => {
        if (productDetails !== null) setOpenDetailsDialog(true);
    }, [productDetails]);

    useEffect(() => {
        setSort("price-lowtohigh");
        setFilters(JSON.parse(sessionStorage.getItem('filters')) || {});
    }, [categorySearchParam]);

    useEffect(() => {
        if (filters && Object.keys(filters).length > 0) {
            const createQueryString = createSearchParamshelper(filters);
            setSearchParams(new URLSearchParams(createQueryString));
        }
    }, [filters]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 p-3 md:p-4">
            <ProductFilter filters={filters} handleFilter={handleFilter} />
            <div className="bg-background w-full rounded-lg shadow-sm">
                <div className="p-3 border-b gap-2 flex items-center justify-between">
                    <h2 className="text-base font-bold">All products</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{productList?.data?.length || 0}</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="text-sm flex items-center gap-1">
                                    <ArrowUpDownIcon className="h-3 w-3" />
                                    <span>Sort by</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px]">
                                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                                    {sortOptions.map(sortItem => (
                                        <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                                            {sortItem.label}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="p-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {productList?.data && productList.data.length > 0 ? (
                            productList.data.map(productItem => (
                                <ShoppingProductTile
                                    handleAddtoCart={handleAddtoCart}
                                    handleGetProductDetails={handleGetProductDetails}
                                    key={productItem.id}  // Cambié _id a id
                                    product={productItem}
                                />
                            ))
                        ) : (
                            <img className="max-w-md h-min col-span-full" src={mimos} alt="No products found" />
                        )}
                    </div>
                </div>
            </div>
            <ProductDetailsDialog
                open={openDetailsDialog}
                setOpen={setOpenDetailsDialog}
                productDetails={productDetails}
            />
        </div>
    );
}

export default ShoppingListing;
