import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { addRecipe, removeRecipe } from '../store/savedRecipesSlice';
import { fetchMealDetail, clearDetail } from '../store/mealsApiSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SaveButton from '../components/SaveButton';
import { useTheme } from '../utils/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function RecipeDetailScreen({ route, navigation }) {
  const { mealId } = route.params;
  const { theme } = useTheme();
  
  const dispatch = useDispatch();
  
  // Local state for Saved UI
  const savedRecipes = useSelector(state => state.savedRecipes.savedRecipes);
  const isSaved = savedRecipes.some(r => r.idMeal === mealId);

  // Redux API State
  const { detailStatus, detailMeal } = useSelector(state => state.mealsApi);
  const meal = detailMeal;

  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => { 
    dispatch(fetchMealDetail(mealId));
    return () => dispatch(clearDetail());
  }, [mealId, dispatch]);

  useEffect(() => {
    if (detailStatus === 'succeeded' && meal) {
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    }
  }, [detailStatus, meal]);

  const handleSaveToggle = () => {
    if (isSaved) dispatch(removeRecipe(mealId));
    else dispatch(addRecipe(meal));
  };

  const handleRetry = () => {
    dispatch(fetchMealDetail(mealId));
  }

  const getIngredients = (m) => {
    const list = [];
    if (!m) return list;
    for (let i = 1; i <= 20; i++) {
      const ing = m[`strIngredient${i}`];
      const meas = m[`strMeasure${i}`];
      if (ing && ing.trim()) list.push(`${meas?.trim() || ''} ${ing.trim()}`.trim());
    }
    return list;
  };

  if (detailStatus === 'loading' || detailStatus === 'idle') return <LoadingSpinner />;
  if (detailStatus === 'failed') return <ErrorMessage message="Could not load recipe details." onRetry={handleRetry} />;
  if (!meal) return <ErrorMessage message="Recipe not found." />;

  const ingredients = getIngredients(meal);
  
  // Format instructions properly based on line breaks
  const instructionsList = meal.strInstructions
    ? meal.strInstructions.split(/\r\n|\n/).filter(step => step.trim().length > 0)
    : [];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
          
          <TouchableOpacity 
            style={[styles.floatingBtn, styles.backBtn, { backgroundColor: 'rgba(255,255,255,0.9)' }]} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1A1D20" />
          </TouchableOpacity>

          <View style={[styles.floatingBtn, styles.saveBtn, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <SaveButton isSaved={isSaved} onPress={handleSaveToggle} />
          </View>
        </View>

        <Animated.View style={[
          styles.contentCard, 
          { backgroundColor: theme.background, opacity: fadeAnim }
        ]}>
          <View style={styles.tags}>
            {meal.strCategory && (
              <View style={[styles.tag, { backgroundColor: theme.text }]}>
                <Text style={{ color: theme.background, fontWeight: '700', fontSize: 11, textTransform: 'uppercase' }}>
                  {meal.strCategory}
                </Text>
              </View>
            )}
            {meal.strArea && (
              <View style={[styles.tag, { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border }]}>
                <Text style={{ color: theme.text, fontWeight: '700', fontSize: 11, textTransform: 'uppercase' }}>
                  {meal.strArea}
                </Text>
              </View>
            )}
          </View>

          <Text style={[styles.name, { color: theme.text }]}>{meal.strMeal}</Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Ingredients</Text>
            {ingredients.map((ing, i) => (
              <View key={i} style={[styles.ingredientRow, { borderBottomColor: theme.border }]}>
                <Ionicons name="radio-button-on" size={12} color={theme.primary} style={{ marginRight: 12, marginTop: 4 }} />
                <Text style={[styles.ingredientText, { color: theme.text }]}>
                  {ing}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Instructions</Text>
            {instructionsList.map((step, i) => (
              <View key={i} style={styles.instructionStep}>
                <View style={[styles.stepNumber, { backgroundColor: theme.primary }]}>
                  <Text style={styles.stepNumberText}>{i + 1}</Text>
                </View>
                <Text style={[styles.instructionText, { color: theme.text }]}>{step}</Text>
              </View>
            ))}
          </View>
          
          <View style={{ height: 60 }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: { width: '100%', height: height * 0.45, position: 'relative' },
  image: { width: '100%', height: '100%' },
  floatingBtn: { position: 'absolute', top: 50, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6 },
  backBtn: { left: 20 },
  saveBtn: { right: 20 },
  contentCard: { flex: 1, marginTop: -40, borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 24, paddingTop: 32 },
  tags: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  tag: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  name: { fontSize: 32, fontWeight: 'bold', marginBottom: 32, lineHeight: 40 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  ingredientRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  ingredientText: { fontSize: 16, flex: 1, lineHeight: 24 },
  instructionStep: { flexDirection: 'row', marginBottom: 24 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16, marginTop: 2 },
  stepNumberText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  instructionText: { fontSize: 16, lineHeight: 26, flex: 1 },
});
