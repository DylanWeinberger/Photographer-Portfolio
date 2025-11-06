import type { ColorScheme } from '@/types/sanity'

/**
 * COLOR SCHEME HELPER
 *
 * Maps color scheme presets to actual color values.
 * Handles both presets and custom colors for tag pages.
 */

// Predefined color scheme presets
const presetColors = {
  light: {
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#3b82f6',
  },
  dark: {
    backgroundColor: '#1f2937',
    textColor: '#f9fafb',
    accentColor: '#60a5fa',
  },
  warm: {
    backgroundColor: '#fef3c7',
    textColor: '#78350f',
    accentColor: '#f59e0b',
  },
  cool: {
    backgroundColor: '#dbeafe',
    textColor: '#1e3a8a',
    accentColor: '#3b82f6',
  },
} as const

/**
 * Get computed colors for a color scheme
 *
 * @param colorScheme - Color scheme object from Sanity
 * @returns Object with backgroundColor, textColor, and accentColor
 */
export function getColorSchemeStyles(colorScheme?: ColorScheme) {
  // Default to light if no color scheme provided
  if (!colorScheme || !colorScheme.preset) {
    return presetColors.light
  }

  // If custom preset, use custom colors if provided
  if (colorScheme.preset === 'custom') {
    return {
      backgroundColor: colorScheme.backgroundColor?.hex || presetColors.light.backgroundColor,
      textColor: colorScheme.textColor?.hex || presetColors.light.textColor,
      accentColor: colorScheme.accentColor?.hex || presetColors.light.accentColor,
    }
  }

  // Otherwise use the preset
  return presetColors[colorScheme.preset]
}
