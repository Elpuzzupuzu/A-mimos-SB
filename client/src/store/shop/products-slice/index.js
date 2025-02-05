import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    productList: [],
    producDetails : null
};

export const fetchAllFilteredProducts = createAsyncThunk(
    "/products/fetchAllProducts",
    async ({filterParams, sortParams}) => {

        const query = new URLSearchParams({
            ...filterParams,
            sortBy : sortParams

        })



        const result = await axios.get(`http://localhost:5000/api/shop/products/get?${query}`);
        return result?.data;
    }
);


export const fetchProductDetails = createAsyncThunk(
    "/products/fetchProductDetails",
    async (id) => {
   
        const result = await axios.get(`http://localhost:5000/api/shop/products/get/${id}`);
        console.log(result, "busqueda por id");
        
        return result?.data;
    }
);

const shoppingProductSlice = createSlice({
    name: "shoppingProducts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllFilteredProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
                console.log(action.payload , "action payload index");
                state.isLoading = false;
                state.productList = action.payload;
            })
            .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
                console.log(action.payload);
                state.isLoading = false;
                state.productList = [];
            }).addCase(fetchProductDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                console.log(action.payload , "action payload index");
                state.isLoading = false;
                state.productDetails = action.payload.data;
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                console.log(action.payload);
                state.isLoading = false;
                state.producDetails = null;
            });
    },
});

export default shoppingProductSlice.reducer
