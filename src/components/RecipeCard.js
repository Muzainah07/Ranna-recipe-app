import React, { useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { useTheme } from '../utils/ThemeContext';

const { width } = Dimensions.get('window');

export default function RecipeCard({ meal, onPress }) {
  const { theme } = useTheme();
  
  // Entrance animations
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  // Press micro-interaction
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true })
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(pressScale, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(pressScale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ opacity, transform: [{ scale: Animated.multiply(scale, pressScale) }] }}>
      <TouchableOpacity
        style={[
          styles.card, 
          { backgroundColor: theme.card, shadowColor: theme.text }
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.imageWrapper}>
          <Image source={{ uri: meal.strMealThumb }} style={styles.image} resizeMode="cover" />
          {meal.strCategory && (
            <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
              <Text style={styles.badgeText}>{meal.strCategory}</Text>
            </View>
          )}
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
            {meal.strMeal}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { 
    width: width / 2 - 24, 
    borderRadius: 16, 
    margin: 8, 
    overflow: 'hidden',
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 4/3,
    position: 'relative'
  },
  image: { 
    width: '100%', 
    height: '100%' 
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1A1D20',
    textTransform: 'uppercase',
  },
  info: { 
    padding: 12 
  },
  name: { 
    fontSize: 15, 
    fontWeight: '600', 
    lineHeight: 20 
  },
});
