import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE = 'https://www.themealdb.com/api/json/v1/1';

// Thunks using axios to connect to Public API
export const fetchHomeData = createAsyncThunk('meals/fetchHomeData', async () => {
  const [randomRes, catRes, mealsRes] = await Promise.all([
    axios.get(`${BASE}/random.php`),
    axios.get(`${BASE}/categories.php`),
    axios.get(`${BASE}/search.php?s=chicken`), // Default featured items
  ]);
  
  return {
    featured: randomRes.data.meals?.[0] || null,
    categories: catRes.data.categories || [],
    meals: mealsRes.data.meals || []
  };
});

export const fetchSearchResults = createAsyncThunk('meals/fetchSearchResults', async (query) => {
  const res = await axios.get(`${BASE}/search.php?s=${query}`);
  return res.data.meals || [];
});

export const fetchCategoryMeals = createAsyncThunk('meals/fetchCategoryMeals', async (category) => {
  const res = await axios.get(`${BASE}/filter.php?c=${category}`);
  return res.data.meals || [];
});

export const fetchMealDetail = createAsyncThunk('meals/fetchMealDetail', async (id) => {
  const res = await axios.get(`${BASE}/lookup.php?i=${id}`);
  return res.data.meals?.[0] || null;
});

const mealsApiSlice = createSlice({
  name: 'mealsApi',
  initialState: {
    homeStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    homeError: null,
    homeData: {
      featured: null,
      categories: [],
      meals: []
    },
    
    searchStatus: 'idle',
    searchMeals: [],
    
    categoryMealsStatus: 'idle',
    categoryMeals: [],
    
    detailStatus: 'idle',
    detailMeal: null,
  },
  reducers: {
    clearSearch(state) {
      state.searchMeals = [];
      state.searchStatus = 'idle';
    },
    clearDetail(state) {
      state.detailMeal = null;
      state.detailStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    // Home Data
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.homeStatus = 'loading';
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.homeStatus = 'succeeded';
        state.homeData = action.payload;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.homeStatus = 'failed';
        state.homeError = action.error.message;
      })
    // Search Data
      .addCase(fetchSearchResults.pending, (state) => {
        state.searchStatus = 'loading';
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.searchStatus = 'succeeded';
        state.searchMeals = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.searchStatus = 'failed';
      })
    // Category Meals
      .addCase(fetchCategoryMeals.pending, (state) => {
        state.categoryMealsStatus = 'loading';
      })
      .addCase(fetchCategoryMeals.fulfilled, (state, action) => {
        state.categoryMealsStatus = 'succeeded';
        state.categoryMeals = action.payload;
      })
      .addCase(fetchCategoryMeals.rejected, (state, action) => {
        state.categoryMealsStatus = 'failed';
      })
    // Detail
      .addCase(fetchMealDetail.pending, (state) => {
        state.detailStatus = 'loading';
      })
      .addCase(fetchMealDetail.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.detailMeal = action.payload;
      })
      .addCase(fetchMealDetail.rejected, (state, action) => {
        state.detailStatus = 'failed';
      });
  }
});

export const { clearSearch, clearDetail } = mealsApiSlice.actions;

export default mealsApiSlice.reducer;
