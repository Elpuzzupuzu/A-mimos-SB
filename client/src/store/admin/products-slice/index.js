// import axios from "axios";

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";




// const initialState = {
//     isLoading : false,
//     productsList : []
// }
// export const addNewProduct = createAsyncThunk(
//     '/products/addnewproduct',
//     async (formData) => {
//       const result = await axios.post('http://localhost:5000/api/admin/products/add',formData,{
//         headers :{
//             'Content-Type' : 'application/json'

//         }
//       });
//       return result?.data;
//     }
//   );


//   export const fetchAllProducts = createAsyncThunk(
//     '/products/fetchAllProducts',
//     async () => {
//       const result = await axios.get('http://localhost:5000/api/admin/products/get');
        
//       return result?.data;
//     }
//   );


//   export const editProduct = createAsyncThunk(
//     '/products/editProduct',
//     async ({id,formData}) => {
//       const result = await axios.put(`http://localhost:5000/api/admin/products/edit/:${id}`,formData,{
//         headers :{
//             'Content-Type' : 'application/json'

//         }
//       });
//       return result?.data;
//     }
//   );


//   export const deleteProduct = createAsyncThunk(
//     '/products/deleteProduct',
//     async (formData) => {
//       const result = await axios.delete(`http://localhost:5000/api/admin/products/delete/:${id}`); 
//       return result?.data;
//     }
//   );





  
  

// const AdminProductsSlice = createSlice({
//     name : 'adminProducts',
//     initialState ,
//     reducers : {},
//     extraReducers : (builder)=> {
//         builder.addCase(fetchAllProducts.pending,(state)=>{
//             state.isLoading = true
//         }).addCase(fetchAllProducts.fulfilled, (state,action)=>{
//             console.log(action.payload);
//             state.isLoading = false
//             state.productsList = action.payload

//         }).addCase(fetchAllProducts.rejected, (state,action)=>{
//             console.log(action.payload);
//             state.isLoading = false
//             state.productsList = []

//         })

//     }


// })

//  export default AdminProductsSlice.reducer;



// import axios from "axios";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// const initialState = {
//   isLoading: false,
//   productsList: [],
//   error: null,
// };

// // Agregar un nuevo producto
// export const addNewProduct = createAsyncThunk(
//   '/products/addnewproduct',
//   async (formData) => {
//     const result = await axios.post('http://localhost:5000/api/admin/products/add', formData, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     return result?.data;
//   }
// );

// // Obtener todos los productos
// export const fetchAllProducts = createAsyncThunk(
//   '/products/fetchAllProducts',
//   async () => {
//     const result = await axios.get('http://localhost:5000/api/admin/products/get');
//     return result?.data;
//   }
// );

// // Editar un producto
// export const editProduct = createAsyncThunk(
//   '/products/editProduct',
//   async ({ id, formData }) => {
//     const result = await axios.put(`http://localhost:5000/api/admin/products/edit/${id}`, formData, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     return result?.data;
//   }
// );

// // Eliminar un producto
// export const deleteProduct = createAsyncThunk(
//   '/products/deleteProduct',
//   async (id) => {
//     const result = await axios.delete(`http://localhost:5000/api/admin/products/delete/${id}`);
//     return result?.data;
//   }
// );

// const AdminProductsSlice = createSlice({
//   name: 'adminProducts',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAllProducts.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchAllProducts.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.productsList = action.payload;
//       })
//       .addCase(fetchAllProducts.rejected, (state, action) => {
//         state.isLoading = false;
//         state.productsList = [];
//         state.error = action.error.message; // Manejo de error
//       });
//   },
// });

// export default AdminProductsSlice.reducer;



// test


import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  productList: [],
  error: null,
};

// Agregar un nuevo producto
export const addNewProduct = createAsyncThunk(
  '/products/addnewproduct',
  async (formData) => {
    const result = await axios.post('http://localhost:5000/api/admin/products/add', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return result?.data;
  }
);

// Obtener todos los productos
export const fetchAllProducts = createAsyncThunk(
  '/products/fetchAllProducts',
  async () => {
    const result = await axios.get('http://localhost:5000/api/admin/products/get');
    return result?.data;
  }
);

// Editar un producto
export const editProduct = createAsyncThunk(
  '/products/editProduct',
  async ({ id, formData }) => {
    const result = await axios.put(`http://localhost:5000/api/admin/products/edit/${id}`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return result?.data;
  }
);

// Eliminar un producto
export const deleteProduct = createAsyncThunk(
  '/products/deleteProduct',
  async (id) => {
    const result = await axios.delete(`http://localhost:5000/api/admin/products/delete/${id}`);
    return result?.data;
  }
);

const AdminProductsSlice = createSlice({
  name: 'adminProducts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        console.log(action.payload); //
        state.isLoading = false;
        state.productList = action.payload.data;  // esto hace que obtenga los valores del form
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
        state.error = action.error.message; // Manejo de error
      });
  },
});

export default AdminProductsSlice.reducer;
