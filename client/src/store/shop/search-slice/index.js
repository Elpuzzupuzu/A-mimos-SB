import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 🔹 Define la URL base de tu API aquí
const API_BASE_URL = 'http://localhost:5000/api'; 

const initialState = {
    isLoading: false,
    searchResults: { data: [] },
};

// Acción para buscar productos
export const searchProducts = createAsyncThunk(
    "/products/searchProducts",
    async ({ query, limit, offset }) => {
        const queryParams = new URLSearchParams({
            query,
            limit,
            offset
        });

        try {
            // 🔹 Usa la URL base aquí
            const result = await axios.get(`${API_BASE_URL}/shop/search?${queryParams}`);
            
            // Regresamos un objeto con la propiedad 'data' para que sea consistente con el estado
            return { data: result?.data?.data || [] };
        } catch (error) {
            console.error("Error searching products:", error);
            throw error;
        }
    }
);

const searchProductSlice = createSlice({
    name: "searchProducts",
    initialState,
    reducers: {
        clearSearchResults: (state) => {
            state.searchResults = { data: [] };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.searchResults = action.payload;
            })
            .addCase(searchProducts.rejected, (state) => { // Eliminado 'action' si no se usa
                state.isLoading = false;
                state.searchResults = { data: [] };
            });
    }
});

export const { clearSearchResults } = searchProductSlice.actions;

export default searchProductSlice.reducer;