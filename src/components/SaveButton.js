import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';

export default function SaveButton({ isSaved, onPress }) {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.3, useNativeDriver: true, speed: 20 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20 })
    ]).start();
  }, [isSaved]);

  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 8 }} activeOpacity={0.7}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Ionicons
          name={isSaved ? 'heart' : 'heart-outline'}
          size={28}
          color={isSaved ? theme.saved : theme.unsaved}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}
