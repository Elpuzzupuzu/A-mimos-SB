import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  addressList: [],
};

export const addNewAddress = createAsyncThunk(
  "/addresses/addNewAddress",
  async (formData) => {
    const response = await axios.post(
      "http://localhost:5000/api/shop/address/add",
      formData
    );

    return response.data;
  }
);

export const fetchAllAddresses = createAsyncThunk(
  "/addresses/fetchAllAddresses",
  async (userId) => {
    const response = await axios.get(
      `http://localhost:5000/api/shop/address/get/${userId}`
    );

    return response.data.data;
  }
);

export const editaAddress = createAsyncThunk(
  "/addresses/editaAddress",
  async ({ userId, addressId, formData }) => {
    const response = await axios.put(
      `http://localhost:5000/api/shop/address/update/${userId}/${addressId}`,
      formData
    );

    return response.data;
  }
);

export const deleteAddress = createAsyncThunk(
  "/addresses/deleteAddress",
  async ({ userId, addressId }) => {
    const response = await axios.delete(
      `http://localhost:5000/api/shop/address/delete/${userId}/${addressId}`
    );

    return response.data;
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add new address
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        console.log('Datos recibidos:', action.payload); // Verifica si los datos son los esperados
        state.isLoading = false;
        state.addressList = action.payload; // Esto debería ser el array de direcciones
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
        // state.addressList = []
      });

    // Fetch all addresses
    builder
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload;  // Aquí asignamos directamente el array de direcciones
      })
      .addCase(fetchAllAddresses.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
        console.error('Error fetching addresses:', action.error.message);
      });

    // Edit address
    builder
      .addCase(editaAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editaAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        // Actualiza la dirección editada en la lista
        state.addressList = state.addressList.map((address) =>
          address._id === action.payload._id ? action.payload : address
        );
      })
      .addCase(editaAddress.rejected, (state) => {
        state.isLoading = false;
        console.error('Error editing address:', action.error.message);
      });

    // Delete address
    builder
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        // Elimina la dirección de la lista
        state.addressList = state.addressList.filter(
          (address) => address._id !== action.payload._id
        );
      })
      .addCase(deleteAddress.rejected, (state) => {
        state.isLoading = false;
        console.error('Error deleting address:', action.error.message);
      });
  },
});

export default addressSlice.reducer;
