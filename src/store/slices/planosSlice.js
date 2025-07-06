import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'http://localhost:3000';

// Thunk para obtener todos los planos con paginación
export const fetchPlanos = createAsyncThunk(
  'planos/fetchPlanos',
  async ({ page = 1, limit = 12 } = {}, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/planos?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Error al obtener planos');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para obtener un plano por ID
export const fetchPlanoById = createAsyncThunk(
  'planos/fetchPlanoById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/planos/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener el plano');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// CORREGIDO: Thunk para obtener preview del PDF
export const fetchPlanoPreview = createAsyncThunk(
  'planos/fetchPlanoPreview',
  async (id, { rejectWithValue }) => {
    try {
      console.log('🔄 Iniciando fetchPlanoPreview para ID:', id);
      
      const response = await fetch(`${API_BASE_URL}/planos/preview/${id}`);
      console.log('📡 Respuesta del servidor:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // Verificar el content-type
      const contentType = response.headers.get('content-type');
      console.log('📋 Content-Type:', contentType);
      
      if (contentType && contentType.includes('application/pdf')) {
        // Es un PDF, crear blob URL
        const blob = await response.blob();
        const previewUrl = URL.createObjectURL(blob);
        console.log('✅ PDF blob URL creada:', previewUrl);
        
        // Obtener información adicional de las headers
        const previewPagesHeader = response.headers.get('X-Preview-Pages');
        const previewPages = previewPagesHeader ? 
          previewPagesHeader.split(',').map(Number) : 
          [1, 2, 3];
        
        console.log('📄 Páginas de preview:', previewPages);
        
        return {
          previewUrl,
          previewPages,
          planoId: id,
          contentType: 'application/pdf'
        };
      } else {
        // Podría ser JSON con una URL
        const data = await response.json();
        console.log('📄 Datos de preview JSON:', data);
        
        return {
          previewUrl: data.previewUrl || data.url,
          previewPages: data.previewPages || [1, 2, 3],
          planoId: id,
          contentType: 'application/json'
        };
      }
    } catch (error) {
      console.error('❌ Error en fetchPlanoPreview:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para buscar planos (coincide con tu endpoint /search)
export const searchPlanos = createAsyncThunk(
  'planos/searchPlanos',
  async ({ query, page = 1, limit = 12 }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/planos/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Error al buscar planos');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para crear un nuevo plano
export const createPlano = createAsyncThunk(
  'planos/createPlano',
  async (planoData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Agregar los datos del plano al FormData
      Object.keys(planoData).forEach(key => {
        if (key === 'archivo' && planoData[key]) {
          formData.append('archivo', planoData[key]);
        } else if (key === 'preview' && Array.isArray(planoData[key])) {
          // Convertir array a string para envío
          formData.append(key, JSON.stringify(planoData[key]));
        } else if (planoData[key] !== undefined && planoData[key] !== null) {
          formData.append(key, planoData[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/planos`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el plano');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para actualizar un plano
export const updatePlano = createAsyncThunk(
  'planos/updatePlano',
  async ({ id, planoData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Agregar los datos del plano al FormData
      Object.keys(planoData).forEach(key => {
        if (key === 'archivo' && planoData[key]) {
          formData.append('archivo', planoData[key]);
        } else if (key === 'preview' && Array.isArray(planoData[key])) {
          // Convertir array a string para envío
          formData.append(key, JSON.stringify(planoData[key]));
        } else if (planoData[key] !== undefined && planoData[key] !== null) {
          formData.append(key, planoData[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/planos/${id}`, {
        method: 'PATCH',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el plano');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para eliminar un plano
export const deletePlano = createAsyncThunk(
  'planos/deletePlano',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/planos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el plano');
      }
      
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para simular compra de plano
export const purchasePlano = createAsyncThunk(
  'planos/purchasePlano',
  async ({ id, purchaseData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/planos/purchase/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al procesar la compra');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para obtener URL de descarga (después de compra)
export const getDownloadUrl = createAsyncThunk(
  'planos/getDownloadUrl',
  async ({ id, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/planos/download/${id}?userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'No tienes acceso a este plano');
      }
      
      // Si la respuesta es exitosa, devolver la URL para descarga
      return {
        downloadUrl: `${API_BASE_URL}/planos/download/${id}?userId=${userId}`,
        planoId: id,
        userId: userId
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const planosSlice = createSlice({
  name: 'planos',
  initialState: {
    // Datos principales
    items: [],
    selectedPlano: null,
    searchResults: [],
    
    // CORREGIDO: Estados para preview
    previewData: {},
    
    // Estados de carga
    loading: false,
    searchLoading: false,
    previewLoading: false,
    error: null,
    previewError: null,
    
    // Estados de operaciones
    creating: false,
    updating: false,
    deleting: false,
    purchasing: false,
    
    // Paginación
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    
    // Búsqueda
    lastSearchQuery: '',
    searchCurrentPage: 1,
    searchTotalPages: 1,
    searchTotalItems: 0,
    
    // Compras
    purchaseResult: null,
    downloadUrl: null,
  },
  reducers: {
    // Limpiar estados
    clearError: (state) => {
      state.error = null;
      state.previewError = null;
    },
    clearSelectedPlano: (state) => {
      state.selectedPlano = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.lastSearchQuery = '';
      state.searchCurrentPage = 1;
      state.searchTotalPages = 1;
      state.searchTotalItems = 0;
    },
    clearPurchaseResult: (state) => {
      state.purchaseResult = null;
      state.downloadUrl = null;
    },
    
    // CORREGIDO: Limpiar datos de preview
    clearPreviewData: (state, action) => {
      const planoId = action.payload;
      if (planoId) {
        // Limpiar URL blob para evitar memory leaks
        if (state.previewData[planoId]?.previewUrl) {
          URL.revokeObjectURL(state.previewData[planoId].previewUrl);
        }
        delete state.previewData[planoId];
      } else {
        // Limpiar todas las URLs blob
        Object.values(state.previewData).forEach(data => {
          if (data?.previewUrl) {
            URL.revokeObjectURL(data.previewUrl);
          }
        });
        state.previewData = {};
      }
    },
    
    // Setters
    setSelectedPlano: (state, action) => {
      state.selectedPlano = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSearchCurrentPage: (state, action) => {
      state.searchCurrentPage = action.payload;
    },
    setLastSearchQuery: (state, action) => {
      state.lastSearchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch planos
      .addCase(fetchPlanos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlanos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.planos;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.total;
        state.currentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(fetchPlanos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch plano by ID
      .addCase(fetchPlanoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlanoById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPlano = action.payload;
        state.error = null;
      })
      .addCase(fetchPlanoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // CORREGIDO: Fetch preview
      .addCase(fetchPlanoPreview.pending, (state) => {
        state.previewLoading = true;
        state.previewError = null;
      })
      .addCase(fetchPlanoPreview.fulfilled, (state, action) => {
        console.log('✅ Preview guardado en Redux:', action.payload);
        state.previewLoading = false;
        state.previewData[action.payload.planoId] = action.payload;
        state.previewError = null;
      })
      .addCase(fetchPlanoPreview.rejected, (state, action) => {
        console.error('❌ Error de preview en Redux:', action.payload);
        state.previewLoading = false;
        state.previewError = action.payload;
      })
      
      // Search planos
      .addCase(searchPlanos.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchPlanos.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.planos;
        state.searchTotalPages = action.payload.totalPages;
        state.searchTotalItems = action.payload.total;
        state.searchCurrentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(searchPlanos.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      })
      
      // Create plano
      .addCase(createPlano.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createPlano.fulfilled, (state, action) => {
        state.creating = false;
        // Agregar el nuevo plano al inicio de la lista
        state.items.unshift(action.payload);
        state.totalItems += 1;
        state.error = null;
      })
      .addCase(createPlano.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })
      
      // Update plano
      .addCase(updatePlano.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updatePlano.fulfilled, (state, action) => {
        state.updating = false;
        
        // Actualizar en la lista principal
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        
        // Actualizar en resultados de búsqueda si existe
        const searchIndex = state.searchResults.findIndex(item => item._id === action.payload._id);
        if (searchIndex !== -1) {
          state.searchResults[searchIndex] = action.payload;
        }
        
        // Actualizar plano seleccionado si es el mismo
        if (state.selectedPlano && state.selectedPlano._id === action.payload._id) {
          state.selectedPlano = action.payload;
        }
        
        state.error = null;
      })
      .addCase(updatePlano.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      
      // Delete plano
      .addCase(deletePlano.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deletePlano.fulfilled, (state, action) => {
        state.deleting = false;
        
        // Eliminar de la lista principal
        state.items = state.items.filter(item => item._id !== action.payload);
        state.totalItems -= 1;
        
        // Eliminar de resultados de búsqueda
        state.searchResults = state.searchResults.filter(item => item._id !== action.payload);
        
        // Limpiar plano seleccionado si es el mismo
        if (state.selectedPlano && state.selectedPlano._id === action.payload) {
          state.selectedPlano = null;
        }
        
        // Limpiar datos de preview
        if (state.previewData[action.payload]?.previewUrl) {
          URL.revokeObjectURL(state.previewData[action.payload].previewUrl);
        }
        delete state.previewData[action.payload];
        
        state.error = null;
      })
      .addCase(deletePlano.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })

      // Purchase plano
      .addCase(purchasePlano.pending, (state) => {
        state.purchasing = true;
        state.error = null;
      })
      .addCase(purchasePlano.fulfilled, (state, action) => {
        state.purchasing = false;
        state.purchaseResult = action.payload;
        state.downloadUrl = action.payload.downloadUrl;
        state.error = null;
      })
      .addCase(purchasePlano.rejected, (state, action) => {
        state.purchasing = false;
        state.error = action.payload;
      })

      // Get download URL
      .addCase(getDownloadUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDownloadUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.downloadUrl = action.payload.downloadUrl;
        state.error = null;
      })
      .addCase(getDownloadUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearSelectedPlano,
  clearSearchResults,
  clearPurchaseResult,
  clearPreviewData,
  setSelectedPlano,
  setCurrentPage,
  setSearchCurrentPage,
  setLastSearchQuery,
} = planosSlice.actions;

export default planosSlice.reducer;

// Selectores existentes
export const selectPlanos = (state) => state.planos.items;
export const selectSelectedPlano = (state) => state.planos.selectedPlano;
export const selectSearchResults = (state) => state.planos.searchResults;
export const selectPlanosLoading = (state) => state.planos.loading;
export const selectSearchLoading = (state) => state.planos.searchLoading;
export const selectPlanosError = (state) => state.planos.error;
export const selectPlanosCreating = (state) => state.planos.creating;
export const selectPlanosUpdating = (state) => state.planos.updating;
export const selectPlanosDeleting = (state) => state.planos.deleting;
export const selectPlanosPurchasing = (state) => state.planos.purchasing;

// CORREGIDOS: Selectores para preview
export const selectPreviewLoading = (state) => state.planos.previewLoading;
export const selectPreviewData = (state, planoId) => state.planos.previewData[planoId];
export const selectPreviewError = (state) => state.planos.previewError;

// Selectores de paginación
export const selectCurrentPage = (state) => state.planos.currentPage;
export const selectTotalPages = (state) => state.planos.totalPages;
export const selectTotalItems = (state) => state.planos.totalItems;

// Selectores de búsqueda
export const selectLastSearchQuery = (state) => state.planos.lastSearchQuery;
export const selectSearchCurrentPage = (state) => state.planos.searchCurrentPage;
export const selectSearchTotalPages = (state) => state.planos.searchTotalPages;
export const selectSearchTotalItems = (state) => state.planos.searchTotalItems;

// Selectores de compras
export const selectPurchaseResult = (state) => state.planos.purchaseResult;
export const selectDownloadUrl = (state) => state.planos.downloadUrl;

// Selector para obtener un plano por ID
export const selectPlanoById = (state, planoId) => 
  state.planos.items.find(plano => plano._id === planoId) ||
  state.planos.searchResults.find(plano => plano._id === planoId);

// Selector para verificar si hay resultados de búsqueda
export const selectHasSearchResults = (state) => 
  state.planos.searchResults.length > 0 || state.planos.lastSearchQuery !== '';

// Selector para verificar si hay una compra en progreso
export const selectHasPurchaseInProgress = (state) => 
  state.planos.purchasing || state.planos.purchaseResult !== null;