import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 🔹 Define la URL base de tu API aquí
const API_BASE_URL = 'http://localhost:5000/api'; 

const initialState = {
    isLoading: false,
    productList: { data: [] },
    productDetails: null
};

// Acción para obtener productos filtrados y ordenados
export const fetchAllFilteredProducts = createAsyncThunk(
    "/products/fetchAllProducts",
    async ({ filterParams, sortParams }) => {
        const query = new URLSearchParams({
            ...filterParams,
            sortBy: sortParams
        });

        try {
            // 🔹 Usa la URL base aquí
            const result = await axios.get(`${API_BASE_URL}/shop/products/get?${query}`);
            
            // Regresamos un objeto con la propiedad 'data' para que sea consistente con el estado
            return { data: result?.data?.data || [] };
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    }
);

// Acción para obtener detalles de un producto por ID
export const fetchProductDetails = createAsyncThunk(
    "/products/fetchProductDetails",
    async (id) => {
        try {
            // 🔹 Usa la URL base aquí
            const result = await axios.get(`${API_BASE_URL}/shop/products/get/${id}`);
            console.log(result, "busqueda por id");
            return result?.data;
        } catch (error) {
            console.error("Error fetching product details:", error);
            throw error;
        }
    }
);

const shoppingProductSlice = createSlice({
    name: "shoppingProducts",
    initialState,
    reducers: {
        setProductDetails: (state) => {
            state.productDetails = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllFilteredProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
                console.log(action.payload, "action payload index");
                state.isLoading = false;
                state.productList = action.payload;
            })
            .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
                console.log(action.payload);
                state.isLoading = false;
                state.productList = { data: [] };
            })
            .addCase(fetchProductDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                console.log(action.payload, "action payload index");
                state.isLoading = false;
                state.productDetails = action.payload.data; // Ajusta según la estructura de la respuesta de la API
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                console.log(action.payload);
                state.isLoading = false;
                state.productDetails = null;
            });
    }
});

export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;