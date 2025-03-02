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
    return response.data.data;  // Aseguramos que el payload contenga la propiedad 'data' con las direcciones
  }
);

export const fetchAllAddresses = createAsyncThunk(
  "/addresses/fetchAllAddresses",
  async (userId) => {
    const response = await axios.get(
      `http://localhost:5000/api/shop/address/get/${userId}`
    );
    return response.data.data;  // Aseguramos que estamos extrayendo el 'data' correcto
  }
);

export const editaAddress = createAsyncThunk(
  "/addresses/editaAddress",
  async ({ userId, addressId, formData }) => {
    const response = await axios.put(
      `http://localhost:5000/api/shop/address/update/${userId}/${addressId}`,
      formData
    );
    return response.data.data;  // Aseguramos que el payload contenga la propiedad 'data' con la dirección editada
  }
);

export const deleteAddress = createAsyncThunk(
  "/addresses/deleteAddress",
  async ({ userId, addressId }) => {
    const response = await axios.delete(
      `http://localhost:5000/api/shop/address/delete/${userId}/${addressId}`
    );
    return response.data.data;  // Aseguramos que el payload contenga la propiedad 'data' con la dirección eliminada
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
        state.addressList.push(action.payload); // Añadir la nueva dirección a la lista
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
        state.addressList = action.payload; // Aquí asignamos directamente el array de direcciones
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
          address.id === action.payload.id ? action.payload : address
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
          (address) => address.id !== action.payload.id
        );
      })
      .addCase(deleteAddress.rejected, (state) => {
        state.isLoading = false;
        console.error('Error deleting address:', action.error.message);
      });
  },
});

export default addressSlice.reducer;
