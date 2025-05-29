import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔹 Define la URL base de tu API aquí
const API_BASE_URL = 'http://localhost:5000/api'; 

const initialState = {
  isLoading: false,
  addressList: [],
};

export const addNewAddress = createAsyncThunk(
  "/addresses/addNewAddress",
  async (formData) => {
    const response = await axios.post(
      `${API_BASE_URL}/shop/address/add`, // 🔹 Usando la URL base
      formData
    );
    return response.data.data;
  }
);

export const fetchAllAddresses = createAsyncThunk(
  "/addresses/fetchAllAddresses",
  async (userId) => {
    const response = await axios.get(
      `${API_BASE_URL}/shop/address/get/${userId}` // 🔹 Usando la URL base
    );
    return response.data.data;
  }
);

export const editaAddress = createAsyncThunk(
  "/addresses/editaAddress",
  async ({ userId, addressId, formData }) => {
    const response = await axios.put(
      `${API_BASE_URL}/shop/address/update/${userId}/${addressId}`, // 🔹 Usando la URL base
      formData
    );
    return response.data.data;
  }
);

export const deleteAddress = createAsyncThunk(
  "/addresses/deleteAddress",
  async ({ userId, addressId }) => {
    const response = await axios.delete(
      `${API_BASE_URL}/shop/address/delete/${userId}/${addressId}` // 🔹 Usando la URL base
    );
    return response.data.data;
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
        state.isLoading = false;
        state.addressList.push(action.payload);
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      });

    // Fetch all addresses
    builder
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload;
      })
      .addCase(fetchAllAddresses.rejected, (state, action) => { // 🔹 Incluí 'action' para acceder al error
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
        state.addressList = state.addressList.map((address) =>
          address.id === action.payload.id ? action.payload : address
        );
      })
      .addCase(editaAddress.rejected, (state, action) => { // 🔹 Incluí 'action' para acceder al error
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
        state.addressList = state.addressList.filter(
          (address) => address.id !== action.payload.id
        );
      })
      .addCase(deleteAddress.rejected, (state, action) => { // 🔹 Incluí 'action' para acceder al error
        state.isLoading = false;
        console.error('Error deleting address:', action.error.message);
      });
  },
});

export default addressSlice.reducer;