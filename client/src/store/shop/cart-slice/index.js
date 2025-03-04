import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/shop/cart";

const initialState = {
    cartItems: [],
    cartId: null,  // Agregado para almacenar el cartId
    isLoading: false,
    error: null
};

// **Obtener el cartId**
export const fetchCartId = createAsyncThunk(
    "cart/fetchCartId",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/cart-id/${userId}`);
            console.log("Cart ID:", response.data.cartId);  // Verifica el cartId obtenido
            return { cartId: response.data.cartId }; // Retorna solo el cartId
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error al obtener el cartId");
        }
    }
);

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
            // console.log(response.data, "revisión del slice");

            const { cartId, data: items } = response.data;

            // console.log("Cart ID desde la respuesta:", cartId);
            // console.log("Items:", items);

            return { cartId, items };

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
            // **Obtener el cartId**
            .addCase(fetchCartId.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCartId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartId = action.payload.cartId; // Almacena el cartId
                // console.log("Cart ID almacenado en el estado:", action.payload.cartId);
            })
            .addCase(fetchCartId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

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
                const { cartId, items } = action.payload;
                state.isLoading = false;
                state.cartItems = items;  // Guarda solo los items
                state.cartId = cartId;   // Guarda el cartId
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
