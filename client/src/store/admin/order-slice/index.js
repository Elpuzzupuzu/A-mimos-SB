// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const initialState = {
//   orderList: [],
//   orderDetails: null,
// };

// export const getAllOrdersForAdmin = createAsyncThunk(
//   "/order/getAllOrdersForAdmin",
//   async () => {
//     const response = await axios.get(
//       `http://localhost:5000/api/admin/orders/get`
//     );

//     return response.data;
//   }
// );

// export const getOrderDetailsForAdmin = createAsyncThunk(
//   "/order/getOrderDetailsForAdmin",
//   async (id) => {
//     const response = await axios.get(
//       `http://localhost:5000/api/admin/orders/details/${id}`
//     );

//     return response.data;
//   }
// );

// export const updateOrderStatus = createAsyncThunk(
//   "/order/updateOrderStatus",
//   async ({ id, orderStatus }, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(
//         `http://localhost:5000/api/admin/orders/update/${id}`,
//         { orderStatus }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error en updateOrderStatus:", error.response?.data || error.message);
//       return rejectWithValue(error.response?.data || "Error desconocido");
//     }
//   }
// );

// const adminOrderSlice = createSlice({
//   name: "adminOrderSlice",
//   initialState,
//   reducers: {
//     resetOrderDetails: (state) => {
//       console.log("resetOrderDetails");
//       state.orderDetails = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(getAllOrdersForAdmin.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.orderList = action.payload.data;
//       })
//       .addCase(getAllOrdersForAdmin.rejected, (state) => {
//         state.isLoading = false;
//         state.orderList = [];
//       })
//       .addCase(getOrderDetailsForAdmin.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.orderDetails = action.payload.data;
//       })
//       .addCase(getOrderDetailsForAdmin.rejected, (state) => {
//         state.isLoading = false;
//         state.orderDetails = null;
//       })
//       .addCase(updateOrderStatus.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(updateOrderStatus.fulfilled, (state, action) => {
//         state.isLoading = false;
//         console.log("Pedido actualizado en Redux:", action.payload);

//         // Actualiza el estado en orderList sin recargar la página
//         state.orderList = state.orderList.map((order) =>
//           order._id === action.payload.data._id
//             ? { ...order, orderStatus: action.payload.data.orderStatus }
//             : order
//         );

//         // Si el pedido actualizado está en orderDetails, actualiza su estado también
//         if (state.orderDetails && state.orderDetails._id === action.payload.data._id) {
//           state.orderDetails.orderStatus = action.payload.data.orderStatus;
//         }
//       })
//       .addCase(updateOrderStatus.rejected, (state, action) => {
//         state.isLoading = false;
//         console.error("Error al actualizar pedido:", action.error.message);
//       });
//   },
// });

// export const { resetOrderDetails } = adminOrderSlice.actions;

// export default adminOrderSlice.reducer;


import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  orderDetails: null,
  redirectURL: null,  // Aquí guardamos la URL de redirección
  isLoading: false,
  error: null,
};

export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async () => {
    const response = await axios.get(
      `http://localhost:5000/api/admin/orders/get`
    );
    return response.data;
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async (id) => {
    const response = await axios.get(
      `http://localhost:5000/api/admin/orders/details/${id}`
    );
    return response.data;
  }
);

export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/shop/orders/create`,
        orderData
      );
      return response.data;  // Debería devolver un objeto que contenga `redirectURL`
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
        `http://localhost:5000/api/admin/orders/update/${id}`,
        { orderStatus }
      );
      return response.data;
    } catch (error) {
      console.error("Error en updateOrderStatus:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Error desconocido");
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      console.log("resetOrderDetails");
      state.orderDetails = null;
    },
    resetRedirectURL: (state) => {
      state.redirectURL = null;  // Resetea la URL de redirección
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
        state.orderDetails = action.payload.data;
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
          // Si la respuesta es exitosa, actualiza la URL de redirección
          state.redirectURL = action.payload.redirectURL;
        }
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("Pedido actualizado en Redux:", action.payload);

        // Actualiza el estado en orderList sin recargar la página
        state.orderList = state.orderList.map((order) =>
          order._id === action.payload.data._id
            ? { ...order, orderStatus: action.payload.data.orderStatus }
            : order
        );

        // Si el pedido actualizado está en orderDetails, actualiza su estado también
        if (state.orderDetails && state.orderDetails._id === action.payload.data._id) {
          state.orderDetails.orderStatus = action.payload.data.orderStatus;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        console.error("Error al actualizar pedido:", action.error.message);
      });
  },
});

export const { resetOrderDetails, resetRedirectURL } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
