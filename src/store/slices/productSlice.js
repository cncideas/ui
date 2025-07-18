// src/store/slices/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';

// URL base de tu API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// También puedes crear una función helper para logging en desarrollo
const isDevelopment = import.meta.env.MODE === 'development';
const logInfo = (message, data) => {
  if (isDevelopment) {
    console.log(message, data);
  }
};

// Thunks para operaciones asíncronas
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/frontend`);
      if (!response.ok) {
        throw new Error('Error al obtener productos');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Agregar todos los campos al FormData
      Object.keys(productData).forEach(key => {
        if (key === 'caracteristicas') {
          // Enviar características como JSON string
          formData.append(key, JSON.stringify(productData[key]));
        } else if (key === 'imagenes' && productData[key]) {
          // Manejar múltiples imágenes
          if (Array.isArray(productData[key])) {
            productData[key].forEach(file => {
              formData.append('imagenes', file);
            });
          } else {
            formData.append('imagenes', productData[key]);
          }
        } else if (key !== 'imagenes') {
          formData.append(key, productData[key]);
        }
      });

      logInfo('FormData creado para producto:', formData);

      const response = await fetch(`${API_BASE_URL}/productos`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear producto');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Agregar todos los campos al FormData
      Object.keys(productData).forEach(key => {
        if (key === 'caracteristicas') {
          formData.append(key, JSON.stringify(productData[key]));
        } else if (key === 'imagenes' && productData[key]) {
          // Manejar múltiples imágenes
          if (Array.isArray(productData[key])) {
            productData[key].forEach(file => {
              formData.append('imagenes', file);
            });
          } else {
            formData.append('imagenes', productData[key]);
          }
        } else if (key !== 'imagenes' && productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });

      logInfo('FormData creado para actualización:', formData);

      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar producto');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar producto');
      }

      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/productos/${id}`);
      if (!res.ok) throw new Error('Error al obtener producto');
      const data = await res.json();
      return data; // Ya viene con las imágenes en formato base64
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Nuevos thunks para manejar imágenes específicas
export const addProductImages = createAsyncThunk(
  'products/addProductImages',
  async ({ id, imageFiles }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      if (Array.isArray(imageFiles)) {
        imageFiles.forEach(file => {
          formData.append('imagenes', file);
        });
      } else {
        formData.append('imagenes', imageFiles);
      }

      const response = await fetch(`${API_BASE_URL}/productos/${id}/imagenes`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al agregar imágenes');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeProductImage = createAsyncThunk(
  'products/removeProductImage',
  async ({ id, imageIndex }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}/imagen/${imageIndex}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar imagen');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    currentProduct: null,
    loading: false,
    error: null,
    searchTerm: '',
    selectedCategory: 'all',
    currentPage: 1,
    totalPages: 0,
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset page when searching
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1; // Reset page when filtering
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        // También actualizar currentProduct si es el mismo
        if (state.currentProduct && state.currentProduct._id === action.payload._id) {
          state.currentProduct = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.currentProduct = null;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add product images
      .addCase(addProductImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductImages.fulfilled, (state, action) => {
        state.loading = false;
        // Actualizar el producto en la lista
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        // Actualizar currentProduct si es el mismo
        if (state.currentProduct && state.currentProduct._id === action.payload._id) {
          state.currentProduct = action.payload;
        }
        state.error = null;
      })
      .addCase(addProductImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove product image
      .addCase(removeProductImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProductImage.fulfilled, (state, action) => {
        state.loading = false;
        // Actualizar el producto en la lista
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        // Actualizar currentProduct si es el mismo
        if (state.currentProduct && state.currentProduct._id === action.payload._id) {
          state.currentProduct = action.payload;
        }
        state.error = null;
      })
      .addCase(removeProductImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearchTerm,
  setSelectedCategory,
  setCurrentPage,
  setCurrentProduct,
  clearError,
} = productsSlice.actions;

export default productsSlice.reducer;

// Selectores
export const selectProducts = (state) => state.products.items;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectSearchTerm = (state) => state.products.searchTerm;
export const selectSelectedCategory = (state) => state.products.selectedCategory;
export const selectCurrentPage = (state) => state.products.currentPage;
export const selectCurrentProduct = (state) => state.products.currentProduct;

// Selector para productos filtrados
export const selectFilteredProducts = createSelector(
  [
    (state) => state.products.items,
    (state) => state.products.searchTerm,
    (state) => state.products.selectedCategory
  ],
  (items, searchTerm, selectedCategory) => {
    if (!items || items.length === 0) return [];
    
    return items.filter(product => {
      // Filtro por término de búsqueda
      const matchesSearch = !searchTerm || 
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro por categoría
      const matchesCategory = selectedCategory === 'all' || 
        (product.categoria && product.categoria._id === selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
  }
);