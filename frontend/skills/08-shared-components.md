# Frontend Skill 08: Shared UI Components

## Overview
All UI primitives should be centralized in `frontend/components/` to maintain the design system easily. No ad-hoc styling of standard elements.

## Component Library
1. **`Button`**: 
   - Variants: `primary`, `secondary`, `outline`, `ghost`.
   - Props: `title`, `onPress`, `loading` (shows spinner), `icon`.
   - Primary default color: `#2B59FF`.
2. **`Card`**:
   - Container component with white background, 16px radius, and standard shadow.
3. **`Typography`**:
   - `Heading`: Uses `Inter-Bold`.
   - `Body`: Uses `Inter-Regular` or `Inter-Medium`.
   - Props: `weight`, `color`, `size`.
4. **`ProgressBar`**:
   - For tracking topic completion or streak visualizer.
   - Props: `progress` (0-100), `color`.
5. **`AudioPlayer`**:
   - Reusable component for TTS elements. Takes a text string and calls the play function.
   - Handles the loading state while the audio stream is fetched.
6. **`Badge`**:
   - Small pill component for Categories (Social, Business) and difficulty tags.

## Icons
Use `@expo/vector-icons` (e.g., Lucide, Feather, or Ionicons) consistently. Ensure icon stroke weights match.
