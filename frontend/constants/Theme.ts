// Theme Mode Types
export type ThemeMode = 'light' | 'dark' | 'daylight';

// Shared Tokens (Standardized for Premium Feel)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

// Corner Radius - 32px standard for soft, premium elements
export const Radius = {
  sm: 12,
  md: 20,
  lg: 32,
  full: 999,
};

// Mode-Specific Palettes (Shifting to Royal Blue / Indigo & Teal)
export const Palettes = {
  light: {
    primary: '#3B52FF',       // Royal Blue
    primaryLight: '#EDF0FF',
    accent: '#10B981',        // Teal
    background: '#F8FAFC',    // Minimal off-white
    surface: '#FFFFFF',
    text: '#1E1B4B',          // Deep Indigo for visibility
    textSecondary: '#64748B', 
    success: '#10B981',
    error: '#EF4444', 
    border: '#F1F5F9',
    card: '#FFFFFF',
    shadow: 'rgba(59, 82, 255, 0.08)',
  },
  dark: {
    primary: '#5D71FF',   
    primaryLight: '#1E223D',
    accent: '#34D399', 
    background: '#0F172A', 
    surface: '#1E293B',    
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    success: '#34D399',
    error: '#EF4444',
    border: '#334155',
    card: '#1E293B',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
  daylight: {
    primary: '#3B52FF',
    primaryLight: '#F0F4FF',
    accent: '#10B981',
    background: '#FFFDF5', 
    surface: '#FFFFFF',    
    text: '#2D241E',      
    textSecondary: '#5D5046',
    success: '#2E7D32',
    error: '#C62828',
    border: '#EBE0C9',
    card: '#FFFFFF',
    shadow: 'rgba(59, 82, 255, 0.05)',
  }
};

// Current fallback (Defaulting to the new Light Premium Palette)
export const Colors = Palettes.light;

export const Typography = {
  size: FontSizes,
  h1: {
    fontSize: FontSizes.xxl,
    fontWeight: '800' as const, // Extra bold for primary greetings
    letterSpacing: -1,
  },
  h2: {
    fontSize: FontSizes.xl,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: FontSizes.lg,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: FontSizes.md,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: FontSizes.sm,
    fontWeight: '500' as const,
    color: '#64748B',
  },
  cta: {
     fontSize: 18,
     fontWeight: '700' as const,
  }
};
