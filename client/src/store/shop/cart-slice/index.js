import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/shop/cart";

const initialState = {
    cartItems: [],
    isLoading: false,
    error: null
};

// **Agregar producto al carrito**
export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ userId, productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/add`, { userId, productId, quantity });
            return response.data.data; // Supabase devuelve `{ success: true, data: [...] }`
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error desconocido");
        }
    }
);

// **Obtener productos del carrito**
export const fetchCartItems = createAsyncThunk(
    "cart/fetchCartItems",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/get/${userId}`);
            return response.data.data; // Asegurar que accede a la clave `data`
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error al obtener el carrito");
        }
    }
);

// **Actualizar cantidad de un producto en el carrito**
export const updateCartQuantity = createAsyncThunk(
    "cart/updateCartQuantity",
    async ({ userId, productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/update-cart`, { userId, productId, quantity });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error al actualizar la cantidad");
        }
    }
);

// **Eliminar producto del carrito**
export const deleteCartItem = createAsyncThunk(
    "cart/deleteCartItem",
    async ({ userId, productId }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/${userId}/${productId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error al eliminar el producto");
        }
    }
);

const shoppingCartSlice = createSlice({
    name: "shoppingCart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // **Agregar producto al carrito**
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload; // Ya es un array de productos
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // **Obtener productos del carrito**
            .addCase(fetchCartItems.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload;
            })
            .addCase(fetchCartItems.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // **Actualizar cantidad de producto**
            .addCase(updateCartQuantity.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload;
            })
            .addCase(updateCartQuantity.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // **Eliminar producto del carrito**
            .addCase(deleteCartItem.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteCartItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload;
            })
            .addCase(deleteCartItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default shoppingCartSlice.reducer;
