import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';

export default function SearchBar({ value, onChangeText, placeholder }) {
  const { theme } = useTheme();
  return (
    <View style={[
      styles.container, 
      { backgroundColor: theme.card, shadowColor: theme.text }
    ]}>
      <Ionicons name="search" size={20} color={theme.subtext} style={styles.icon} />
      <TextInput
        style={[styles.input, { color: theme.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || 'Search recipes...'}
        placeholderTextColor={theme.subtext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: 999, // Pill shape
    paddingHorizontal: 20, 
    marginHorizontal: 16,
    marginVertical: 16, 
    height: 54,
    elevation: 3, // Shadow for Android
    shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  icon: { 
    marginRight: 12 
  },
  input: { 
    flex: 1, 
    fontSize: 16,
    fontWeight: '400'
  },
});
