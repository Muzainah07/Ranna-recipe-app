import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Image, StyleSheet, Dimensions, Animated
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomeData, fetchSearchResults, clearSearch } from '../store/mealsApiSlice';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useTheme } from '../utils/ThemeContext';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const dispatch = useDispatch();

  const [query, setQuery] = useState('');

  // Pulling state and data straight from our Redux Store API slice
  const { homeStatus, homeError, homeData, searchStatus, searchMeals } = useSelector(state => state.mealsApi);
  const { featured, categories, meals } = homeData;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const contentFade = useRef(new Animated.Value(0)).current;

  useEffect(() => { 
    if (homeStatus === 'idle') {
      dispatch(fetchHomeData());
    }
  }, [homeStatus, dispatch]);

  useEffect(() => {
    if (homeStatus === 'succeeded') {
      Animated.stagger(200, [
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true })
        ]),
        Animated.timing(contentFade, { toValue: 1, duration: 600, useNativeDriver: true })
      ]).start();
    }
  }, [homeStatus]);

  const handleSearch = (text) => {
    setQuery(text);
    if (text.length > 2) {
      dispatch(fetchSearchResults(text));
    } else if (text.length === 0) {
      dispatch(clearSearch());
    }
  };

  const handleRetry = () => {
    dispatch(fetchHomeData());
  };

  if (homeStatus === 'loading' || homeStatus === 'idle') return <LoadingSpinner />;
  if (homeStatus === 'failed') return <ErrorMessage message={homeError || "Failed to fetch"} onRetry={handleRetry} />;

  // Determine what grid to show
  const activeMeals = query.length > 2 ? searchMeals : meals;
  const isSearching = query.length > 2;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            Discover your next{'\n'}
            <Text style={{ color: theme.primary, fontStyle: 'italic' }}>masterpiece.</Text>
          </Text>
          <TouchableOpacity onPress={toggleTheme} style={[styles.themeBtn, { backgroundColor: theme.card }]}>
            <Text style={{ color: theme.text, fontSize: 12, fontWeight: '600' }}>
              {isDark ? 'Light' : 'Dark'}
            </Text>
          </TouchableOpacity>
        </View>

        <SearchBar value={query} onChangeText={handleSearch} placeholder="Search any recipe..." />

        <Animated.View style={{ opacity: contentFade }}>

        {!isSearching && featured && (
          <TouchableOpacity
            style={[styles.featuredCard, { backgroundColor: theme.card, shadowColor: theme.text }]}
            onPress={() => navigation.navigate('RecipeDetail', { mealId: featured.idMeal })}
            activeOpacity={0.9}
          >
            <Image source={{ uri: featured.strMealThumb }} style={styles.featuredImage} />
            <View style={styles.overlay}>
              <Text style={styles.featuredLabel}>Featured Today</Text>
              <Text style={styles.featuredName} numberOfLines={2}>{featured.strMeal}</Text>
            </View>
          </TouchableOpacity>
        )}

        {!isSearching && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Categories</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16, paddingBottom: 24 }}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.idCategory}
                  style={[
                    styles.catPill, 
                    { backgroundColor: theme.card, shadowColor: theme.text }
                  ]}
                  onPress={() => navigation.navigate('CategoryMeals', { categoryName: cat.strCategory })}
                >
                  <Text style={[styles.catName, { color: theme.text }]}>{cat.strCategory}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {isSearching ? `Results for "${query}"` : 'Popular Recipes'}
          </Text>
        </View>
        
        {searchStatus === 'loading' ? (
          <LoadingSpinner />
        ) : (
          <View style={styles.grid}>
            {activeMeals && activeMeals.map(meal => (
              <RecipeCard
                key={meal.idMeal}
                meal={meal}
                onPress={() => navigation.navigate('RecipeDetail', { mealId: meal.idMeal })}
              />
            ))}
          </View>
        )}
        
        {(!activeMeals || activeMeals.length === 0) && searchStatus !== 'loading' && (
          <Text style={[styles.empty, { color: theme.subtext }]}>No recipes found.</Text>
        )}
        </Animated.View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', 
    alignItems: 'flex-start', paddingHorizontal: 16, paddingTop: 60, marginBottom: 10
  },
  title: { fontSize: 32, fontWeight: 'bold', lineHeight: 40, width: '75%' },
  themeBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, elevation: 2, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  featuredCard: { marginHorizontal: 16, marginVertical: 16, borderRadius: 20, overflow: 'hidden', elevation: 5, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.15, shadowRadius: 15, position: 'relative' },
  featuredImage: { width: '100%', height: 240 },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', padding: 20, paddingTop: 40 },
  featuredLabel: { color: '#FAFAFA', fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  featuredName: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  sectionHeader: { paddingHorizontal: 16, marginBottom: 16, marginTop: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  catPill: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999, marginRight: 12, elevation: 2, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  catName: { fontSize: 14, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingBottom: 40, paddingHorizontal: 8 },
  empty: { textAlign: 'center', marginTop: 30, fontSize: 16 },
});
