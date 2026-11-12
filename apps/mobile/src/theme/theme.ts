/**
 * Pulsar Design System Tokens
 * Crafted under Chroma-Craft Craft Floor guidelines:
 * - Domain: Critical public safety & emergency communication
 * - Color Palette: Deep Space Canvas (#080B11), Electric Indigo (#6366F1),
 *   Emergency Crimson (#DC143C), Warning Amber (#F59E0B), Trust Mint (#10B981)
 * - Accessibility: WCAG 2.1 AAA high-contrast on dark surfaces
 */

export const PulsarTheme = {
  colors: {
    // Canvas & Surfaces
    canvas: '#080B11',
    surfacePrimary: '#101522',
    surfaceSecondary: '#161E31',
    surfaceElevated: '#1E293B',
    surfaceBorder: 'rgba(255, 255, 255, 0.08)',
    surfaceBorderFocus: '#6366F1',

    // Text Tokens (High contrast)
    textPrimary: '#FBFBFD',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textInverse: '#080B11',

    // Action & Brand
    accentPrimary: '#6366F1', // Electric Indigo
    accentPrimaryHover: '#4F46E5',
    accentCyan: '#06B6D4',

    // Emergency Critical State
    emergencyCrimson: '#DC143C',
    emergencyGlow: 'rgba(220, 20, 60, 0.35)',
    emergencyCrimsonActive: '#B91C1C',

    // Status Signals
    statusSuccess: '#10B981',
    statusWarning: '#F59E0B',
    statusInfo: '#3B82F6',
    statusOffline: '#64748B',

    // Mesh Transport Colors
    transportBle: '#3B82F6',
    transportWifi: '#10B981',
    transportInternet: '#8B5CF6',
  },

  typography: {
    fontDisplay: 'System',
    fontBody: 'System',
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      hero: 32,
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      heavy: '800' as const,
    },
  },

  radii: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
} as const;
