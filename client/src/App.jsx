import './App.css';
import AdminLayout from './components/admin-view/layout';
import AuthLayout from './components/auth/layout';
import ShoppingLayout from './components/shopping-view/layout';
// import SearchLayout from './components/shopping-view/SearchLayout';  // Importa SearchLayout de forma independiente
import AdminDashboard from './pages/admin-view/dashboard';
import AdminFeatures from './pages/admin-view/features';
import AdminOrders from './pages/admin-view/order';
import AdminProducts from './pages/admin-view/products';
import AuthLogin from './pages/auth/login';
import AutRegister from './pages/auth/register';
import RecoverPassword from './pages/auth/RecoverPassword'; // Importa RecoverPassword
import { Routes, Route } from 'react-router-dom'; 
import NotFound from './pages/not-found';
import ShoppingHome from './pages/shopping-view/home';
import ShoppingListing from './pages/shopping-view/listing';
import ShoppingCheckout from './pages/shopping-view/checkout';
import ShoppingAccount from './pages/shopping-view/account';
import CheckAuth from './components/common/check-auth';
import UnauthPage from './pages/unauth-page';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { checkAuth } from './store/auth-slice';
import { Skeleton } from "@/components/ui/skeleton"
import PaypalReturnPage from './pages/shopping-view/paypal-return'; // Importa la nueva página
import PaypalSuccessPage from './pages/shopping-view/payment-success';
import SearchPage from './pages/shopping-view/search-page';

function App() {
    const { user, isAuthenticated, isLoading } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkAuth())
    }, [dispatch]);

    if (isLoading) return <Skeleton className="w-[800px] bg-black h-[600px] " />

    console.log(isLoading, user)

    return (
        <div className="flex flex-col overflow-hidden bg-white">
            <Routes>
                {/* Rutas de autenticación */}
                <Route path="/auth" element={
                    <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                        <AuthLayout />
                    </CheckAuth>
                }>
                    <Route path="login" element={<AuthLogin />} />
                    <Route path="register" element={<AutRegister />} />
                    <Route path="recover-password" element={<RecoverPassword />} />
                </Route>

                {/* Rutas del admin */}
                <Route path="/admin" element={
                    <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                        <AdminLayout />
                    </CheckAuth>
                }>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="features" element={<AdminFeatures />} />
                </Route>

                {/* Rutas de la tienda */}
                <Route path="/shop" element={
                    <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                        <ShoppingLayout />
                    </CheckAuth>
                }>
                    <Route path="home" element={<ShoppingHome />} />
                    <Route path="listing" element={<ShoppingListing />} />
                    <Route path="checkout" element={<ShoppingCheckout />} />
                    <Route path="account" element={<ShoppingAccount />} />
                    <Route path="paypal-return" element={<PaypalReturnPage />} />
                    <Route path="payment-success" element={<PaypalSuccessPage />} />
                    {/* <Route path="search" element={<SearchLayout />} />  */}
                </Route>

                {/* Ruta para la página de búsqueda - independiente del layout de tienda */}
                {/* <Route path="/search" element={<SearchLayout />} /> Ruta separada */}

                {/* Ruta para la página de no encontrado */}
                <Route path="*" element={<NotFound />} />
                <Route path="/unauth-page" element={<UnauthPage />} />
            </Routes>
        </div>
    );
}

export default App;
