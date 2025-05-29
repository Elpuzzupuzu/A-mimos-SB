import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// 🔹 Define la URL base de tu API aquí
const API_BASE_URL = 'http://localhost:5000/api'; 

const initialState = {
  orderList: [],
  orderDetails: null,
  redirectURL: null,
  isLoading: false,
  error: null,
};

// 🔹 Thunks refactorizados para usar la URL base
export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async () => {
    const response = await axios.get(
      `${API_BASE_URL}/admin/orders/get` // 🔹 Usando la URL base
    );
    return response.data;
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async (id) => {
    const response = await axios.get(
      `${API_BASE_URL}/admin/orders/details/${id}` // 🔹 Usando la URL base
    );
    return response.data;
  }
);

export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/shop/orders/create`, // 🔹 Usando la URL base (ruta de shop para crear orden)
        orderData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error creando la orden");
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/orders/update/${id}`, // 🔹 Usando la URL base
        { orderStatus }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error desconocido");
    }
  }
);



const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
    resetRedirectURL: (state) => {
      state.redirectURL = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = {
          ...action.payload.data,
          // Añadimos verificaciones para evitar errores si los datos no están presentes
          cartItems: action.payload.data?.cartItems ? JSON.parse(action.payload.data.cartItems) : [], 
          addressInfo: action.payload.data?.addressInfo ? JSON.parse(action.payload.data.addressInfo) : {}, 
        };
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.redirectURL = action.payload.redirectURL;
        }
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // El payload ya contiene el error de rejectWithValue
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = state.orderList.map((order) =>
          order._id === action.payload.data._id
            ? { ...order, orderStatus: action.payload.data.orderStatus }
            : order
        );

        if (state.orderDetails && state.orderDetails._id === action.payload.data._id) {
          state.orderDetails.orderStatus = action.payload.data.orderStatus;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Asegúrate de capturar el error de rejectWithValue
      });
  },
});

export const { resetOrderDetails, resetRedirectURL } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;