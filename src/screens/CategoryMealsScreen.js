import React, { useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategoryMeals } from '../store/mealsApiSlice';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useTheme } from '../utils/ThemeContext';

export default function CategoryMealsScreen({ route, navigation }) {
  const { categoryName } = route.params;
  const { theme } = useTheme();
  
  const dispatch = useDispatch();
  const { categoryMealsStatus, categoryMeals } = useSelector(state => state.mealsApi);

  useEffect(() => { 
    dispatch(fetchCategoryMeals(categoryName));
  }, [categoryName, dispatch]);

  const handleRetry = () => {
    dispatch(fetchCategoryMeals(categoryName));
  };

  if (categoryMealsStatus === 'loading' || categoryMealsStatus === 'idle') return <LoadingSpinner />;
  if (categoryMealsStatus === 'failed') return <ErrorMessage message="Could not load category meals." onRetry={handleRetry} />;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{categoryName}</Text>
      <FlatList
        data={categoryMeals}
        keyExtractor={item => item.idMeal}
        numColumns={2}
        renderItem={({ item }) => (
          <RecipeCard
            meal={item}
            onPress={() => navigation.navigate('RecipeDetail', { mealId: item.idMeal })}
          />
        )}
        contentContainerStyle={{ alignItems: 'flex-start', paddingBottom: 40, paddingHorizontal: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 32, fontWeight: 'bold', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16 },
});
