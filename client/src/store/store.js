import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice';
import adminProductsSlice from './admin/products-slice'
import shopProducsSlice from './shop/products-slice'
import shopCartSlice from './shop/cart-slice'
import shopAddressSlice from './shop//address-slice'
import shopOrderSlice from './shop/order-slice'
import adminOrderSlice from './admin/order-slice'
import shopSearchSlice from './shop/search-slice'






const store = configureStore({
    reducer: {
        auth: authReducer,

        adminOrder : adminOrderSlice,
        adminProducts : adminProductsSlice,

        shopProducts : shopProducsSlice,
        shopCart :  shopCartSlice,
        shopAddress : shopAddressSlice,
        shopOrder: shopOrderSlice,
        shopSearch : shopSearchSlice
    },
});

export default store;
