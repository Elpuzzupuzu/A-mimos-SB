import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    cartItems: [],
    isLoading: false
};

export const addToCart = createAsyncThunk('cart/addToCart', async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:5000/api/shop/cart/add', { userId, productId, quantity });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Error desconocido");
    }
});

export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async (userId) => {
    const response = await axios.get(`http://localhost:5000/api/shop/cart/get/${userId}`);
    console.log("Datos del carrito obtenidos:", response.data); // <-- Depuración
    return response.data;
});

export const deleteCartItem = createAsyncThunk('cart/deleteCartItem', async ({ userId, productId }) => {
    const response = await axios.delete(`http://localhost:5000/api/shop/cart/${userId}/${productId}`);
    return response.data;
});

export const updateCartQuantity = createAsyncThunk('cart/updateCartQuantity', async ({ userId, productId, quantity }) => {
    const response = await axios.put('http://localhost:5000/api/shop/cart/update-cart', { userId, productId, quantity });
    return response.data;
});

const shoppingCartSlice = createSlice({
    name: 'shoppingCart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.isLoading = false;
                console.error("Error al agregar al carrito:", action.error);
            })
            .addCase(fetchCartItems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.isLoading = false;
                // console.log("Datos guardados en Redux:", action.payload);
                state.cartItems = action.payload.data;
            })
            .addCase(fetchCartItems.rejected, (state, action) => {
                state.isLoading = false;
                console.error("Error al obtener el carrito:", action.error);
            })
            .addCase(updateCartQuantity.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload;
            }).
            addCase(updateCartQuantity.rejected, (state, action) => {
                state.isLoading = false;
                state.cartItems = [];
            })
            .addCase(deleteCartItem.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCartItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            }).
            addCase(deleteCartItem.rejected, (state, action) => {
                state.isLoading = false;
                state.cartItems = [];
            });
    }
});

export default shoppingCartSlice.reducer;
