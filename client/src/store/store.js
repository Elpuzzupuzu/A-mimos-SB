import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice';
import adminProductsSlice from './admin/products-slice'
import adminProducts from '@/pages/admin-view/products';

const store = configureStore({
    reducer: {
        auth: authReducer,
        adminProducts : adminProductsSlice,
    },
});

export default store;
