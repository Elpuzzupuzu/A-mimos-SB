import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";



const initialState = {
    isLoading: false,
    productList: [],
    productDetails: null,
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0
};



export const fetchAllFilteredProducts = createAsyncThunk(
    "/products/fetchAllProducts",
    async ({ filterParams, sortParams, page = 1, limit = 10 }) => {
        const query = new URLSearchParams({
            ...filterParams,
            sortBy: sortParams,
            page,
            limit
        });

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
    reducers: {
        setProductDetails : (state) => {
            state.productDetails = null
        }
    },
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
            // .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
            //     console.log(action.payload, "action payload index");
            //     state.isLoading = false;
            //     state.productList = action.payload;
            //     state.currentPage = action.payload.currentPage;
            //     state.totalPages = action.payload.totalPages;
            //     state.totalProducts = action.payload.totalProducts;
            // })
            
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

export const {setProductDetails} = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer

