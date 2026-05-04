import React, { useRef } from 'react';
import { Text, Image, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { useTheme } from '../utils/ThemeContext';

const { width } = Dimensions.get('window');

export default function CategoryCard({ category, onPress }) {
  const { theme } = useTheme();
  const pressScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(pressScale, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(pressScale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: pressScale }] }}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Image source={{ uri: category.strCategoryThumb }} style={styles.image} resizeMode="cover" />
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {category.strCategory}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { width: width / 2 - 24, borderRadius: 12, margin: 8, borderWidth: 1, overflow: 'hidden', alignItems: 'center' },
  image: { width: '100%', height: 110 },
  name: { fontSize: 14, fontWeight: '600', padding: 8, textAlign: 'center' },
});
