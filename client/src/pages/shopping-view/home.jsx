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
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Enhanced Hero Slider Section */}
            <div className="relative w-full h-[600px] overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20 z-10" />
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
                <div className="absolute top-1/2 left-0 right-0 z-20 -translate-y-1/2 text-center text-white">
                    <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Adopt a Squishmallows</h1>
                    <p className="text-xl mb-8 max-w-lg mx-auto drop-shadow-md">Discover our latest collection </p>
                    <Button 
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        onClick={() => navigate('/shop/listing')}
                    >
                        Shop Now
                    </Button>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentSlide(prevSlide => (prevSlide - 1 + slides.length) % slides.length)}
                    className="absolute top-1/2 left-6 z-20 -translate-y-1/2 bg-white/90 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg rounded-full h-12 w-12"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length)}
                    className="absolute top-1/2 right-6 z-20 -translate-y-1/2 bg-white/90 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg rounded-full h-12 w-12"
                >
                    <ChevronRightIcon className="w-6 h-6" />
                </Button>
                <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center space-x-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Enhanced Categories Section with Improved Icons */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-gray-900 relative inline-block">
                            Shop by Category
                            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
                        </h2>
                        <p className="text-gray-600 text-lg mt-6">Discover our wide range of products</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                        {categoriesWithIcon.map(categoryItem => (
                            <Card
                                key={categoryItem.id}
                                onClick={() => handleNavigateToListingPage(categoryItem, 'category')}
                                className="cursor-pointer group relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-none bg-gray-50 rounded-xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20 transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl" />
                                <CardContent className="flex flex-col items-center justify-center p-8 relative z-10">
                                    <div className="relative bg-white shadow-lg p-5 rounded-full mb-6 group-hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <categoryItem.icon className="w-12 h-12 text-primary group-hover:text-primary/90 transform group-hover:scale-110 transition-all duration-300 relative z-10" />
                                    </div>
                                    <span className="font-semibold text-lg text-gray-800 group-hover:text-primary transition-colors duration-300">
                                        {categoryItem.label}
                                    </span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Brands Section with Improved Icons */}
            <section className="py-20 bg-gray-50 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 z-0" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-gray-900 relative inline-block">
                            Shop by Brand
                            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
                        </h2>
                        <p className="text-gray-600 text-lg mt-6">Explore our featured brands</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {brandsWithIcon.map((brandItem, index) => (
                            <Card
                                key={brandItem.id}
                                onClick={() => handleNavigateToListingPage(brandItem, 'brand')}
                                className="cursor-pointer group hover:shadow-xl transition-all duration-300 border border-gray-200 bg-white rounded-xl overflow-hidden"
                            >
                                <CardContent className="flex flex-col items-center justify-center p-6 group-hover:-translate-y-1 transition-transform duration-300">
                                    <div className="relative w-20 h-20 flex items-center justify-center rounded-full shadow-md border border-gray-100 group-hover:shadow-lg transition-all duration-300 mb-4 overflow-hidden">
                                        {/* Different gradient colors for each brand */}
                                        <div className={`absolute inset-0 bg-gradient-to-br 
                                            ${index % 6 === 0 ? 'from-blue-50 to-blue-100' : 
                                              index % 6 === 1 ? 'from-green-50 to-green-100' : 
                                              index % 6 === 2 ? 'from-yellow-50 to-yellow-100' : 
                                              index % 6 === 3 ? 'from-red-50 to-red-100' : 
                                              index % 6 === 4 ? 'from-purple-50 to-purple-100' : 
                                              'from-pink-50 to-pink-100'} 
                                            opacity-100`} 
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-br 
                                            ${index % 6 === 0 ? 'from-blue-100 to-blue-200' : 
                                              index % 6 === 1 ? 'from-green-100 to-green-200' : 
                                              index % 6 === 2 ? 'from-yellow-100 to-yellow-200' : 
                                              index % 6 === 3 ? 'from-red-100 to-red-200' : 
                                              index % 6 === 4 ? 'from-purple-100 to-purple-200' : 
                                              'from-pink-100 to-pink-200'} 
                                            opacity-0 group-hover:opacity-100 transition-opacity duration-300`} 
                                        />
                                        <brandItem.icon className={`w-12 h-12 
                                            ${index % 6 === 0 ? 'text-blue-500' : 
                                              index % 6 === 1 ? 'text-green-500' : 
                                              index % 6 === 2 ? 'text-yellow-600' : 
                                              index % 6 === 3 ? 'text-red-500' : 
                                              index % 6 === 4 ? 'text-purple-500' : 
                                              'text-pink-500'} 
                                            transform group-hover:scale-110 transition-transform duration-300 relative z-10`} 
                                        />
                                    </div>
                                    <span className="font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300">
                                        {brandItem.label}
                                    </span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Featured Products Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-gray-900 relative inline-block">
                            Featured Products
                            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
                        </h2>
                        <p className="text-gray-600 text-lg mt-6">Discover our latest and most popular items</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {productList && productList.data && productList.data.length > 0 ? (
                            productList.data.map((productItem) => (
                                <div key={productItem.id} className="transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl rounded-xl overflow-hidden">
                                    <ShoppingProductTile
                                        product={productItem}
                                        handleGetProductDetails={handleGetProductDetails}
                                        handleAddtoCart={handleAddtoCart}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-16 flex flex-col items-center justify-center">
                                <p className="text-gray-500 text-xl mb-4">No products found</p>
                                <Button 
                                    variant="outline" 
                                    className="border-primary text-primary hover:bg-primary hover:text-white"
                                    onClick={() => dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: 'price-lowtohigh' }))}
                                >
                                    Refresh Products
                                </Button>
                            </div>
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