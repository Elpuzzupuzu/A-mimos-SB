import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    searchResults: { data: [] },  // Modificado para ser un objeto con la propiedad 'data'
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
            const result = await axios.get(`http://localhost:5000/api/shop/search?${queryParams}`);
            
            // Regresamos un objeto con la propiedad 'data' para que sea consistente con el estado
            return { data: result?.data?.data || [] };  // Aquí asignamos 'data' en lugar de 'products'
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
            state.searchResults = { data: [] };  // Limpiar resultados de búsqueda
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.searchResults = action.payload;  // Asignamos el objeto con 'data'
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.searchResults = { data: [] };  // Aseguramos que 'searchResults' siempre tenga 'data'
            });
    }
});

export const { clearSearchResults } = searchProductSlice.actions;

export default searchProductSlice.reducer;
