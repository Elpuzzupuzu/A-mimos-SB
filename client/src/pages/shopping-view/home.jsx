import { Button } from '@/components/ui/button'
import bannerOne from '../../assets/banner1.jpg'
import bannerTwo from '../../assets/banner5.jpg'
import bannerThree from '../../assets/banner6.jpg'
import { BabyIcon, ChevronLeftIcon, ChevronRightIcon, CloudLightning, Shirt, UmbrellaIcon, WatchIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/products-slice'
import ShoppingProductTile from '@/components/shopping-view/product-tile'
import { useNavigate } from 'react-router-dom'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { useToast } from '@/hooks/use-toast'
import ProductDetailsDialog from '@/components/shopping-view/product-details'

const categoriesWithIcon = [
    { id: "men", label: "Men", icon : Shirt },
    { id: "women", label: "Women", icon : CloudLightning },
    { id: "kids", label: "Kids", icon : BabyIcon},
    { id: "accessories", label: "Accessories" , icon : WatchIcon},
    { id: "footwear", label: "Footwear" , icon : UmbrellaIcon},
  ]

   const brandsWithIcon = [
    { id: "nike", label: "Nike" , icon : Shirt  },
    { id: "adidas", label: "Adidas" , icon : Shirt },
    { id: "puma", label: "Puma" , icon : Shirt},
    { id: "levi", label: "Levi's" , icon : Shirt},
    { id: "zara", label: "Zara" , icon : Shirt},
    { id: "h&m", label: "H&M" , icon : Shirt},
  ];



function ShoppingHome(){

    const[currentSlide , setCurrentSlide] = useState(0);
    const {productList , productDetails} = useSelector(state => state.shopProducts)
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
    const {user} = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {toast} = useToast()


    const slides = [bannerOne, bannerTwo, bannerThree];

    function handleNavigateToListingPage(getCurrentItem , section){
        sessionStorage.removeItem('filters');
        const currentFilter = {
            [section] : [getCurrentItem.id]
        } 
        sessionStorage.setItem('filters',JSON.stringify(currentFilter))
        navigate(`/shop/listing`)

    }

    
    
    function handleGetProductDetails(getCurrentProductId){
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
    



    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prevSlide => (prevSlide + 1)% slides.length)
        }, 5000)
        return () => clearInterval(timer);
    }, [])


    useEffect(() => {
        dispatch(fetchAllFilteredProducts({filterParams : {} , sortParams : 'price-lowtohigh'}))
    }, [dispatch])

    useEffect(()=>{
        if(productDetails !== null) setOpenDetailsDialog(true) 
    
       },[productDetails])

    // console.log(productList , "prueba del home")




    return(
        <div className="flex flex-col min-h-screen">
            <div className="relative w-full h-[600px] overflow-hidden">
                        {
                slides.map((slide, index) => (
                    <img
                    src={slide}
                    key={index}
                    className={`${index === currentSlide ? 'opacity-100' : 'opacity-0'} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-200`}
                    />
                ))
                }
                <Button 
                 variant = "outline"
                 size ="icon"
                 onClick ={()=>setCurrentSlide(prevSlide =>(prevSlide -1 +slides.length) % slides.length)} 
                 className ="absolute top-1/2 left-4 transform -translate-y-1/2 bg-purple-800">
                    <ChevronLeftIcon className='w-4 h-4'/>
                </Button>
                <Button 
                 variant = "outline"
                 size ="icon" 
                 onClick ={()=>setCurrentSlide(prevSlide =>(prevSlide + 1) % slides.length)} 
                 className ="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80">
                    <ChevronRightIcon className='w-4 h-4'/>
                </Button>
            </div>
            <section className='py-12 bg-gray-50'>
                <div className='container mx-auto px-4'>
                    <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
                </div>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                    {
                        categoriesWithIcon.map(categoryItem => <Card onClick={()=> handleNavigateToListingPage(categoryItem, 'category')} className="cursor-poiter hover:shadow-lg transition-shadow">
                            <CardContent className="flex flex-col items-center justify-center p-6"> 
                                <categoryItem.icon className='w-12 h-12 mb-4 text-primary'/>
                                <span className='font-bold'>{categoryItem.label}</span>

                            </CardContent>
                        </Card>)
                    }
                    

                </div>
            </section>
            <section className='py-12 bg-gray-50'>
                <div className='container mx-auto px-4'>
                    <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
                </div>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
                    {
                        brandsWithIcon.map(brandItem => <Card onClick={()=> handleNavigateToListingPage(brandItem, 'brand')} className="cursor-poiter hover:shadow-lg transition-shadow">
                            <CardContent className="flex flex-col items-center justify-center p-6"> 
                                <brandItem.icon className='w-12 h-12 mb-4 text-primary'/>
                                <span className='font-bold'>{brandItem.label}</span>

                            </CardContent>
                        </Card>)
                    }
                    

                </div>
            </section>

            <section className='py-12'>
            <div className='container mx-auto px-4'>
                    <h2 className="text-3xl font-bold text-center mb-8">Feature Products</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {
                        productList && productList.data && productList.data.length > 0 ? 
                        productList.data.map((productItem) => (
                            <ShoppingProductTile 
                            product={productItem}
                            handleGetProductDetails={handleGetProductDetails}
                            handleAddtoCart={handleAddtoCart}
                            
                            />
                        )) : <p>No products found</p>
                        }

                    </div>
                </div>

            </section>
                <ProductDetailsDialog 
            open={openDetailsDialog} 
            setOpen={setOpenDetailsDialog} 
            productDetails={productDetails}
            />
        </div>
    )
}

export default ShoppingHome;