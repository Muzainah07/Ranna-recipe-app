import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import CategoryCard from '../components/CategoryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useTheme } from '../utils/ThemeContext';

const BASE = 'https://www.themealdb.com/api/json/v1/1';

export default function CategoriesScreen({ navigation }) {
  const { theme } = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE}/categories.php`);
      setCategories(res.data.categories || []);
    } catch { setError('Could not load categories.'); }
    finally { setLoading(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCategories} />;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>All Categories</Text>
      <FlatList
        data={categories}
        keyExtractor={item => item.idCategory}
        numColumns={2}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            onPress={() => navigation.navigate('CategoryMeals', { categoryName: item.strCategory })}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', padding: 16, paddingTop: 50 },
  list: { alignItems: 'center', paddingBottom: 20 },
});
