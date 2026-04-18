# Frontend Skill 01: Project Setup & Design System

## Architecture Overview
The frontend is built with React Native using Expo and File-Based Routing (Expo Router).

## Directory Structure
```
frontend/
├── app/                  # File-based routing (Expo Router)
│   ├── (auth)/           # Authentication flows (Login/OTP)
│   ├── (tabs)/           # Main bottom-tab navigation
│   ├── _layout.tsx       # Root layout provider
│   └── payment.tsx       # Payment modal route
├── components/           # Reusable UI components
├── constants/            # Theme, Colors, API Config
├── hooks/                # Custom React hooks (e.g. useAudio, useAuth)
└── assets/               # Fonts, Images, Icons
```

## Design System (Stitch Prototype)
We maintain a highly aesthetic, premium look in line with modern iOS HIG standards.

### Colors
- **Background**: `#F5F7FA` (Light Gray/Off-White)
- **Primary**: `#2B59FF` (Vibrant Blue - used for primary CTAs and active states)
- **Primary Muted**: `#E5EBFF` (Light Blue background for active items)
- **Accent**: `#FF6B4A` (Coral/Orange - used for streaks, warnings, special callouts)
- **Success**: `#10B981` (Green - used for grammar corrections and badges)
- **Text Primary**: `#1A1C1E` (Nearly black)
- **Text Secondary**: `#6B7280` (Gray - used for subtitles, placeholders)
- **Card Background**: `#FFFFFF` (White)

### Typography
- **Font-Family**: `Inter`
- **Headings**: `Inter-Bold`
- **Body**: `Inter-Medium` or `Inter-Regular`

### Shapes & Shadows
- **Card Border Radius**: `16px`
- **Button Border Radius**: `12px` or fully rounded (`999px`)
- **Card Shadow**: Subtle drop shadow (`rgba(0,0,0,0.05)`, 0px 4px 12px)

## Styling Approach
Use `StyleSheet.create` for all styling. Rely heavily on Flexbox for layout. Ensure components are responsive to different device sizes.

## API Integration
- All API requests to the FastAPI backend should go through an axios instance configured in `constants/api.ts`.
- The instance must inject the Firebase JWT from `expo-secure-store` into the `Authorization` header.
