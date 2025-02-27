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
import Footer from '@/components/shopping-view/footer'



const categoriesWithIcon = [
    { id: "men", label: "Men", icon: Shirt },
    { id: "women", label: "Women", icon: CloudLightning },
    { id: "kids", label: "Kids", icon: BabyIcon },
    { id: "accessories", label: "Accessories", icon: WatchIcon },
    { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
]

const brandsWithIcon = [
    { id: "nike", label: "Nike", icon: Shirt },
    { id: "adidas", label: "Adidas", icon: Shirt },
    { id: "puma", label: "Puma", icon: Shirt },
    { id: "levi", label: "Levi's", icon: Shirt },
    { id: "zara", label: "Zara", icon: Shirt },
    { id: "h&m", label: "H&M", icon: Shirt },
]

function ShoppingHome() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const { productList, productDetails } = useSelector(state => state.shopProducts)
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { toast } = useToast()

    const slides = [bannerOne, bannerTwo, bannerThree]

    function handleNavigateToListingPage(getCurrentItem, section) {
        sessionStorage.removeItem('filters')
        const currentFilter = {
            [section]: [getCurrentItem.id]
        }
        sessionStorage.setItem('filters', JSON.stringify(currentFilter))
        navigate(`/shop/listing`)
    }

    function handleGetProductDetails(getCurrentProductId) {
        dispatch(fetchProductDetails(getCurrentProductId))
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
                dispatch(fetchCartItems(user?.id))
                toast({
                    title: 'Product is added to cart',
                })
            }
        })
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: 'price-lowtohigh' }))
    }, [dispatch])

    useEffect(() => {
        if (productDetails !== null) setOpenDetailsDialog(true)
    }, [productDetails])

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Enhanced Hero Slider Section */}
            <div className="relative w-full h-[600px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10" />
                {slides.map((slide, index) => (
                    <img
                        key={index}
                        src={slide}
                        alt={`Banner ${index + 1}`}
                        className={`
                            absolute top-0 left-0 w-full h-full object-cover
                            ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
                            transition-all duration-1000 ease-in-out
                        `}
                    />
                ))}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentSlide(prevSlide => (prevSlide - 1 + slides.length) % slides.length)}
                    className="absolute top-1/2 left-6 z-20 -translate-y-1/2 bg-white/90 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length)}
                    className="absolute top-1/2 right-6 z-20 -translate-y-1/2 bg-white/90 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
                >
                    <ChevronRightIcon className="w-6 h-6" />
                </Button>
            </div>

            {/* Enhanced Categories Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-4">Shop by Category</h2>
                    <p className="text-gray-600 text-center mb-12">Discover our wide range of products</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {categoriesWithIcon.map(categoryItem => (
                            <Card
                                key={categoryItem.id}
                                onClick={() => handleNavigateToListingPage(categoryItem, 'category')}
                                className="cursor-pointer group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-none bg-gray-50"
                            >
                                <div className="absolute inset-0 bg-primary/5 transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-lg" />
                                <CardContent className="flex flex-col items-center justify-center p-8 relative z-10">
                                    <categoryItem.icon className="w-16 h-16 mb-4 text-primary transform group-hover:scale-110 transition-transform duration-300" />
                                    <span className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">
                                        {categoryItem.label}
                                    </span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Brands Section */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-4">Shop by Brand</h2>
                    <p className="text-gray-600 text-center mb-12">Explore our featured brands</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {brandsWithIcon.map(brandItem => (
                            <Card
                                key={brandItem.id}
                                onClick={() => handleNavigateToListingPage(brandItem, 'brand')}
                                className="cursor-pointer group hover:shadow-xl transition-all duration-300 border-none bg-white"
                            >
                                <CardContent className="flex flex-col items-center justify-center p-6 group-hover:-translate-y-1 transition-transform duration-300">
                                    <brandItem.icon className="w-14 h-14 mb-4 text-primary transform group-hover:scale-110 transition-transform duration-300" />
                                    <span className="font-semibold group-hover:text-primary transition-colors duration-300">
                                        {brandItem.label}
                                    </span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Featured Products Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-4">Featured Products</h2>
                    <p className="text-gray-600 text-center mb-12">Discover our latest and most popular items</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {productList && productList.data && productList.data.length > 0 ? (
                            productList.data.map((productItem) => (
                                <div key={productItem.id} className="transform hover:-translate-y-2 transition-all duration-300">
                                    <ShoppingProductTile
                                        product={productItem}
                                        handleGetProductDetails={handleGetProductDetails}
                                        handleAddtoCart={handleAddtoCart}
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-center col-span-full text-gray-500 text-lg">No products found</p>
                        )}
                    </div>
                </div>
            </section>


            <ProductDetailsDialog
                open={openDetailsDialog}
                setOpen={setOpenDetailsDialog}
                productDetails={productDetails}
            />
            <Footer/>
        </div>
        
    )
}

export default ShoppingHome;