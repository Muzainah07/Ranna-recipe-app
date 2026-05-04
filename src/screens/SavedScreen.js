import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeRecipe } from '../store/savedRecipesSlice';
import RecipeCard from '../components/RecipeCard';
import { useTheme } from '../utils/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function SavedScreen({ navigation }) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const savedRecipes = useSelector(state => state.savedRecipes.savedRecipes);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>❤ Saved Recipes</Text>
      {savedRecipes.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={64} color={theme.subtext} />
          <Text style={[styles.emptyText, { color: theme.subtext }]}>No saved recipes yet.</Text>
          <Text style={[styles.emptySubtext, { color: theme.subtext }]}>Tap the heart on any recipe to save it!</Text>
        </View>
      ) : (
        <FlatList
          data={savedRecipes}
          keyExtractor={item => item.idMeal}
          numColumns={2}
          renderItem={({ item }) => (
            <View>
              <RecipeCard
                meal={item}
                onPress={() => navigation.navigate('RecipeDetail', { mealId: item.idMeal })}
              />
              <TouchableOpacity
                style={[styles.removeBtn, { backgroundColor: theme.error }]}
                onPress={() => dispatch(removeRecipe(item.idMeal))}
              >
                <Text style={styles.removeBtnText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', padding: 16, paddingTop: 50 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  emptyText: { fontSize: 18, fontWeight: '600', marginTop: 12 },
  emptySubtext: { fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },
  removeBtn: { marginHorizontal: 8, marginTop: -4, marginBottom: 8, borderRadius: 8, padding: 6, alignItems: 'center' },
  removeBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
