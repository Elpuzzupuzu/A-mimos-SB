import './App.css';
import AdminLayout from './components/admin-view/layout';
import AuthLayout from './components/auth/layout';
import ShoppingLayout from './components/shopping-view/layout';
// import SearchLayout from './components/shopping-view/SearchLayout';
import AdminDashboard from './pages/admin-view/dashboard';
import AdminFeatures from './pages/admin-view/features';
import AdminOrders from './pages/admin-view/order';
import AdminProducts from './pages/admin-view/products';
import AuthLogin from './pages/auth/login';
import AutRegister from './pages/auth/register';
import RecoverPassword from './pages/auth/RecoverPassword';
import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/not-found';
import ShoppingHome from './pages/shopping-view/home';
import ShoppingListing from './pages/shopping-view/listing';
import ShoppingCheckout from './pages/shopping-view/checkout';
import ShoppingAccount from './pages/shopping-view/account';
import CheckAuth from './components/common/check-auth'; // Mantenemos la importación pero no la usaremos en /auth
import UnauthPage from './pages/unauth-page';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { checkAuth } from './store/auth-slice';
import { Skeleton } from "@/components/ui/skeleton"
import PaypalReturnPage from './pages/shopping-view/paypal-return';
import PaypalSuccessPage from './pages/shopping-view/payment-success';
import SearchPage from './pages/shopping-view/search-page';

function App() {
    const { user, isAuthenticated, isLoading } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkAuth())
    }, [dispatch]);

    // Opcional: Para esta prueba, podrías incluso comentar temporalmente esta línea para evitar la Skeleton
    // si sospechas que el error ocurre antes de que la skeleton se renderice.
    // if (isLoading) return <Skeleton className="w-[800px] bg-black h-[600px] " />

    console.log(isLoading, user)

    return (
        <div className="flex flex-col overflow-hidden bg-white">
            <Routes>
                {/* Rutas de autenticación - SIN CheckAuth para esta prueba */}
                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<AuthLogin />} />
                    <Route path="register" element={<AutRegister />} />
                    <Route path="recover-password" element={<RecoverPassword />} />
                </Route>

                {/* Rutas del admin - Siguen protegidas por CheckAuth */}
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

                {/* Rutas de la tienda - Siguen protegidas por CheckAuth */}
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
                </Route>

                <Route path="/unauth-page" element={<UnauthPage />} />

                {/* Ruta comodín para cualquier otra cosa - ¡IMPORTANTE: esta debe ir al final! */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;