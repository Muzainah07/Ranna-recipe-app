import { configureStore } from '@reduxjs/toolkit';
import savedRecipesReducer from './savedRecipesSlice';
import mealsApiReducer from './mealsApiSlice';

const store = configureStore({
  reducer: {
    savedRecipes: savedRecipesReducer,
    mealsApi: mealsApiReducer,
  },
  // Ensure we don't encounter non-serializable warnings for complex data if needed, though raw Axios data should be simple JSON objects.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;
