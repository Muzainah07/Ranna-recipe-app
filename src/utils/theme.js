// Color palettes for light and dark mode
// Every screen imports colors from here — never hardcode colors elsewhere

const lightTheme = {
  background: '#F9F9FB', // Softer, more modern background
  card: '#FFFFFF',
  text: '#1C1C1E',
  subtext: '#8E8E93',
  primary: '#FF6347', // Tomato/Premium Orange
  secondary: '#F0F0F5',
  border: '#E5E5EA',
  tabBar: '#FFFFFF',
  headerText: '#1C1C1E',
  inputBackground: '#FFFFFF',
  saved: '#FF6347',
  unsaved: '#C7C7CC',
  error: '#FF3B30',
  spinner: '#FF6347',
};

const darkTheme = {
  background: '#000000', // True black for premium dark mode
  card: '#1C1C1E', // Apple-like dark gray for cards
  text: '#F2F2F7',
  subtext: '#AEAEB2',
  primary: '#FF6B50', // Slightly lighter orange for dark mode contrast
  secondary: '#2C2C2E',
  border: '#38383A',
  tabBar: '#1C1C1E',
  headerText: '#F2F2F7',
  inputBackground: '#2C2C2E',
  saved: '#FF6B50',
  unsaved: '#636366',
  error: '#FF453A',
  spinner: '#FF6B50',
};

export { lightTheme, darkTheme };
