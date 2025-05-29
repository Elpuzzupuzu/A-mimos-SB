import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// 🔹 Define la URL base de tu API aquí
const API_BASE_URL = 'http://localhost:5000/api'; 

const initialState = {
    approvalURL: null,
    isLoading: false,
    orderId: null,
    orderList: [],
    orderDetails: null,
    redirectURL: null, 
};

// 🔹 Thunks refactorizados para usar la URL base
export const createNewOrder = createAsyncThunk(
    'order/createNewOrder', 
    async (orderData) => {
        const response = await axios.post(`${API_BASE_URL}/shop/orders/create`, orderData);
        return response.data;
    }
);

export const capturePayment = createAsyncThunk(
    'order/capturePayment', 
    async ({ paymentId, payerId, orderId }) => {
        const response = await axios.post(`${API_BASE_URL}/shop/orders/capture`, {
            paymentId, 
            payerId, 
            orderId
        });
        return response.data;
    }
);

export const getAllOrdersByUserId = createAsyncThunk(
    'order/getAllOrdersByUserId', 
    async (userId) => {
        const response = await axios.get(`${API_BASE_URL}/shop/orders/list/${userId}`);
        return response.data;
    }
);

export const getOrderDetails = createAsyncThunk(
    'order/getOrderDetails', 
    async (id) => {
        const response = await axios.get(`${API_BASE_URL}/shop/orders/details/${id}`);
        console.log("Detalles de la orden:", response.data);

        return response.data;
    }
);



const shoppingOrderSlice = createSlice({
    name: 'shoppingOrderSlice',
    initialState,
    reducers: {
        resetOrderDetails: (state) => {
            state.orderDetails = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Crear nueva orden
            .addCase(createNewOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createNewOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.approvalURL = action.payload.approvalURL;
                state.orderId = action.payload.orderId;
                sessionStorage.setItem('currentOrderId', JSON.stringify(action.payload.orderId));
            })
            .addCase(createNewOrder.rejected, (state) => {
                state.isLoading = false;
                state.approvalURL = null;
                state.orderId = null;
            })

            // Obtener todas las órdenes por userId
            .addCase(getAllOrdersByUserId.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderList = action.payload.data;
            })
            .addCase(getAllOrdersByUserId.rejected, (state) => {
                state.isLoading = false;
                state.orderList = [];
            })

            // Obtener detalles de la orden por id
            .addCase(getOrderDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderDetails = {
                    ...action.payload.data,
                    // Asegúrate de que payload.data y sus propiedades existan antes de intentar parsear
                    cartItems: action.payload.data?.cartItems ? JSON.parse(action.payload.data.cartItems) : [], 
                    addressInfo: action.payload.data?.addressInfo ? JSON.parse(action.payload.data.addressInfo) : {} 
                };
            })
            
            .addCase(getOrderDetails.rejected, (state) => {
                state.isLoading = false;
                state.orderDetails = null;
            })

            // Captura del pago y redirección
            .addCase(capturePayment.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(capturePayment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.redirectURL = action.payload.redirectURL;
                if (state.redirectURL) {
                    window.location.href = state.redirectURL;
                }
            })
            .addCase(capturePayment.rejected, (state) => {
                state.isLoading = false;
                state.redirectURL = null;
            });
    }
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;