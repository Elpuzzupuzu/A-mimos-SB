import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    isAuthenticated: false,
    isLoading: false,
    user: null
};

export const registerUser = createAsyncThunk('/auth/register',
    async (FormData) => {
        const response = await axios.post('http://localhost:5000/api/auth/register', FormData, {
            withCredentials: true,
        });
        return response.data;
    }
);

export const loginUser = createAsyncThunk('/auth/login',
    async (FormData) => {
        const response = await axios.post('http://localhost:5000/api/auth/login', FormData, {
            withCredentials: true,
        });
        return response.data;
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            // state.isAuthenticated = true;
            // state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => { // Cambiado de isPending a pending
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload; // Se asigna el usuario recibido en la acción
                state.isAuthenticated = false; // EN OBSERVACIO
            })
            .addCase(registerUser.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })  .addCase(loginUser.pending, (state) => { // 
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log(action);
                state.isLoading = false;
                state.user = action.payload.success ? action.
                payload.user : null; // 
                state.isAuthenticated = action.payload.success 
            })
            .addCase(loginUser.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            });
    }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
