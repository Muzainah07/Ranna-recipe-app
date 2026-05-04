import { createSlice } from '@reduxjs/toolkit';

const savedRecipesSlice = createSlice({
  name: 'savedRecipes',
  initialState: { savedRecipes: [] },
  reducers: {
    addRecipe: (state, action) => {
      const exists = state.savedRecipes.find(r => r.idMeal === action.payload.idMeal);
      if (!exists) state.savedRecipes.push(action.payload);
    },
    removeRecipe: (state, action) => {
      state.savedRecipes = state.savedRecipes.filter(r => r.idMeal !== action.payload);
    },
    setRecipes: (state, action) => {
      state.savedRecipes = action.payload;
    },
  },
});

export const { addRecipe, removeRecipe, setRecipes } = savedRecipesSlice.actions;
export default savedRecipesSlice.reducer;
