
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'http://localhost:3000';

// Thunk para obtener todos los planos
export const fetchPlanos = createAsyncThunk(
  'planos/fetchPlanos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/planos`);
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

// Thunk para obtener planos con preview y paginación
export const fetchPlanosPreview = createAsyncThunk(
  'planos/fetchPlanosPreview',
  async ({ page, limit } = {}, { rejectWithValue }) => {
    try {
      let url = `${API_BASE_URL}/planos/preview`;
      if (page && limit) {
        url += `?page=${page}&limit=${limit}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener preview de planos');
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

// Thunk para obtener información de preview de un plano específico
export const fetchPlanoPreviewInfo = createAsyncThunk(
  'planos/fetchPlanoPreviewInfo',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/planos/preview/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener información de preview');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para buscar planos con filtros
export const searchPlanosWithFilters = createAsyncThunk(
  'planos/searchPlanosWithFilters',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/planos/search?${queryParams}`);
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

// Thunk para buscar planos por título
export const searchPlanosByTitle = createAsyncThunk(
  'planos/searchPlanosByTitle',
  async (titulo, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/planos/search/title/${encodeURIComponent(titulo)}`);
      if (!response.ok) {
        throw new Error('Error al buscar planos por título');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para buscar planos por categoría
export const searchPlanosByCategory = createAsyncThunk(
  'planos/searchPlanosByCategory',
  async (categoria, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/planos/search/categoria/${encodeURIComponent(categoria)}`);
      if (!response.ok) {
        throw new Error('Error al buscar planos por categoría');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para buscar planos por tipo de máquina
export const searchPlanosByMachineType = createAsyncThunk(
  'planos/searchPlanosByMachineType',
  async (tipo, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/planos/search/tipo-maquina/${encodeURIComponent(tipo)}`);
      if (!response.ok) {
        throw new Error('Error al buscar planos por tipo de máquina');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para buscar planos por dificultad
export const searchPlanosByDifficulty = createAsyncThunk(
  'planos/searchPlanosByDifficulty',
  async (dificultad, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/planos/search/dificultad/${dificultad}`);
      if (!response.ok) {
        throw new Error('Error al buscar planos por dificultad');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para buscar planos por rango de precio
export const searchPlanosByPriceRange = createAsyncThunk(
  'planos/searchPlanosByPriceRange',
  async ({ min, max }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/planos/search/precio?min=${min}&max=${max}`);
      if (!response.ok) {
        throw new Error('Error al buscar planos por rango de precio');
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

// Thunk para actualizar solo el archivo de un plano
export const updatePlanoFile = createAsyncThunk(
  'planos/updatePlanoFile',
  async ({ id, archivo }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('archivo', archivo);

      const response = await fetch(`${API_BASE_URL}/planos/file/${id}`, {
        method: 'PATCH',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el archivo');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para eliminar archivo de un plano
export const removePlanoFile = createAsyncThunk(
  'planos/removePlanoFile',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/planos/file/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el archivo');
      }
      
      const data = await response.json();
      return { id, ...data };
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

// Thunk para obtener estadísticas (admin)
export const fetchPlanosStats = createAsyncThunk(
  'planos/fetchPlanosStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/planos/admin/stats`);
      if (!response.ok) {
        throw new Error('Error al obtener estadísticas');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const planosSlice = createSlice({
  name: 'planos',
  initialState: {
    items: [],
    previewItems: [],
    selectedPlano: null,
    searchResults: [],
    stats: null,
    loading: false,
    previewLoading: false,
    searchLoading: false,
    statsLoading: false,
    error: null,
    creating: false,
    updating: false,
    deleting: false,
    purchasing: false,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    filters: {
      categoria: '',
      tipo_maquina: '',
      dificultad: '',
      minPrice: '',
      maxPrice: '',
    },
    lastSearchQuery: '',
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedPlano: (state) => {
      state.selectedPlano = null;
    },
    setSelectedPlano: (state, action) => {
      state.selectedPlano = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        categoria: '',
        tipo_maquina: '',
        dificultad: '',
        minPrice: '',
        maxPrice: '',
      };
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.lastSearchQuery = '';
    },
    setLastSearchQuery: (state, action) => {
      state.lastSearchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all planos
      .addCase(fetchPlanos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlanos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchPlanos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch planos preview
      .addCase(fetchPlanosPreview.pending, (state) => {
        state.previewLoading = true;
        state.error = null;
      })
      .addCase(fetchPlanosPreview.fulfilled, (state, action) => {
        state.previewLoading = false;
        if (action.payload.planos) {
          // Respuesta paginada
          state.previewItems = action.payload.planos;
          state.totalPages = action.payload.totalPages;
          state.totalItems = action.payload.totalItems;
          state.currentPage = action.payload.currentPage;
        } else {
          // Respuesta simple
          state.previewItems = action.payload;
        }
        state.error = null;
      })
      .addCase(fetchPlanosPreview.rejected, (state, action) => {
        state.previewLoading = false;
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

      // Fetch plano preview info
      .addCase(fetchPlanoPreviewInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlanoPreviewInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPlano = action.payload;
        state.error = null;
      })
      .addCase(fetchPlanoPreviewInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Search planos with filters
      .addCase(searchPlanosWithFilters.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchPlanosWithFilters.fulfilled, (state, action) => {
        state.searchLoading = false;
        if (action.payload.planos) {
          // Respuesta paginada
          state.searchResults = action.payload.planos;
          state.totalPages = action.payload.totalPages;
          state.totalItems = action.payload.totalItems;
          state.currentPage = action.payload.currentPage;
        } else {
          // Respuesta simple
          state.searchResults = action.payload;
        }
        state.error = null;
      })
      .addCase(searchPlanosWithFilters.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      })

      // Search by title
      .addCase(searchPlanosByTitle.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchPlanosByTitle.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(searchPlanosByTitle.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      })

      // Search by category
      .addCase(searchPlanosByCategory.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchPlanosByCategory.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(searchPlanosByCategory.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      })

      // Search by machine type
      .addCase(searchPlanosByMachineType.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchPlanosByMachineType.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(searchPlanosByMachineType.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      })

      // Search by difficulty
      .addCase(searchPlanosByDifficulty.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchPlanosByDifficulty.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(searchPlanosByDifficulty.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      })

      // Search by price range
      .addCase(searchPlanosByPriceRange.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchPlanosByPriceRange.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(searchPlanosByPriceRange.rejected, (state, action) => {
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
        state.items.push(action.payload);
        state.previewItems.push(action.payload);
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
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        const previewIndex = state.previewItems.findIndex(item => item._id === action.payload._id);
        if (previewIndex !== -1) {
          state.previewItems[previewIndex] = action.payload;
        }
        if (state.selectedPlano && state.selectedPlano._id === action.payload._id) {
          state.selectedPlano = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePlano.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // Update plano file
      .addCase(updatePlanoFile.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updatePlanoFile.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedPlano && state.selectedPlano._id === action.payload._id) {
          state.selectedPlano = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePlanoFile.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // Remove plano file
      .addCase(removePlanoFile.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(removePlanoFile.fulfilled, (state, action) => {
        state.updating = false;
        // Actualizar el plano sin archivo
        const index = state.items.findIndex(item => item._id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], archivo: null };
        }
        if (state.selectedPlano && state.selectedPlano._id === action.payload.id) {
          state.selectedPlano = { ...state.selectedPlano, archivo: null };
        }
        state.error = null;
      })
      .addCase(removePlanoFile.rejected, (state, action) => {
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
        state.items = state.items.filter(item => item._id !== action.payload);
        state.previewItems = state.previewItems.filter(item => item._id !== action.payload);
        state.searchResults = state.searchResults.filter(item => item._id !== action.payload);
        if (state.selectedPlano && state.selectedPlano._id === action.payload) {
          state.selectedPlano = null;
        }
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
        // Aquí podrías agregar lógica adicional para manejar compras exitosas
        state.error = null;
      })
      .addCase(purchasePlano.rejected, (state, action) => {
        state.purchasing = false;
        state.error = action.payload;
      })

      // Fetch stats
      .addCase(fetchPlanosStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchPlanosStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchPlanosStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearSelectedPlano,
  setSelectedPlano,
  setCurrentPage,
  setFilters,
  clearFilters,
  clearSearchResults,
  setLastSearchQuery,
} = planosSlice.actions;

export default planosSlice.reducer;

// Selectores
export const selectPlanos = (state) => state.planos.items;
export const selectPlanosPreview = (state) => state.planos.previewItems;
export const selectSelectedPlano = (state) => state.planos.selectedPlano;
export const selectSearchResults = (state) => state.planos.searchResults;
export const selectPlanosStats = (state) => state.planos.stats;
export const selectPlanosLoading = (state) => state.planos.loading;
export const selectPlanosPreviewLoading = (state) => state.planos.previewLoading;
export const selectPlanosSearchLoading = (state) => state.planos.searchLoading;
export const selectPlanosStatsLoading = (state) => state.planos.statsLoading;
export const selectPlanosError = (state) => state.planos.error;
export const selectPlanosCreating = (state) => state.planos.creating;
export const selectPlanosUpdating = (state) => state.planos.updating;
export const selectPlanosDeleting = (state) => state.planos.deleting;
export const selectPlanosPurchasing = (state) => state.planos.purchasing;
export const selectCurrentPage = (state) => state.planos.currentPage;
export const selectTotalPages = (state) => state.planos.totalPages;
export const selectTotalItems = (state) => state.planos.totalItems;
export const selectPlanosFilters = (state) => state.planos.filters;
export const selectLastSearchQuery = (state) => state.planos.lastSearchQuery;

// Selector para obtener un plano por ID
export const selectPlanoById = (state, planoId) => 
  state.planos.items.find(plano => plano._id === planoId) ||
  state.planos.previewItems.find(plano => plano._id === planoId) ||
  state.planos.searchResults.find(plano => plano._id === planoId);

// Selector para verificar si hay filtros activos
export const selectHasActiveFilters = (state) => {
  const filters = state.planos.filters;
  return Object.values(filters).some(value => value !== '');
};