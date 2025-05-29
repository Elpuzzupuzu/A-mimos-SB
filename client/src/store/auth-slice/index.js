import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// 🔹 Define la URL base de tu API aquí
const API_BASE_URL = 'http://localhost:5000/api'; 

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null
};

// 🔹 Thunks refactorizados para usar la URL base
export const registerUser = createAsyncThunk('/auth/register',
    async (FormData) => {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, FormData, {
            withCredentials: true,
        });
        return response.data;
    }
);

export const loginUser = createAsyncThunk('/auth/login',
    async (FormData) => {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, FormData, {
            withCredentials: true,
        });
        return response.data;
    }
);

export const logoutUser = createAsyncThunk('/auth/logout',
    async () => { // No necesitas FormData si el cuerpo de la petición es un objeto vacío
        const response = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
            withCredentials: true,
        });
        return response.data;
    }
);

export const checkAuth = createAsyncThunk('/auth/checkauth',
    async () => {
        const response = await axios.get(`${API_BASE_URL}/auth/check-auth`, {
            withCredentials: true,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                Expires: '0'
            }
        });
        return response.data; 
    }
);



const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Reducer 'setUser' mantenido si lo necesitas para otras lógicas que no sean asíncronas
        setUser: (state, action) => {
            // Ejemplo: state.isAuthenticated = true;
            // Ejemplo: state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register User
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = false; // Ajusta esto según tu lógica de registro/autenticación
            })
            .addCase(registerUser.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            // Login User
            .addCase(loginUser.pending, (state) => { 
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log(action);
                state.isLoading = false;
                // Asume que la respuesta tiene { success: boolean, user: object }
                state.user = action.payload.success ? action.payload.user : null; 
                state.isAuthenticated = action.payload.success;
            })
            .addCase(loginUser.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            // Check Auth
            .addCase(checkAuth.pending, (state) => { 
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                console.log(action);
                state.isLoading = false;
                // Asume que la respuesta tiene { success: boolean, user: object }
                state.user = action.payload.success ? action.payload.user : null; 
                state.isAuthenticated = action.payload.success;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            // Logout User
            .addCase(logoutUser.fulfilled, (state) => { // No necesitas 'action' si solo reseteas el estado
                state.isLoading = false;
                state.user = null; 
                state.isAuthenticated = false;
            });
    }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;