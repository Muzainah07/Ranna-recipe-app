import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from './src/store/index';
import { setRecipes } from './src/store/savedRecipesSlice';
import { ThemeProvider } from './src/utils/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

// Inner component so it can use Redux hooks
function AppInner() {
  const dispatch = useDispatch();

  // On app launch: load saved recipes from AsyncStorage into Redux
  useEffect(() => {
    const loadSaved = async () => {
      try {
        const stored = await AsyncStorage.getItem('savedRecipes');
        if (stored) dispatch(setRecipes(JSON.parse(stored)));
      } catch (e) {
        console.log('Failed to load saved recipes:', e);
      }
    };
    loadSaved();

    // Subscribe to Redux store changes and sync to AsyncStorage
    const unsubscribe = store.subscribe(async () => {
      const state = store.getState();
      try {
        await AsyncStorage.setItem('savedRecipes', JSON.stringify(state.savedRecipes.savedRecipes));
      } catch (e) {
        console.log('Failed to save recipes:', e);
      }
    });

    return unsubscribe; // Cleanup subscription when app unmounts
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppInner />
      </ThemeProvider>
    </Provider>
  );
}
