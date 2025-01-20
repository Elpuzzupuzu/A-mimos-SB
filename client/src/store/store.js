import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice';
import adminProductsSlice from './admin/products-slice'
import AdminProducts from '@/pages/admin-view/products';

const store = configureStore({
    reducer: {
        auth: authReducer,
        AdminProducts : adminProductsSlice,
    },
});

export default store;
