// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productSlice';
import categoriesReducer from './slices/categoriesSlice';
import planosReducer from './slices/planosSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    planos: planosReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar estas rutas para archivos de imagen y PDF
        ignoredActionsPaths: ['payload.imagen', 'payload.archivo'],
        ignoredStatePaths: ['products.currentProduct.imagen', 'planos.selectedPlano.archivo'],
      },
    }),
});

// Si necesitas los tipos en otros archivos, puedes exportar el store
// y usar typeof store.getState, etc. directamente donde los necesites

// Si necesitas los tipos en otros archivos, puedes exportar el store
// y usar typeof store.getState, etc. directamente donde los necesites